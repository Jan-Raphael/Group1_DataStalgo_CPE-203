from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    followers = models.ManyToManyField('self', symmetrical=False, related_name='following', blank=True)
    subscribers = models.ManyToManyField('self', symmetrical=False, related_name='subscriptions', blank=True)
    subscriptionprice = models.DecimalField(max_digits=6, decimal_places=2, default=0.0)

    def __str__(self):
        return self.username
