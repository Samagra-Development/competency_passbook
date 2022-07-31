from django.db import models

# Create your models here.


class Broadcast(models.Model):

    broadcast_broadcastID = models.PositiveBigIntegerField(
        blank=False, null=False, unique=True
    )
    broadcast_broadcastRemark = models.CharField(max_length=200, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def __str__(self):
        return str(self.id) + ". " + "Broadcast ID : " + str(self.broadcast_broadcastID)
