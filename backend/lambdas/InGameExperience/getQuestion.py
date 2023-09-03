#This Lamda is created by Akshay but given to Jainisha to get the question from the database
import boto3
import json
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo  # new import here

# Constants
DYNAMODB = boto3.resource('dynamodb')
TABLE = DYNAMODB.Table('temp')  # change to table name
TIME_PER_QUESTION_IN_SECONDS = 30

def lambda_handler(event, context):
    print(event)
    gameId = event['gameId']
    print(gameId)
    try:
        response = TABLE.get_item(Key={'gameId': gameId})  # change to key name
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'body': 'Game not found.'
            }

        game = response['Item']
        questions = game['gameDetails']['questions']
        request_time = datetime.now(ZoneInfo('America/Halifax'))  # get current time in Halifax, Nova Scotia, Canada
        game_start_time = datetime.strptime(game['startTime'], "%Y-%m-%dT%H:%M:%S.%f").replace(tzinfo=ZoneInfo('America/Halifax'))  # Added tzinfo
        game_end_time = game_start_time + timedelta(seconds=len(questions) * TIME_PER_QUESTION_IN_SECONDS)

        if request_time < game_start_time:
            return {
                'statusCode': 400,
                 'body': json.dumps({"message" :'Game has not started yet.'})
            }
        if request_time >= game_end_time:
            return {
                'statusCode': 400,
                'body': json.dumps({"message" :'Game has ended.'})
            }

        for i, question in enumerate(questions):
            question_start_time = game_start_time + timedelta(seconds=i * TIME_PER_QUESTION_IN_SECONDS)
            question_end_time = question_start_time + timedelta(seconds=TIME_PER_QUESTION_IN_SECONDS)

            if request_time >= question_start_time and request_time < question_end_time:
                return {
                    'statusCode': 200,
                    'body': json.dumps({
                        "startTime":game["startTime"],
                        "message":"question loaded successfully",
                        'question': question["question"],
                        'answer': question['answer'],
                        'options':question['options'],
                        'explanation': question['explanation'],
                        'questionEndTime': question_end_time.isoformat(),
                        'isLastQuestion': i == len(questions) - 1,
                    })
                }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({"message" :'Something went wrong: {}'.format(e)})
        }
