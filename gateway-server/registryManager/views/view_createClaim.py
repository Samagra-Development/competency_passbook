import re
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse

class createClaim(APIView):
    
    def post(self, request):
        print('request:', request)
        print('request.data:', request.data)
        
        claimName = request.data['claimName']
        claimDescription = request.data['claimDescription']
        claimType = request.data['claimType']
        sender = request.data['sender']
        receiver = request.data['receiver']
        data = request.data['claim']

        return JsonResponse({
            'claimName': claimName,
            'claimDescription': claimDescription,
            'claimType': claimType
        }, safe=False)