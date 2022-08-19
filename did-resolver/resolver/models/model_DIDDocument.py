import hashlib
from django.db import models

class DIDDocument(models.Model):
    
    didDocument_ID = models.CharField(max_length=200, blank=True, null=True, unique=True)
    
    didDocument_firstName = models.CharField(max_length=200, blank=True, null=True, unique=True)
    didDocument_lastName = models.CharField(max_length=200, blank=True, null=True, unique=True)
    
    didDocument_emailID = models.CharField(max_length=200, blank=True, null=True, unique=True)
    didDocument_phoneNo = models.CharField(max_length=200, blank=True, null=True, unique=True)
    
    didDocument_resolvableDocument = models.TextField(blank=False, null=False)
    
    created_at = models.DateTimeField(auto_now_add = True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now = True, blank=True, null=True)
    
    def __str__(self):
        return str(self.id) + ". " + "did:ack:" + str(self.didDocument_ID)