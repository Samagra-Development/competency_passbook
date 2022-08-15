from django.urls import path,include
from .views import *

urlpatterns = [
    path('register', registerNew.as_view()),
    path('createClaim', createClaim.as_view()),
    path('test', testRegistryManager.as_view()),
]