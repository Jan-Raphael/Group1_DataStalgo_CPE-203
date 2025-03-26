from rest_framework import serializers
from .models import Post, Attachment

class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    attachments = serializers.SerializerMethodField()
    upvotes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    downvotes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    purchase = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'user', 'username', 'title', 'tags', 'description',
            'contentType', 'price', 'PostDate', 'attachments',
            'upvotes', 'downvotes', 'purchase'
        ]

    def get_attachments(self, obj):
        return [a.file.name.split('/')[-1] for a in obj.attachments.all()]