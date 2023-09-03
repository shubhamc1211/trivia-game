import json
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')


def is_user_member_of_team(user_id, team):
    for member in team['members']:
        if member['userId'] == user_id:
            return True
    return False


def lambda_handler(event, context):
    table = dynamodb.Table('teams')
    user_id = str(event['userId'])

    # Scanning the entire table
    response = table.scan()
    all_teams = response['Items']

    # Filtering for teams where the user is a member
    user_teams = [
        team for team in all_teams if is_user_member_of_team(user_id, team)]

    if user_teams:
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Teams retrieved successfully',
                'teams': user_teams,
            }, default=json_serial),
        }
    else:
        return {
            'statusCode': 404,
            'body': json.dumps({'message': 'No teams found for this user'}, default=json_serial),
        }


def json_serial(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError(f'Type {type(obj)} not serializable')
