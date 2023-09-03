import boto3

def lambda_handler(event, context):
    # Get the user data from the event
    team_id = event['teamId']
    user_id = event['userId']
    user_name = event['userName']
    user_email = event['userEmail']

    # Define the default role for the user
    role = "member"  # You can change this to a different default role if needed

    # Create the DynamoDB client
    dynamodb = boto3.resource('dynamodb')
    table_name = 'teams'  # Replace with your actual DynamoDB table name
    table = dynamodb.Table(table_name)

    # Check if the user with the same userId already exists in the team's 'members' array
    response = table.get_item(Key={'id': team_id})
    team_item = response.get('Item', {})
    members = team_item.get('members', [])
    for member in members:
        if member.get('userId') == user_id:
            return {
                'statusCode': 400,
                'body': 'User with the same userId already exists in the team!'
            }

    # Update the team's 'members' attribute to add the new user
    try:
        response = table.update_item(
            Key={'id': team_id},
            UpdateExpression='SET #members = list_append(#members, :user)',
            ExpressionAttributeNames={'#members': 'members'},
            ExpressionAttributeValues={':user': [{'role': role, 'status': 'accepted', 'userId': user_id, 'userName': user_name, 'userEmail': user_email}]},
            ReturnValues='UPDATED_NEW'
        )
        return {
            'statusCode': 200,
            'body': 'User added to the team successfully!'
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': 'Error adding the user to the team: ' + str(e)
        }
