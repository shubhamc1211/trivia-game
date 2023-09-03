import json
import boto3


def lambda_handler(event, context):
    # Instantiate SNS client
    sns = boto3.client('sns')
    record = event['Records'][0]
    body = json.loads(record['body'])
    emailId = body['emailId']
    teamId = body['teamId']
    message = f"Dear user, please click the following link to accept the invitation: Dear user, You have been invited to join team please click the following link to accept the invitation: https://frontend-bqjaztpeya-uc.a.run.app/teaminviataion/{teamId}"

    topic_name = "SendTeamInviteEmailTopic"
    snsTopicList = sns.list_topics()
    arnOfSNSTopic = next(
        (topic['TopicArn'] for topic in snsTopicList['Topics'] if topic_name in topic['TopicArn']), None)

    # Send the email
    response = sns.publish(
        TopicArn=arnOfSNSTopic,
        Message=message,
        Subject='Team Invitation',
        MessageStructure='string',
        MessageAttributes={
            'useremail': {
                'DataType': 'String',
                'StringValue': emailId
            }
        },
    )

    return {
        'statusCode': 200,
        'body': json.dumps({'result': 'success'})
    }
