from django.urls import path,include
from .views import *

urlpatterns = [
    path('getList', allSchemas.as_view()),
    path('test', testSchemaManager.as_view()),
    path('getSchema', schemaDetails.as_view()),
    path('create', schemaCreationManager.as_view()),
]