import json
import boto3
from decimal import Decimal

# Custom JSON encoder to handle Decimal objects
class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        return super(DecimalEncoder, self).default(o)

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table_name = 'teams'
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        # Query DynamoDB to get all the teams
        response = table.scan()

        # Return the JSON response with teams data using the custom encoder
        teams_data = response['Items']
        return {
            'statusCode': 200,
            'body': json.dumps(teams_data, cls=DecimalEncoder)
        }
    except Exception as e:
        print('Error fetching teams:', str(e))

        # Return an error response
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Error fetching teams'})
        }
