from django.http import JsonResponse
from rest_framework.views import APIView
from schemaManager.models import Schema
from rest_framework.response import Response

class schemaDetails(APIView):
    
    def post(self, request):
        
        try:
            requestData = request.data
            
            print('request:', request)
            print('request.data:', request.data)
            print(type(request.data))
            
            schema = Schema.objects.get(schema_schemaName = request.data['schemaName'])
            response = {
                'id' : schema.id,
                'schemaName' : schema.schema_schemaName,
                'schemaData' : schema.schema_schemaData
            }
            
            return JsonResponse({
                'message' : 'success',
                'data' : response
            }, safe=False)
            
        except Exception as error:
            return JsonResponse({
                'message' : 'failure',
                'error': str(error)
            }, safe=False)