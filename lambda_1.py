import json
import boto3
import time
import logging
import urllib.request
import http.client

# Initialize clients and resources
s3_client = boto3.client('s3')
transcribe_client = boto3.client('transcribe')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('transcribeText')
table2 = dynamodb.Table('CallMetadata')
lambda_client = boto3.client('lambda')

from botocore.exceptions import ClientError

class ImageError(Exception):
    "Custom exception for errors returned by Amazon Titan Text models"
    def __init__(self, message):
        self.message = message

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def generate_text(model_id, body):
    logger.info("Generating text with Amazon Titan Text model %s", model_id)

    bedrock = boto3.client(service_name='bedrock-runtime')
    accept = "application/json"
    content_type = "application/json"
    response = bedrock.invoke_model(
        body=body, modelId=model_id, accept=accept, contentType=content_type
    )
    response_body = json.loads(response.get("body").read())
    finish_reason = response_body.get("error")

    if finish_reason is not None:
        raise ImageError(f"Text generation error. Error is {finish_reason}")

    logger.info("Successfully generated text with Amazon Titan Text model %s", model_id)
    return response_body

def lambda_handler(event, context):
    # Log the entire event for debugging
    logger.info("Event received: %s", json.dumps(event))

    # Get the recording file information from the S3 event
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    file_key = event['Records'][0]['s3']['object']['key']
    file_key = urllib.parse.unquote_plus(file_key)
    recording_url = f"s3://{bucket_name}/{file_key}"
    
    parts = file_key.split('/')
    last_part = parts[-1]
    contact_id = last_part.split('_')[0]

    # Start transcription job
    transcribe_job_name = f"transcription_{contact_id}"
    transcribe_client.start_transcription_job(
        TranscriptionJobName=transcribe_job_name,
        Media={'MediaFileUri': recording_url},
        MediaFormat='wav',
        LanguageCode='en-US'
    )
    
    max_wait_time = 300
    start_time = time.time()
    while True:
        status = transcribe_client.get_transcription_job(TranscriptionJobName=transcribe_job_name)
        if status['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
            break
        if time.time() - start_time > max_wait_time:
            raise Exception(f"Timeout waiting for transcription job {transcribe_job_name} to complete")
        time.sleep(10)

    if status['TranscriptionJob']['TranscriptionJobStatus'] == 'COMPLETED':
        transcription_url = status['TranscriptionJob']['Transcript']['TranscriptFileUri']
        
        with urllib.request.urlopen(transcription_url) as response:
            transcription_response = response.read()
            transcription_data = json.loads(transcription_response)
            transcript_text = transcription_data['results']['transcripts'][0]['transcript']
            
        model_id = 'amazon.titan-text-express-v1'
        prompt = transcript_text

        body = json.dumps({
            "inputText": prompt,
            "textGenerationConfig": {
                "maxTokenCount": 3072,
                "stopSequences": [],
                "temperature": 0.7,
                "topP": 0.9
            }
        })

        response_body = generate_text(model_id, body)
        resultFinal = " ".join(result['outputText'] for result in response_body['results'])
        
        prompt2 = ("call summary:" + transcript_text + 
                   " is this related to tax-info-inquiry or previous-tax-fillings ?? give one word answer either internet issue or loan query")
        
        body2 = json.dumps({
            "inputText": prompt2,
            "textGenerationConfig": {
                "maxTokenCount": 3072,
                "stopSequences": [],
                "temperature": 0.7,
                "topP": 0.9
            }
        })
        
        response_body2 = generate_text(model_id, body2)
        resultIntent = " ".join(result['outputText'] for result in response_body2['results'])
        
        prompt3 = ("call summary:" + transcript_text + 
                   " is this summary having positive, negative or neutral emotion of customer, one word answer")
        
        body3 = json.dumps({
            "inputText": prompt3,
            "textGenerationConfig": {
                "maxTokenCount": 3072,
                "stopSequences": [],
                "temperature": 0.7,
                "topP": 0.9
            }
        })
        
        response_body3 = generate_text(model_id, body3)
        resultExperience = " ".join(result['outputText'] for result in response_body3['results'])
        
        response4 = table2.get_item(Key={'ContactId': contact_id})
        item4 = response4['Item']
        phone_number4 = item4.get('CustomerPhoneNumber')
        
        # Update the transcription result in DynamoDB
        table.put_item(
            Item={
                'ContactId': contact_id,
                'Phone_number': phone_number4,
                'Transcription': transcript_text,
                'CallSummary': resultFinal,
                'Intent': resultIntent,
                'Customer_Satisfaction': resultExperience,
                'Timestamp': int(time.time())
            }
        )
        
        payload_lambda = {
            'contact': contact_id,
            'summary' : resultFinal,
            
        }
        
        lambda_response = lambda_client.invoke(
            FunctionName='new_2',  # Replace with the name of your target Lambda function
            InvocationType='RequestResponse',  # Synchronous invocation
            Payload=json.dumps(payload_lambda)
        )
        
        response_payload = json.load(lambda_response['Payload'])
        
        
        
        
        

    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Invoked target Lambda function successfully',
            'response': response_payload
        })
    }
