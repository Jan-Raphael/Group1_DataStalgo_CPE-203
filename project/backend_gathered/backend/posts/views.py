from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Post, Attachment
from .serializers import PostCreateSerializer, AttachmentSerializer, PostSerializer
from accounts.models import CustomUser
import os
from django.conf import settings

class PostListView(APIView):
    def get(self, request):
        posts = Post.objects.exclude(user=None).order_by('-PostDate')  # Skip posts with no user
        result = []
        for post in posts:
            attachments = [a.file.name.split('/')[-1] for a in post.attachments.all()]
            result.append({
                'id': post.id,
                'userId': post.user.id,
                'username': post.username,
                'title': post.title,
                'tags': post.tags,
                'description': post.description,
                'contentType': post.contentType,
                'price': float(post.price),
                'PostDate': post.PostDate,
                'upvotes': [u.id for u in post.upvotes.all()],
                'downvotes': [u.id for u in post.downvotes.all()],
                'purchase': [u.id for u in post.purchase.all()],
                'AttachmentCount': len(attachments),
                'attachments': attachments,
                'subscribers': [s.id for s in post.user.subscribers.all()],
            })
        return Response(result)


class PublishPostView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # ✅ Enforce auth properly
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        user = request.user
        if not user or not user.is_authenticated:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        data = request.data.copy()
        data['user'] = user.id
        data['username'] = user.username

        post_serializer = PostCreateSerializer(data=data)
        if post_serializer.is_valid():
            post = post_serializer.save()
            if request.FILES.getlist('attachments'):
                for file in request.FILES.getlist('attachments'):
                    Attachment.objects.create(post=post, file=file)
            return Response({'message': 'Post created successfully'}, status=status.HTTP_201_CREATED)
        return Response(post_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserPostsView(APIView):
    def get(self, request, user_id):
        posts = Post.objects.filter(user_id=user_id).order_by('-PostDate')
        result = []
        for post in posts:
            attachments = [a.file.name.split('/')[-1] for a in post.attachments.all()]
            result.append({
                'id': post.id,
                'userId': post.user.id,
                'username': post.username,
                'title': post.title,
                'tags': post.tags,
                'description': post.description,
                'contentType': post.contentType,
                'price': float(post.price),
                'PostDate': post.PostDate,
                'upvotes': [u.id for u in post.upvotes.all()],
                'downvotes': [u.id for u in post.downvotes.all()],
                'purchase': [u.id for u in post.purchase.all()],
                'AttachmentCount': len(attachments),
                'attachments': attachments,
                'subscribers': [s.id for s in post.user.subscribers.all()],
            })
        return Response(result)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Post
from .utils import serialize_post
from django.http import FileResponse

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upvote_post(request, post_id):
    user = request.user
    try:
        post = Post.objects.get(id=post_id)
        post.downvotes.remove(user)
        post.upvotes.add(user)
        post.save()
        return Response(serialize_post(post))
    except Post.DoesNotExist:
        return Response({'message': 'Post not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def downvote_post(request, post_id):
    user = request.user
    try:
        post = Post.objects.get(id=post_id)
        post.upvotes.remove(user)
        post.downvotes.add(user)
        post.save()
        return Response(serialize_post(post))
    except Post.DoesNotExist:
        return Response({'message': 'Post not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def purchase_post(request, post_id):
    user = request.user
    try:
        post = Post.objects.get(id=post_id)
        if user in post.purchase.all():
            return Response({'message': 'Already purchased'}, status=200)
        if user.balance < post.price:
            return Response({'message': 'Insufficient balance'}, status=401)
        user.balance -= post.price
        user.save()
        post.user.balance += post.price
        post.user.save()
        post.purchase.add(user)
        post.save()
        return Response(serialize_post(post))
    except Post.DoesNotExist:
        return Response({'message': 'Post not found'}, status=404)

@api_view(['GET'])
def get_single_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        serializer = PostSerializer(post)
        return Response(serializer.data)
    except Post.DoesNotExist:
        return Response({'message': 'Post not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def download_attachment(request):
    try:
        post_id = request.data.get('PostId')
        filename = request.data.get('Filename')
        user = request.user

        post = Post.objects.get(id=post_id)

        allowed = post.contentType == 0 or user == post.user or \
                  (post.contentType == 1 and user in post.subscribers.all()) or \
                  (post.contentType == 2 and user in post.purchase.all())

        if not allowed:
            return Response({'message': 'Unauthorized'}, status=401)

        filepath = os.path.join(settings.MEDIA_ROOT, 'attachments', filename)
        if os.path.exists(filepath):
            return FileResponse(open(filepath, 'rb'), as_attachment=True, filename=filename)
        return Response({'message': 'File not found'}, status=404)

    except Exception as e:
        return Response({'message': str(e)}, status=500)
