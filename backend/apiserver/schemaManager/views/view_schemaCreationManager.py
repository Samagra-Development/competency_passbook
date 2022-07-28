from django.http import JsonResponse
from rest_framework.views import APIView
from schemaManager.models import Schema
from rest_framework.response import Response

class schemaCreationManager(APIView):
    
    def post(self, request):
        
        try:
            requestData = request.data
            
            print('request:', request)
            print('request.data:', request.data)
            print(type(request.data))
            
            newSchema = Schema.objects.create(
                schema_schemaName = requestData['schemaName'],
                schema_schemaData = requestData['schemaData']
            )
            print("New Schema :", newSchema)
            
            return JsonResponse({
                'message' : 'success'
            }, safe=False)
            
        except Exception as error:
            return JsonResponse({
                'message' : 'failure',
                'error': str(error)
            }, safe=False)