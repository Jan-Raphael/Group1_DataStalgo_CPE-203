from django.contrib import admin
from .models import Post, Attachment

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'username', 'contentType', 'PostDate')
    search_fields = ('title', 'username')
    list_filter = ('contentType', 'PostDate')

@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'post', 'file')
    search_fields = ('file',)
