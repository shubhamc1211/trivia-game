import json
import boto3

dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    userId = event['userId']
    gameId = event['gameId']

    table = dynamodb.Table('games') # Replace 'YourGameTable' with the name of your DynamoDB table

    # Get the game details
    game = table.get_item(Key={'gameid': gameId})['Item']

    # Iterate through teams to find the user and update scores
    updated_teams = update_scores(game['teams'], userId)

    # Update the game item in the database
    table.update_item(
        Key={'gameid': gameId},
        UpdateExpression="set teams=:t",
        ExpressionAttributeValues={
            ':t': updated_teams
        },
        ReturnValues="UPDATED_NEW"
    )

    return {
        'statusCode': 200,
        'body': json.dumps('Scores updated successfully!')
    }

def update_scores(teams, userId):
    updated_teams = []

    for team in teams:
        team = json.loads(team)
        member_count = len(team['members'])

        for member in team['members']:
            if member['userId'] == userId:
                member['usergamepoints'] += 10
                team['teamgamepoints'] += 10 / member_count
                break

        updated_teams.append(json.dumps(team))

    return updated_teams
