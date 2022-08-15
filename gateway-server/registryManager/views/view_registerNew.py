import re
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse

class registerNew(APIView):
    
    def post(self, request):
        print('request:', request)
        print('request.data:', request.data)
        
        firstName = request.data['firstName']
        lastName = request.data['lastName']
        contactField = request.data['contactField']
        
        validate_phone_number_pattern = "^\\+?[1-9][0-9]{7,14}$"
        validate_email_id_pattern = r"^\S+@\S+\.\S+$"
        
        typeContactField = None
        if re.match(validate_phone_number_pattern, contactField):
            typeContactField = 'phoneNumber'
        elif re.match(validate_email_id_pattern, contactField):
            typeContactField = 'emailId'

        return JsonResponse({
            'firstName': firstName,
            'lastName': lastName,
            'typeOfContact': typeContactField
        }, safe=False)