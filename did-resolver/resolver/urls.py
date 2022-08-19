from django.urls import path,include
from .views import *

urlpatterns = [
    path('test', testResolver.as_view()),
    path('resolveDID', resolveDIDDocument.as_view()),
    path('registerDID', registerNewDID.as_view()),
]