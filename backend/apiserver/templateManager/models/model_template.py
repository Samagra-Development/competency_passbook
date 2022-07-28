from django.db import models

class Template(models.Model):
    
    template_templateName = models.CharField(max_length=100, blank=True, null=True, unique=True)
    template_templateData = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add = True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now = True, blank=True, null=True)
    
    def __str__(self):
        return str(self.id) + ". " + str(self.template_templateName)