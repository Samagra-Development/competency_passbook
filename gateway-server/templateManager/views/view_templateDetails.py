from django import template
from django.http import JsonResponse
from rest_framework.views import APIView
from templateManager.models import Template
from rest_framework.response import Response

class templateDetails(APIView):
    
    def post(self, request):
        
        try:
            requestData = request.data
            
            print('request:', request)
            print('request.data:', request.data)
            print(type(request.data))
            
            template = Template.objects.get(template_templateName = request.data['templateName'])
            response = {
                'id' : template.id,
                'templateName' : template.template_templateName,
                'templateData' : template.template_templateData
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