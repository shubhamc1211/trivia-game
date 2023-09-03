import boto3
import json


def lambda_handler(event, context):
    team_id = event.get('id')
    # Check if the team ID is provided in the event
    if not team_id:
        return {
            'statusCode': 400,
            'body': 'Missing team ID in the request.'
        }

    # Initialize the DynamoDB client
    dynamodb = boto3.resource('dynamodb')
    table_name = 'teams'
    table = dynamodb.Table(table_name)

    try:
        # Retrieve team details from DynamoDB
        response = table.get_item(Key={'id': team_id})
        team_details = response.get('Item', None)
        print(team_details)
        if team_details:
            # Team details found
            return {
                'statusCode': 200,
                'body': team_details
            }
        else:
            # Team not found
            return {
                'statusCode': 404,
                'body': 'Team not found.'
            }
    except Exception as e:
        # Handle any errors that occurred during the operation
        return {
            'statusCode': 500,
            'body': f'An error occurred: {str(e)}'
        }
