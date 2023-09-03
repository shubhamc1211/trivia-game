import json
import boto3
from datetime import datetime
from decimal import Decimal

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    games_table = dynamodb.Table('games')
    teams_table = dynamodb.Table('teams')

    # Extracting the required parameters from the request
    game_id = event['gameId']
    start_time = event['startTime']
    team_id = event['teamId']  # Team ID to be updated

    # Retrieve the game data
    game_response = games_table.get_item(
        Key={
            'gameid': game_id
        }
    )
    game_data = game_response['Item']

    # Find the specified team in the game data
    team_data = None
    for team_json in game_data['teams']:
        temp_team_data = json.loads(team_json)
        if temp_team_data['teamId'] == team_id:
            team_data = temp_team_data
            break

    if team_data is None:
        print(f"Team {team_id} not found in game {game_id}!")
        return {
            'statusCode': 400,
            'body': json.dumps('Team not found!')
        }

    # Retrieve the team record
    team_response = teams_table.get_item(
        Key={
            'id': team_id
        }
    )
    team_record = team_response['Item']

    # Check if the team record is already updated
    last_time_played_date = datetime.fromisoformat(team_record['lastTimePlayedDate']).replace(tzinfo=None)
    start_time_date = datetime.fromisoformat(start_time).replace(tzinfo=None)

    if last_time_played_date < start_time_date:
        # Update the necessary fields
        total_games_played = team_record['totalGamesPlayed'] + 1
        total_points = Decimal(team_record['totalpoints']) + Decimal(team_data['teamgamepoints'])
        total_games_won = team_record['totalGamesWon']

        max_points = max(Decimal(json.loads(team_json)['teamgamepoints']) for team_json in game_data['teams'])

        if Decimal(team_data['teamgamepoints']) == max_points:
            total_games_won += 1

        # Update the team record
        teams_table.update_item(
            Key={
                'id': team_id
            },
            UpdateExpression='SET totalGamesPlayed = :totalGamesPlayed, totalpoints = :totalPoints, totalGamesWon = :totalGamesWon, lastTimePlayedDate = :startTime',
            ExpressionAttributeValues={
                ':totalGamesPlayed': total_games_played,
                ':totalPoints': total_points,
                ':totalGamesWon': total_games_won,
                ':startTime': start_time
            }
        )
    else:
        print(f"Team {team_id} already updated!")

    return {
        'statusCode': 200,
        'body': json.dumps('Team Updated Successfully!')
    }
