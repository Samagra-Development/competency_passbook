import re
import json
import hashlib
from resolver.models import *
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response

class resolveDIDDocument(APIView):
    
    def get(self, request):
        
        try:
            didURL = request.GET['resolve']
            DIDSubQueries = didURL.split('#')
            
            didSubject = DIDSubQueries[0].split(':')
            didSubjectID = None
            if len(didSubject) == 3 and didSubject[0] == 'did' and didSubject[1] == 'ack':
                didSubjectID = didSubject[-1]
            
            validSubQueries = {}
            validSubQueries['key'] = []
            
            for didSubQuery in range(1, len(DIDSubQueries)):
                subQuerySplit = DIDSubQueries[didSubQuery].split('-')
                if subQuerySplit[0] == 'key':
                    validSubQueries['key'].append(DIDSubQueries[didSubQuery])
            
            didObject = DIDDocument.objects.get(
                didDocument_ID = didSubjectID
            )
            didDocument = json.loads(didObject.didDocument_resolvableDocument)
            
            response = {
                "message" : "success",
                "description" : "resolved to DID Document",
                "didID" : DIDSubQueries[0],
            }
            
            if len(DIDSubQueries) == 1:
                response["didDocument"] = didDocument
                return JsonResponse(response, safe=False)
            else:
                subQueryResults = []
                for subQueryType in validSubQueries:
                    for query in validSubQueries[subQueryType]:
                        if subQueryType == 'key':
                            try:
                                subQueryResults.append((query, didDocument['authentication'][query]))
                            except KeyError:
                                pass
                
                for query, result in subQueryResults:
                    response[query] = result
                return JsonResponse(response, safe=False)    
        
        except Exception as error:
            return JsonResponse({
                    'message' : 'failed',
                    'description' : 'unable to resolve DID URL',
                    'error' : str(error)
                }, safe=False)