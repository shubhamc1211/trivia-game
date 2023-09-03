import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('teams')

    team_id = event.get('teamId')
    user_id = event.get('userId')
    action = event.get('action')

    try:
        response = table.get_item(Key={'id': team_id})
    except ClientError as e:
        print(e.response['Error']['Message'])
        return {
            'statusCode': 500,
            'body': json.dumps('Error getting item')
        }
    else:
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'body': json.dumps('Team not found')
            }

        team = response['Item']

        for member in team['members']:
            if member['userId'] == user_id:
                if action == 'promote':
                    member['role'] = 'admin'
                    # demote everyone else
                    for other_member in team['members']:
                        if other_member['userId'] != user_id:
                            other_member['role'] = 'member'
                elif action == 'leave':
                    team['members'].remove(member)
                break

        # Update the team item in DynamoDB
        try:
            table.put_item(Item=team)
        except ClientError as e:
            print(e.response['Error']['Message'])
            return {
                'statusCode': 500,
                'body': json.dumps('Error updating item')
            }

        return {
            'statusCode': 200,
            'body': json.dumps('Successfully updated')
        }
