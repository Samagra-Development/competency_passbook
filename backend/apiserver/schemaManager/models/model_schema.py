from django.db import models

class Schema(models.Model):
    
    schema_schemaName = models.CharField(max_length=100, blank=True, null=True, unique=True)
    schema_schemaData = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add = True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now = True, blank=True, null=True)
    
    def __str__(self):
        return str(self.id) + ". " + str(self.schema_schemaName)