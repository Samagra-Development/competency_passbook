from django.http import JsonResponse
from rest_framework.views import APIView
from templateManager.models import Template
from rest_framework.response import Response

class allTemplates(APIView):
    
    def get(self, request):
        
        try:
            requestData = request.data
            
            print('request:', request)
            print('request.data:', request.data)
            print(type(request.data))
            
            templateList = Template.objects.all()
            response_templates = []
            
            for template in templateList:
                if template.template_templateName is None or template.template_templateName == '': continue
                response_templates.append({
                    'id' : template.id,
                    'templateName' : template.template_templateName
                })
            
            return JsonResponse({
                'message' : 'success',
                'templateList' : response_templates
            }, safe=False)
            
        except Exception as error:
            return JsonResponse({
                'message' : 'failure',
                'error': str(error)
            }, safe=False)