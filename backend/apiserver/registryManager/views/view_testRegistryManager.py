from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse

class testRegistryManager(APIView):
    
    def get(self,request):
        # return Response({'message' : 'module up and running . . .'})
        data = [{'name': 'Peter', 'email': 'peter@example.org'},
            {'name': 'Julia', 'email': 'julia@example.org'}]

        return JsonResponse(data, safe=False)
    
    # Sample Data
    def post(self, request):
        print('request:', request)
        print('request.data:', request.data)
        
        data = [{'name': 'Peter', 'email': 'peter@example.org'},
            {'name': 'Julia', 'email': 'julia@example.org'}]

        return JsonResponse(data, safe=False)