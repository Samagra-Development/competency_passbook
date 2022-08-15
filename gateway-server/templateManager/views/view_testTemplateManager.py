from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

class testTemplateManager(APIView):
    
    def get(self,request):
        return Response({'message' : 'module up and running . . .'})
    
    def post(self, request):
        print('request:', request)
        print('request.data:', request.data)
        
        # Sample Data
        data = [{'name': 'Peter', 'email': 'peter@example.org'},
            {'name': 'Julia', 'email': 'julia@example.org'}]

        return JsonResponse(data, safe=False)