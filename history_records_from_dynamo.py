import json
import boto3
from boto3.dynamodb.conditions import Key

# Initialize DynamoDB clients for both tables
dynamodb = boto3.resource('dynamodb')

# Replace 'login_application' and 'history' with your actual table names
table_name = 'login_application'
table2_name = 'history'

table = dynamodb.Table(table_name)
table2 = dynamodb.Table(table2_name)

def lambda_handler(event, context):
    try:
        method = event['requestContext']['http']['method']
        ebody = event['body']
        body_dict = json.loads(ebody)
        email = body_dict.get('email')
        
        # Query the first DynamoDB table based on email
        response = table.query(
            KeyConditionExpression=Key('mail').eq(email)
        )
        
        # Check if the item exists in the first table
        if 'Items' in response and response['Items']:
            first_item = response['Items'][0]
            phone_number = first_item.get('phone')
            
            # Query the second DynamoDB table based on phone_number
            response_second = table2.query(
                KeyConditionExpression=Key('CustomerPhoneNumber').eq(phone_number)
            )
            
            # Check if the item exists in the second table
            if 'Items' in response_second and response_second['Items']:
                second_item = response_second['Items'][0]
                # Combine details from both tables if needed
                merged_details = {
                    **first_item,
                    **second_item
                }
                return {
                    'statusCode': 200,
                    'body': json.dumps(merged_details)
                }
            else:
                return {
                    'statusCode': 404,
                    'body': json.dumps('No details found in the second table for the given phone number')
                }
        else:
            return {
                'statusCode': 404,
                'body': json.dumps('No personal details found for the given email')
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error fetching details: {str(e)}")
        }
