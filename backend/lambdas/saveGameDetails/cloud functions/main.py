import json
from google.cloud import language_v1

def process_question(request):
    try:
        request_json = request.get_json()
        if not request_json or 'question' not in request_json:
            return json.dumps({'error': 'Invalid request data'}), 400
        
        question_text = request_json['question']
        
        # Authenticate with the Natural Language API using your JSON key file
        file_path = 'nlptagging-395001-a91fc94824a5.json'
        client = language_v1.LanguageServiceClient.from_service_account_json(file_path)
        
        # Analyze the sentiment and entities in the question
        document = language_v1.Document(content=question_text, type_=language_v1.Document.Type.PLAIN_TEXT)
        response = client.analyze_entity_sentiment(request={'document': document})
        entities = response.entities
        if entities:
            category = entities[0].name
        else:
            category = 'Unknown'
        
        return json.dumps({'category': category}), 200

    except Exception as e:
        return json.dumps({'error': str(e)}), 500
