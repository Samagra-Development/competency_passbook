from django.http import JsonResponse
from rest_framework.views import APIView
from templateManager.models import Template
from rest_framework.response import Response

class templateCreationManager(APIView):
    
    def post(self, request):
        
        try:
            requestData = request.data
            
            print('request:', request)
            print('request.data:', request.data)
            print(type(request.data))
            
            newTemplate = Template.objects.create(
                template_templateName = requestData['templateName'],
                template_templateData = requestData['templateData']
            )
            print("New Template :", newTemplate)
            
            return JsonResponse({
                'message' : 'success',
                'id' : int(newTemplate.id),
                'description' : 'created template : ' + str(newTemplate.template_templateName)
            }, safe=False)
            
        except Exception as error:
            return JsonResponse({
                'message' : 'failed',
                'description' : 'unable to create template',
                'error': str(error)
            }, safe=False)