from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser
from django.utils.dateparse import parse_datetime
from django.utils import timezone

class SignupSerializer(serializers.ModelSerializer):
    date_joined = serializers.DateTimeField(required=False, format="%Y-%m-%dT%H:%M:%S.%fZ")

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'date_joined']
        extra_kwargs = {
            'password': {'write_only': True},
            'date_joined': {'required': False}
        }


    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data['date_joined'] = timezone.now()
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username_or_email = data.get("username")
        password = data.get("password")

        user = authenticate(username=username_or_email, password=password)
        if not user:
            # Try authenticating by email
            try:
                user_obj = CustomUser.objects.get(email=username_or_email)
                user = authenticate(username=user_obj.username, password=password)
            except CustomUser.DoesNotExist:
                pass

        if not user:
            raise serializers.ValidationError("Invalid credentials.")
        data["user"] = user
        return data

from rest_framework import serializers
from .models import CustomUser

class UserProfileSerializer(serializers.ModelSerializer):
    followers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    subscribers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'balance', 'avatar', 'followers', 'subscribers', 'subscriptionprice']
