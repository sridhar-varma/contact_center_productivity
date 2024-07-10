import json
import boto3
import time
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('CallMetadata')
table2 = dynamodb.Table('history')

def lambda_handler(event, context):
    # Extract contact ID and customer number from the event
    contact_id = event['Details']['ContactData']['ContactId']
    phone_number = event['Details']['Parameters']['phone_number']
    
    # Current timestamp
    current_time = int(time.time())
    timestamp = datetime.utcfromtimestamp(current_time).strftime('%Y-%m-%d %H:%M:%S')

    # Item to insert into DynamoDB
    item = {
        'ContactId': contact_id,
        'CustomerPhoneNumber': phone_number,
        'Timestamp': timestamp,
        'Status': 'New'  # Example field
    }
    
    # Insert item into DynamoDB
    try:
        table.put_item(Item=item)
        
        table2.put_item(Item=item)
        return {
            'statusCode': 200,
            'body': json.dumps(f'Successfully inserted item with ContactId {contact_id}')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error inserting item: {str(e)}')
        }
