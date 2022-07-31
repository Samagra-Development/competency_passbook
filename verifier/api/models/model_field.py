from django.db import models

# Create your models here.


class Field(models.Model):

    field_fieldInternalName = models.CharField(
        max_length=200, blank=False, null=False, unique=True
    )
    field_fieldExternalName = models.TextField(blank=False, null=False)
    field_fieldDescription = models.TextField(blank=False, null=False)
    field_fieldDataType = models.CharField(max_length=200, blank=False, null=False)
    field_constraints = models.TextField(blank=True, null=True)
    field_preProcessors = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return str(self.id) + ". " + str(self.field_fieldInternalName)
