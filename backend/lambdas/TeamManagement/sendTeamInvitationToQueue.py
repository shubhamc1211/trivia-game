import json
import boto3


def lambda_handler(event, context):
    emailId = event.get('emailId')
    teamId = event.get('teamId')
    # Instantiate SNS client
    sns = boto3.client('sns')
    topic_name = "SendTeamInviteEmailTopic"
    snsTopicList = sns.list_topics()
    arnOfSNSTopic = next(
        (topic['TopicArn'] for topic in snsTopicList['Topics'] if topic_name in topic['TopicArn']), None)
    print(arnOfSNSTopic)

    listOfSubscriptions = sns.list_subscriptions_by_topic(
        TopicArn=arnOfSNSTopic
    )

    # Check if subscription exists
    subscriptions = listOfSubscriptions['Subscriptions']
    if not any(s['Endpoint'] == emailId for s in subscriptions):
        # Create a new subscription if it doesn't exist
        response = sns.subscribe(
            TopicArn=arnOfSNSTopic,
            Protocol='email',
            Endpoint=emailId,
            Attributes={
                'FilterPolicy': json.dumps({
                    'useremail': [emailId]
                })
            }
        )

    # Instantiate SQS client
    sqs = boto3.client('sqs')
    # replace with your queue URL
    queue_url = sqs.get_queue_url(
        QueueName='SendTeamInviteEmailQueue')['QueueUrl']

    # Send message to SQS queue
    response = sqs.send_message(
        QueueUrl=queue_url,
        MessageBody=json.dumps({
            'emailId': emailId,
            'teamId': teamId
        })
    )

    # Respond with a 200 HTTP status code
    return {
        'statusCode': 200,
        'body': json.dumps({'result': 'success'})
    }
