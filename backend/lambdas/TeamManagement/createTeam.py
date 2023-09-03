import json
import boto3
import random
import string
import datetime

dynamodb = boto3.resource('dynamodb')


def lambda_handler(event, context):
    table = dynamodb.Table('teams')

    team_name = event['teamName']
    member = event['member']

    # Create a unique ID with a timestamp and a random string
    unique_id = datetime.datetime.now().strftime("%Y%m%d%H%M%S") + '-' + \
        ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))

    team = {
        'id': unique_id,
        'teamName': team_name,
        'totalGamesPayed': 0,
        'totalGamesWon': 0,
        'members': [
            {
                'userId': member['userId'],
                'userName': member['userName'],
                'userEmail': member['userEmail'],
                'role': 'admin',
                'status': 'accepted'
            }
        ]
    }

    try:
        table.put_item(Item=team)
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Team name inserted successfully',
                'teamId': unique_id,
                'teamName': team_name
            }),
        }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Could not insert team name\n' + str(e)}),
        }
