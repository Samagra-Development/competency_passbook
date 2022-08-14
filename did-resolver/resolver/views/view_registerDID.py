import re
import json
import hashlib
from resolver.models import *
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response

class registerNewDID(APIView):
    
    def post(self, request):
        
        print("aaaaaaaaa request data :", request.data)
        
        try:
            firstName = request.data['firstName']
            lastName = request.data['lastName']
            contactField = request.data['contactField']
            publicKey = request.data['publicKey']
            didSignature = request.data['didSignature']
            
            didID = str(hashlib.sha256(contactField.encode('utf-8')).hexdigest())
            
            didDocument = {}
            didDocument["@context"] = [
                "https://www.w3.org/ns/did/v1"
            ]
            didDocument["id"] = "did:ack:" + didID
            didDocument["verificationMethod"] = []
            
            verificationObject = {
                "id" : "did:ack:" + didID + "#key-1",
                "type" : "RSASignature",
                "controller" : "did:ack:" + didID,
                "signature": didSignature
            }
            
            didDocument["verificationMethod"].append(verificationObject)
            didDocument["authentication"] = {
                "key-1" : {
                    "type" : "RSAPublicKey",
                    "key" : publicKey,
                    "status" : "active"
                }
            }
            
            didEmailID, didPhoneNo = None, None
            
            email_validate_pattern = r"^\S+@\S+\.\S+$"
            validate_phone_number_pattern = "^\\+?[1-9][0-9]{7,14}$"
            
            if re.match(email_validate_pattern, contactField) is not None:
                didEmailID = contactField
            elif re.match(validate_phone_number_pattern, contactField) is not None:
                didPhoneNo = contactField
            else:
                return JsonResponse({
                    'message' : 'failed',
                    'description' : 'Insufficient Contact Details'
                }, safe=False)
            
            didDocument = json.dumps(didDocument)
            
            newDIDDocument = DIDDocument.objects.create(
                didDocument_ID = didID,
                didDocument_firstName = firstName,
                didDocument_lastName = lastName,
                didDocument_emailID = didEmailID,
                didDocument_phoneNo = didPhoneNo,
                didDocument_resolvableDocument = didDocument
            )
            print("New DID Document :", newDIDDocument)
            
            return JsonResponse({
                'message' : 'success',
                'didID' : 'did:ack:' + didID
            }, safe=False)
        
        except Exception as error:
            print(error)
            return JsonResponse({
                'message' : 'failed',
                'description' : 'Failed to create DID',
                'error' : str(error)
            }, safe=False)