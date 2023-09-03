import boto3
import uuid
import datetime
import json
import requests

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

def create_table():
    try:
        table = dynamodb.create_table(
            TableName='games',
            KeySchema=[
                {
                    'AttributeName': 'gameId',
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'gameId',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        table.wait_until_exists()
        print('Table created successfully')
    except Exception as e:
        print('Error creating table:', str(e))

def process_question_with_cloud_function(question_text):
    # Call the Google Cloud Function API to get the category
    cloud_function_url = 'https://us-central1-nlptagging-395001.cloudfunctions.net/process_question'
    api_data = {'question': question_text}
    response = requests.post(cloud_function_url, json=api_data)

    if response.status_code == 200:
        # Extract the category from the API response
        category_data = response.json()
        return category_data['category']
    else:
        return None


def lambda_handler(event, context):
    # Create the DynamoDB table if it doesn't exist
    create_table()
    try:
        data = json.loads(event['body'])

        # Validate request data
        if 'gameDetails' not in data:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Invalid request data'})
            }
        userId = data['userId']

        if 'gameId' in data['gameDetails']:
            # If gameId exists in the request data, it means the user is updating an existing game
            game_id = data['gameDetails']['gameId']
            updated_time = datetime.datetime.now().isoformat()

            for question in data['gameDetails']['questions']:
                question_text = question['question']
                category = process_question_with_cloud_function(question_text)
                question['nlp_category'] = category
            # Convert the questions to a regular JavaScript object without type annotations
            questions = json.loads(json.dumps(data['gameDetails']['questions']))

            # Update the game details in the DynamoDB table
            table = dynamodb.Table('games')
            table.update_item(
                Key={'gameId': game_id},
                UpdateExpression='SET updatedTime = :updated, gameDetails = :gameDetails',
                ExpressionAttributeValues={
                    ':updated': updated_time,
                    ':gameDetails': data['gameDetails'],
                }
            )

            return {
                'statusCode': 200,
                'body': json.dumps({'gameId': game_id})
            }

        else:
            # If gameId is not provided, it means the user is creating a new game
            game_id = str(uuid.uuid4())  # Generate a unique ID for the game
            created_time = datetime.datetime.now().isoformat()
            updated_time = created_time

            # Convert the questions to a regular JavaScript object without type annotations
            # questions = json.loads(json.dumps(data['gameDetails']['questions']))

            for question in data['gameDetails']['questions']:
                question_text = question['question']
                category = process_question_with_cloud_function(question_text)
                question['nlp_category'] = category

            game_details = data['gameDetails']
            game_details['startTime'] = data['startDate']  # Include the start date
            game_details['endTime'] = data['endDate']

            # Save game details to DynamoDB
            table = dynamodb.Table('games')
            table.put_item(Item={
                'gameId': game_id,
                'userId': userId,
                'gameDetails': game_details,
                'createdTime': created_time,
                'updatedTime': updated_time
            })

            return {
                'statusCode': 200,
                'body': json.dumps({'gameId': game_id})
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
