import json
import boto3

dynamodb = boto3.resource('dynamodb')
table_name = 'questionnaire'
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    body = event
    first_pet = body.get('firstPet')
    first_car = body.get('firstCar')
    favorite_color = body.get('favoriteColor')
    user_id = body.get('userId')

    item = {
        'id': user_id,
        'firstPet': first_pet,
        'firstCar': first_car,
        'favoriteColor': favorite_color
    }

    try:
        response = table.put_item(Item=item)
        print('Questions and answers stored successfully:', item)
        return {
            'statusCode': 200,
            'body': json.dumps({"result": "Questions and answers stored successfully"})
        }
    except Exception as e:
        print('Error storing questions and answers:', e)
        return {
            'statusCode': 500,
            'body': json.dumps({"result": "Failed to store questions and answers"})
        }
