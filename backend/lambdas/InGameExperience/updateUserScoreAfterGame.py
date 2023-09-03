import boto3
import requests
import json
from boto3.dynamodb.conditions import Key
from decimal import Decimal

def lambda_handler(event, context):

    # Get event data
    game_id = event['gameId']
    start_time = event['startTime']
    team_id = event['teamId']
    user_id = event['userId']

    dynamodb = boto3.resource('dynamodb')

    # Get game data from the DynamoDB
    games_table = dynamodb.Table('games')
    game_data_response = games_table.get_item(Key={'gameid': game_id})
    game_data = game_data_response['Item']

    # Parse the teams data
    teams = [json.loads(team_json) for team_json in game_data['teams']]

    for team in teams:
        if team['teamId'] == team_id:
            for member in team['members']:
                if member['userId'] == user_id:
                    user_data = member
                    break

    # Get current user data from API
    get_user_response = requests.post(
        'https://us-central1-serverless-csci-5410.cloudfunctions.net/getUser',
        json = {'id': user_id}
    )
    current_user_data = get_user_response.json()

    # Update the user data
    games_played = current_user_data['gamesPlayed'] + 1
    total_points = float(Decimal(current_user_data['totalPoints']) + Decimal(user_data['usergamepoints']))
    max_points = float(max(
        Decimal(json.loads(team_json)['teamgamepoints']) for team_json in game_data['teams']
    ))
    wins = current_user_data['wins']
    if team['teamgamepoints'] == max_points:
        wins += 1

    # Prepare the updated user data
    updated_user_data = {
        'id': user_id,
        'winLossRatio': current_user_data['winLossRatio'],
        'gamesPlayed': games_played,
        'contact': current_user_data['contact'],
        'totalPoints': total_points,
        'wins': wins,
        'name': current_user_data['name']
    }

    # Call the update API with the updated user data
    update_user_response = requests.post(
        'https://us-central1-serverless-csci-5410.cloudfunctions.net/updateUser',
        json = updated_user_data
    )

    return {
        'statusCode': 200,
        'body': json.dumps('User data updated successfully!')
    }
