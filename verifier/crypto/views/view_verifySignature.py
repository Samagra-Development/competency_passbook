import rsa
import base64
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse


class verifySignature(APIView):

    def post(self, request):

        message = request.data["message"]
        signature = request.data["signature"]
        publicKey = (request.data["publicKey"]).encode("utf-8")

        message = message.encode("utf-8")
        signature = base64.b64decode(signature.encode("utf-8"))
        publicKey = rsa.PublicKey.load_pkcs1(publicKey)

        failed = False
        verification = None

        try:
            verification = rsa.verify(message, signature, publicKey)
            print("Verified? ", verification)

        except Exception as error:
            print(error)
            failed = True

        data = {
            "original": {
                "publicKey": request.data["publicKey"],
                "message": request.data["message"],
                "signature": request.data["signature"],
            },
            "verified?": str(verification),
            "status": "success",
        }

        if failed:
            data["status"] = "failed"

        return JsonResponse(data, safe=False)
