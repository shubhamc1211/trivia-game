import boto3
from decimal import Decimal
import json

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return str(o)
        return super(DecimalEncoder, self).default(o)

def convert_sets_to_lists(data):
    for key, value in data.items():
        if isinstance(value, set):
            data[key] = list(value)
    return data

def remove_members_from_teams(data):
    for i, team in enumerate(data['teams']):
        team_data = json.loads(team)
        if 'members' in team_data:
            del team_data['members']
        data['teams'][i] = json.dumps(team_data)
    return data

def lambda_handler(event, context):
    # Get the gameid from the event
    gameid = event['gameid']

    # Create a DynamoDB client
    dynamodb = boto3.resource('dynamodb')

    # Get the "games" table
    table = dynamodb.Table('games')

    try:
        # Fetch the data from the table using gameid as the key
        response = table.get_item(Key={'gameid': gameid})

        # Check if the item was found in the table
        if 'Item' in response:
            # Convert sets to lists for JSON serialization
            response['Item'] = convert_sets_to_lists(response['Item'])

            # Remove 'members' data from teams
            response['Item'] = remove_members_from_teams(response['Item'])

            # Convert any Decimal types to strings for JSON serialization
            response['Item'] = json.loads(json.dumps(response['Item'], cls=DecimalEncoder))

            return response['Item']
        else:
            return {
                'statusCode': 404,
                'body': 'Item not found'
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }
