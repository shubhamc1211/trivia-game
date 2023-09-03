import json
import boto3
from boto3.dynamodb.types import TypeSerializer

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

def serialize(data):
    # Use TypeSerializer to serialize Python data to DynamoDB types
    serializer = TypeSerializer()
    serialized_data = serializer.serialize(data)
    return serialized_data

def deserialize(data):
    # Use json.dumps to convert the serialized data to JSON string
    json_data = json.dumps(data)
    return json_data

def get_all_games():
    try:
        # Retrieve all items (game details) from the DynamoDB table
        table = dynamodb.Table('games')
        response = table.scan()

        # Extract the game details from the response
        game_details = response['Items']

        # Convert DynamoDB types to Python data types using deserialize function
        python_game_details = [json.loads(deserialize(item)) for item in game_details]

        # Return the game details as a JSON response
        return python_game_details, 200

    except Exception as e:
        return {'error': str(e)}, 500



def get_game_by_id(game_id):
    try:
        # Retrieve game details from the DynamoDB table by gameId
        table = dynamodb.Table('games')
        response = table.get_item(Key={'gameId': game_id})

        # Extract the game details from the response
        game_details = response.get('Item')

        if game_details is not None:
            # Convert DynamoDB types to Python data types using deserialize function
            python_game_details = json.loads(deserialize(game_details))
            return python_game_details
        else:
            return None

    except Exception as e:
        print('Error:', str(e))
        return None

def lambda_handler(event, context):
    print("Hello")
    print(event)
    http_method = event["requestContext"]["http"]["method"]
    if http_method == 'GET':
        if event['rawPath'] == '/game-details':
            game_details = get_all_games()
            if game_details:
                return {
                    'statusCode': 200,
                    'body': json.dumps(game_details)
                }
            else:
                return {
                    'statusCode': 500,
                    'body': json.dumps({'error': 'Failed to retrieve game details.'})
                }
        elif event['rawPath'] == '/get-game-by-id':
            print(event)
            game_id = event['queryStringParameters']['gameId']
            print(game_id)
            if game_id:
                game_details = get_game_by_id(game_id)
                if game_details:
                    return {
                        'statusCode': 200,
                        'body': json.dumps(game_details)
                    }
                else:
                    return {
                        'statusCode': 404,
                        'body': json.dumps({'error': 'Game with the specified gameId not found.'})
                    }
            else:
                return {
                    'statusCode': 400,
                    'body': json.dumps({'error': 'Please provide the gameId as a query parameter.'})
                }

    return {
        'statusCode': 400,
        'body': json.dumps({'error': 'Invalid request method or resource.'})
    }
