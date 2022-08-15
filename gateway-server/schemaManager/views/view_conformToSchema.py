import json
from django.http import JsonResponse
from rest_framework.views import APIView
from schemaManager.models import Schema
from rest_framework.response import Response
from jsonschema import Draft202012Validator

class conformToSchema(APIView):
    
    def post(self, request):
        
        try:
            requestData = request.data
            
            print('request:', request)
            print('request.data:', request.data)
            print(type(request.data))
            
            schema = Schema.objects.get(
                schema_schemaName = requestData['schemaName']
            )
            
            schemaData = json.loads(schema.schema_schemaData)
            data = json.loads(requestData['data'])
            
            print("Schema Data :", schemaData)
            
            conformance = Draft202012Validator(schemaData).is_valid(data)
            
            return JsonResponse({
                'message' : 'success',
                'conforms?' : conformance
            }, safe=False)
            
        except Exception as error:
            print("Error :", error)
            return JsonResponse({
                'message' : 'failure',
                'error': str(error)
            }, safe=False)