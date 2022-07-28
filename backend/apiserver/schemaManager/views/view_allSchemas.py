from django.http import JsonResponse
from rest_framework.views import APIView
from schemaManager.models import Schema
from rest_framework.response import Response

class allSchemas(APIView):
    
    def get(self, request):
        
        try:
            requestData = request.data
            
            print('request:', request)
            print('request.data:', request.data)
            print(type(request.data))
            
            schemaList = Schema.objects.all()
            response_schemas = []
            
            for schema in schemaList:
                if schema.schema_schemaName is None or schema.schema_schemaName == '': continue
                response_schemas.append({
                    'id' : schema.id,
                    'schemaName' : schema.schema_schemaName
                })
            
            return JsonResponse({
                'message' : 'success',
                'schemaList' : response_schemas
            }, safe=False)
            
        except Exception as error:
            return JsonResponse({
                'message' : 'failure',
                'error': str(error)
            }, safe=False)