from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse

from api.models import Field

# class: get data related to a particular field. returns a failed
# status if the field is non existent
class getField(APIView):

    def post(self, request):

        response = {"status": "failed"}

        fieldInternalName = request.data["fieldInternalName"]
        try:
            fieldData = Field.objects.get(field_fieldInternalName=fieldInternalName)
            print("Field Data : ", fieldData)

            response = {
                "data": {
                    "fieldInternalName": fieldData.field_fieldInternalName,
                    "fieldExternalName": list(
                        fieldData.field_fieldExternalName.split(",")
                    ),
                    "fieldDescription": fieldData.field_fieldDescription,
                    "fieldDataType": fieldData.field_fieldDataType,
                    "constraints": list(fieldData.field_constraints.split(",")),
                    "preProcessors": list(fieldData.field_preProcessors.split(",")),
                    "created_at": str(fieldData.created_at),
                    "updated_at": str(fieldData.updated_at),
                },
                "status": "success",
            }

        except Exception as error:
            response["error"] = str(error)
            print(error)

        return JsonResponse(response, safe=False)
