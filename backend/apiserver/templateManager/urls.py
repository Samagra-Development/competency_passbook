from django.urls import path,include
from .views import *

urlpatterns = [
    path('getList', allTemplates.as_view()),
    path('test', testTemplateManager.as_view()),
    path('getTemplate', templateDetails.as_view()),
    path('create', templateCreationManager.as_view()),
]