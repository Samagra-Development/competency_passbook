from django.urls import path, include
from .views import *

urlpatterns = [
    path("test", testCrypto.as_view()),
    path("verify", verifySignature.as_view()),
]
