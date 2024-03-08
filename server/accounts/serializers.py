from rest_framework import serializers

class RegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=1, max_length=64, write_only=True)
    password = serializers.CharField(min_length=8, max_length=64, write_only=True)