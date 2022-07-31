from django.urls import path, include
from .views import *

urlpatterns = [path("test", testApi.as_view()), path("getField", getField.as_view())]
