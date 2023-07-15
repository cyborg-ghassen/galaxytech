from accounts.models import User
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from rest_framework import serializers


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user = UserSerializer(user).data

        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(username=attrs['username'],
                            password=attrs['password'])
        if not user:
            raise serializers.ValidationError('Incorrect username or password.')
        if not user.is_active:
            raise serializers.ValidationError('User is disabled.')
        return {'user': user}


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    groups_names = serializers.SerializerMethodField()
    password = serializers.CharField(
        write_only=True,
        required=False,
        help_text='Leave empty if no change needed',
        style={'input_type': 'password', 'placeholder': 'Password'}
    )

    class Meta:
        model = User
        fields = "__all__"
        read_only_field = ['is_active', 'updated_at', 'date_joined']

    @staticmethod
    def get_full_name(obj):
        return obj.get_full_name

    @staticmethod
    def get_groups_names(obj):
        return [group.name for group in obj.groups.all()]

    def validate(self, attrs):
        groups = attrs.get("groups", None)
        work_group = attrs.get("work_group", None)

        if not groups:
            raise serializers.ValidationError({"groups": "A group must be selected."})

        groups = Group.objects.filter(id__in=[group.id for group in groups])

        if groups.filter(name=settings.USER_GROUP_NAME).exists() and not work_group:
            raise serializers.ValidationError(
                {"work_group": "A work group must be selected when user group is selected."}
            )

        if groups.filter(name=settings.ADMIN_GROUP_NAME).exists():
            attrs['work_group'] = None
            groups = groups.exclude(name=settings.USER_GROUP_NAME)
            attrs['groups'] = groups

        return attrs

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"
