import boto3
import json
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    # Initialize the DynamoDB client
    dynamodb = boto3.resource('dynamodb')

    table = dynamodb.Table('games')

    try:
        # Scanning the table to retrieve all the games
        response = table.scan()
    except ClientError as e:
        print(e.response['Error']['Message'])
        return {
            'statusCode': 500,
            'body': json.dumps({'error': e.response['Error']['Message']})
        }
    else:
        # Iterating over all games
        for game in response['Items']:
            # Checking if the 'teams' field is present and not empty
            if 'teams' in game and game['teams']:
                # Converting the 'teams' set into a list
                game['teams'] = list(game['teams'])

                # The 'teams' field is a list, so iterate over all its elements
                for i in range(len(game['teams'])):
                    # Parse the stringified JSON into a proper JSON object
                    game['teams'][i] = json.loads(game['teams'][i])

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps(response['Items'])
    }
