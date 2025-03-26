from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SignupSerializer, LoginSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import CustomUser
from .serializers import UserProfileSerializer
from django.http import FileResponse, Http404
import os
from django.conf import settings
from django.contrib.auth import authenticate
from posts.models import Post
from posts.serializers import PostSerializer

class SignupView(APIView):
    def post(self, request):
        print("SIGNUP DATA:", request.data)
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'id': user.id,
                'username': user.username,
                'token': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)
        print("SIGNUP ERROR:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'id': user.id,
                'username': user.username,
                'token': str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class UserProfileView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, username):
        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AvatarView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
            if user.avatar:
                return FileResponse(user.avatar, content_type='image/jpeg')
            else:
                # Fallback to default avatar image
                default_avatar_path = os.path.join(settings.MEDIA_ROOT, 'default-avatar.png')
                if os.path.exists(default_avatar_path):
                    return FileResponse(open(default_avatar_path, 'rb'), content_type='image/png')
                raise Http404("Default avatar not found")
        except CustomUser.DoesNotExist:
            return Response({'message': 'User not found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def paypal_topup(request):
    try:
        transaction_id = request.data.get('transactionId')
        amount = Decimal(request.data.get('amount'))
        payer_id = request.data.get('payerId')

        if not transaction_id or not amount or not payer_id:
            return Response({'message': 'Missing data'}, status=400)

        user = CustomUser.objects.get(id=payer_id)

        # Optional: Validate transaction ID with PayPal API here if needed.

        user.balance += amount
        user.save()

        return Response({'message': 'Balance updated successfully'}, status=200)

    except CustomUser.DoesNotExist:
        return Response({'message': 'User not found'}, status=404)

    except Exception as e:
        print("PayPal Error:", str(e))
        return Response({'message': 'Failed to process transaction'}, status=500)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request):
    author_username = request.data.get('Authorname')
    try:
        author = CustomUser.objects.get(username=author_username)
        user = request.user
        if user in author.followers.all():
            author.followers.remove(user)
        else:
            author.followers.add(user)
        author.save()
        return Response(UserProfileSerializer(author).data)
    except CustomUser.DoesNotExist:
        return Response({'message': 'User not found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def subscribe_user(request):
    author_username = request.data.get('Authorname')
    user = request.user
    try:
        author = CustomUser.objects.get(username=author_username)

        # Check if already subscribed
        if user in author.subscribers.all():
            author.subscribers.remove(user)
        else:
            # Check balance before subscribing
            if user.balance < author.subscriptionprice:
                return Response({'message': 'Insufficient balance'}, status=401)
            user.balance -= author.subscriptionprice
            user.save()
            author.balance += author.subscriptionprice
            author.subscribers.add(user)
            author.save()
        return Response(UserProfileSerializer(author).data)
    except CustomUser.DoesNotExist:
        return Response({'message': 'User not found'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def purchased_posts(request, user_id):
    try:
        posts = Post.objects.filter(purchase__id=user_id)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'message': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def subscriptions_list(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        subscriptions = user.subscriptions.all()
        serializer = UserProfileSerializer(subscriptions, many=True)
        return Response(serializer.data)
    except CustomUser.DoesNotExist:
        return Response({'message': 'User not found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user_info(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        username = request.data.get('username')
        email = request.data.get('email')
        subprice = request.data.get('subprice')
        password = request.data.get('password')

        # Validate credentials
        auth_user = authenticate(username=user.username, password=password)
        if not auth_user:
            return Response({'message': 'Invalid password'}, status=511)

        # Update fields
        user.username = username
        user.email = email
        user.subscriptionprice = subprice
        user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'token': str(refresh.access_token),
            'password': password  # 🔐 Only send if required by frontend logic
        })
    except CustomUser.DoesNotExist:
        return Response({'message': 'User not found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_subscription(request):
    try:
        username = request.data.get('Authorname')
        user = request.user
        author = CustomUser.objects.get(username=username)

        if user in author.subscribers.all():
            author.subscribers.remove(user)
        else:
            if user.balance < author.subscriptionprice:
                return Response({'message': 'Insufficient balance'}, status=401)
            user.balance -= author.subscriptionprice
            author.balance += author.subscriptionprice
            user.save()
            author.save()
            author.subscribers.add(user)

        return Response({'message': 'Success'})
    except CustomUser.DoesNotExist:
        return Response({'message': 'Author not found'}, status=404)
