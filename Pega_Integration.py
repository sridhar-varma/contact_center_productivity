import json
import http.client
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('transcribeText')
table2 = dynamodb.Table('pega_supply')

def lambda_handler(event, context):
    try:
        #pega API end point
        conn = http.client.HTTPSConnection("") 
        
        contact_id = event['contact']
        call_summary = event['summary']
        
        # Retrieve the item from DynamoDB
        response4 = table.get_item(Key={'ContactId': contact_id})
        
        # Check if the item exists in the response
        item4 = response4.get('Item')
        if not item4:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'Item not found'})
            }
        
        phone_number4 = item4.get('Phone_number')
        print(phone_number4)
        intent_data = item4.get('Intent')
        
        response6 = table2.get_item(Key={'phone': phone_number4})
        item6 = response6.get('Item')
        if not item6:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'Item not found','phone':phone_number4})
            }
        
        email = item6.get('mail')
        name = item6.get('name')
        
        
        
        payload = {
            "Name": name,
            "Email": email,
            "Phone": phone_number4,
            "CID": contact_id,
            "Intent": intent_data,
            "Summary": call_summary
        }
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        # Convert payload to JSON string
        payload_json = json.dumps(payload)
        
        # Make the HTTPS POST request
        conn.request("POST", "/prweb/api/B4BAPI/v01/createpapp", body=payload_json, headers=headers)
        
        # Get the response from Pega
        res = conn.getresponse()
        data = res.read().decode("utf-8")
        
        # Check if request was successful
        if res.status == 200:
            return {
                'statusCode': res.status,
                'body': data
            }
        else:
            return {
                'statusCode': res.status,
                'body': json.dumps({'error': f'Pega API request failed: {data}'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
