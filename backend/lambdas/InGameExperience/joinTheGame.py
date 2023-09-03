#This lambda is created by Akshay but given to Rajul to join the game and send the email to the team members
import boto3
import json
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
sns = boto3.client('sns')
games_table = dynamodb.Table('games')
teams_table = dynamodb.Table('teams')

def lambda_handler(event, context):
    gameId = event['gameId']
    teamId = event['teamId']
    userId = event['userId']  # user Id who is requesting to join the game

    # First, fetch the team data from the 'teams' table
    try:
        team_data = teams_table.get_item(
            Key={
                'id': teamId
            }
        )
    except ClientError as e:
        print(e.response['Error']['Message'])
        return {
            'statusCode': 500,
            'body': json.dumps('Could not fetch the team data')
        }

    # If the team does not exist, return an error
    if 'Item' not in team_data:
        return {
            'statusCode': 400,
            'body': json.dumps('The team does not exist')
        }

    # Process the team data to extract and modify the necessary fields
    team = {
        'teamId': team_data['Item']['id'],
        'teamName': team_data['Item']['teamName'],
        'teamgamepoints': 0,
        'members': [
            {
                'userId': member['userId'],
                'userName': member['userName'],
                "userEmail":member["userEmail"],
                'usergamepoints': 0
            } for member in team_data['Item']['members']
        ]
    }

    # Then, try to get the game from the 'games' table
    try:
        response = games_table.get_item(
            Key={
                'gameid': gameId
            }
        )
    except ClientError as e:
        print(e.response['Error']['Message'])
        return {
            'statusCode': 500,
            'body': json.dumps('Could not fetch the game')
        }

    # If the game does not exist in the table, create it
    if 'Item' not in response:
        # The game does not exist, so we can simply create it with the new team
        try:
            games_table.put_item(
                Item={
                    'gameid': gameId,
                    'teams': set([json.dumps(team)]),
                }
            )
            message = 'Successfully created the game'
            team_added = True
        except ClientError as e:
            print(e.response['Error']['Message'])
            return {
                'statusCode': 500,
                'body': json.dumps('Could not create the game')
            }
    else:
        # The game exists, check if user is already in the game
        team_ids = [json.loads(team_json)['teamId'] for team_json in response['Item']['teams']]
        user_exists = False
        for team_json in response['Item']['teams']:
            existing_team = json.loads(team_json)
            if any(member['userId'] == userId for member in existing_team['members']):
                if existing_team['teamId'] == teamId:
                    return {
                        'statusCode': 400,
                        'body': json.dumps('Team is already in the game')
                    }
                else:
                    user_exists = True
                    break
        if user_exists:
            return {
                'statusCode': 400,
                'body': json.dumps('The user is already part of this game in another team')
            }
        # If the user is not part of any team in the game, add the new team to the game
        try:
            response = games_table.update_item(
                Key={
                    'gameid': gameId
                },
                UpdateExpression="ADD teams :t",
                ExpressionAttributeValues={
                    ':t': set([json.dumps(team)])
                },
                ReturnValues="UPDATED_NEW"
            )
            message = 'Successfully updated the game'
            team_added = True
        except ClientError as e:
            print(e.response['Error']['Message'])
            return {
                'statusCode': 500,
                'body': json.dumps('Could not update the game')
            }
    # If a team was added to the game, notify the team members
    if team_added:
        # Publish a message to the topic for each team member
        topic_arn = 'arn:aws:sns:us-east-1:526537400410:SendTeamInviteEmailTopic'
        for member in team['members']:
            print(member)
            email_message = f"Your Team with name {team['teamName']} have joined a game and the link for is https://frontend-bqjaztpeya-uc.a.run.app/ingame?teamId={team['teamId']}&gameId={team['gameId']}"
            try:
                sns.publish(
                    TopicArn=topic_arn,
                    Message=email_message,
                    Subject='Game Update',
                    MessageStructure='string',
                    MessageAttributes={
                        'useremail': {
                            'DataType': 'String',
                            'StringValue': member['userEmail']
                        }
                    }
                )
            except ClientError as e:
                print(e.response['Error']['Message'])
                return {
                    'statusCode': 500,
                    'body': json.dumps('Could not publish message to SNS topic')
                }

    return {
        'statusCode': 200,
        'body': json.dumps(message)
    }
