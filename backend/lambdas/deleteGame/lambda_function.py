import boto3
import json

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

def lambda_handler(event, context):
    try:
        data = json.loads(event['body'])

        # Validate request data
        if 'gameId' not in data:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Invalid request data'})
            }

        # Delete the game from the DynamoDB table
        table = dynamodb.Table('games')
        table.delete_item(
            Key={'gameId': data['gameId']}
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Game deleted successfully'})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

