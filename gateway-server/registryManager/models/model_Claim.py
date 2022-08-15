import uuid
from django.db import models

class Claim(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    claim_claimName = models.CharField(max_length=100, blank=True, null=True, unique=False)
    claim_claimDescription = models.TextField(blank=False, null=False)
    claim_claimType = models.TextField(blank=True, null=True)
    
    claim_sender = models.CharField(max_length=200, blank=False, null=False, unique=False)
    claim_receiver = models.CharField(max_length=200, blank=False, null=False, unique=False)
    
    claim_data = models.TextField(blank=False, null=False)
    
    created_at = models.DateTimeField(auto_now_add = True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now = True, blank=True, null=True)
    
    def __str__(self):
        return "[" + str(self.id) + "] " + str(self.claim_sender) + " -> " + str(self.claim_receiver)