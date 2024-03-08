from rest_framework.views import APIView
from rest_framework import serializers
from .serializers import RegistrationSerializer
from rest_framework.response import Response
from .models import User


class RegisterView(APIView):
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if User.objects.filter(email=serializer.validated_data["email"]).exists():
            raise serializers.ValidationError("User with email already exists")

        user = User(
            email=serializer.validated_data["email"],
            username=serializer.validated_data["username"],
            role=serializer.validated_data["role"],
        )
        user.set_password(serializer.validated_data["password"])
        user.save()

        return Response({"success": True})