import csv
import os
import boto3
from botocore.exceptions import ClientError
from google.cloud import storage
import json
import requests

bucketName = 'leaderboard-b00917755'
tableName = 'player_info'
secretName = 'leaderboard-secrets'
regionName = 'us-east-1'

dynamodb = boto3.resource('dynamodb', region_name=regionName)
table = dynamodb.Table(tableName)

def fetch_data_from_dynamodb():
    try:
        response = table.scan()
        return response['Items']
    except Exception as e:
        print('Error fetching data from DynamoDB:', e)
        raise e

def fetch_data_from_api():

    api_url = "https://a1a5iuugp3.execute-api.us-east-1.amazonaws.com/dev/getallteams"
    response = requests.get(api_url)

    if response.status_code == 200:
        
        data = response.json()
        if data:
            team_info = data['body']
            teams = json.loads(team_info)

            # Flatten the nested data to make it suitable for CSV
            flattened_teams = []
            for team in teams:
                members = team.pop('members')
                for member in members:
                    team_data = team.copy()
                    team_data.update(member)
                    flattened_teams.append(team_data)
            return flattened_teams
        else:
            return None
    else:
        print(f"Failed to fetch data from the API. Status Code: {response.status_code}")
        return None

def write_to_csv(data):
    csv_file = '/tmp/output_integration.csv'

    fieldnames = ['teamName', 'totalGamesWon','totalGamesPlayed', 'userEmail', 'role', 'userName', 'userId', 'status', 'totalpoints', 'id', 'lastTimePlayedDate']

    try:
        with open(csv_file, mode='w', newline='') as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            for row in data:
                # Extract only the date part from "lastTimePlayedDate"
                row['lastTimePlayedDate'] = row['lastTimePlayedDate'].split('T')[0]
                writer.writerow(row)
            # writer.writerows(data)
        print(f'Data exported to {csv_file}.')
        return csv_file
    except Exception as e:
        print('Error writing to CSV file:', e)
        raise e

def get_secret():
    try:
        # Create a Secrets Manager client
        session = boto3.session.Session()
        client = session.client(
            service_name='secretsmanager',
            region_name=regionName
        )

        get_secret_value_response = client.get_secret_value(
            SecretId=secretName
        )
    except ClientError as e:
        # For a list of exceptions thrown, see
        # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        raise e

    # Decrypts secret using the associated KMS key.
    secret = get_secret_value_response['SecretString']
    return json.loads(secret)

def upload_to_gcs(csv_file):
    try:
        service_account_key = get_secret()
        storage_client = storage.Client.from_service_account_info(service_account_key)
        bucket = storage_client.bucket(bucketName)
        blob = bucket.blob(os.path.basename(csv_file))
        blob.upload_from_filename(csv_file)

        print(f'File {csv_file} uploaded to Google Cloud Storage.')
    except Exception as e:
        print('Error uploading to Google Cloud Storage:', e)
        raise e

def lambda_handler(event, context):
    try:
        data_from_api = fetch_data_from_api()
        csv_file = write_to_csv(data_from_api)
        upload_to_gcs(csv_file)

        # Return a response (if needed)
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': 'Data exported and uploaded to GCS.'
        }
        # Rest of the code...
    except Exception as e:
        print('Error:', e)
        raise e
