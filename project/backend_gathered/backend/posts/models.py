from django.db import models
from accounts.models import CustomUser

class Post(models.Model):
    CONTENT_TYPE_CHOICES = (
        (0, 'Free'),
        (1, 'Subscription'),
        (2, 'Premium'),
    )
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='posts')
    username = models.CharField(max_length=150)
    title = models.CharField(max_length=255)
    tags = models.TextField()
    description = models.TextField()
    contentType = models.IntegerField(choices=CONTENT_TYPE_CHOICES)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    PostDate = models.DateTimeField(auto_now_add=True)
    upvotes = models.ManyToManyField(CustomUser, related_name='post_upvotes', blank=True)
    downvotes = models.ManyToManyField(CustomUser, related_name='post_downvotes', blank=True)
    purchase = models.ManyToManyField(CustomUser, related_name='purchased_posts', blank=True)

class Attachment(models.Model):
    post = models.ForeignKey(Post, related_name='attachments', on_delete=models.CASCADE)
    file = models.FileField(upload_to='attachments/')
