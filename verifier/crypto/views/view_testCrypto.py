from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse


class testCrypto(APIView):
    def get(self, request):
        
        data = [
            {"name": "Peter", "email": "peter@example.org"},
            {"name": "Julia", "email": "julia@example.org"},
        ]

        return JsonResponse(data, safe=False)

    # Sample Data
    def post(self, request):

        data = [
            {"name": "Peter", "email": "peter@example.org"},
            {"name": "Julia", "email": "julia@example.org"},
        ]

        return JsonResponse(data, safe=False)
