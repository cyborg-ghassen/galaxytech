from accounts.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group, Permission
from rest_framework import serializers


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user = UserSerializer(user).data
        authenticate(username=validated_data['username'],
                     password=validated_data['password'])

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
        is_marketplace = attrs.get("is_marketplace", None)
        marketplace = attrs.get("marketplace", None)

        if not groups:
            raise serializers.ValidationError({"groups": "A group must be selected."})

        if not marketplace and is_marketplace:
            raise serializers.ValidationError(
                {"is_marketplace": "A marketplace must be "
                                   "selected when the user is a marketplace user."}
            )

        if not marketplace:
            attrs['is_marketplace'] = False

        return attrs

    def create(self, validated_data):
        groups = validated_data.pop('groups', [])
        user_permissions = validated_data.pop('user_permissions', [])

        # Create the user
        user = User.objects.create_user(**validated_data)

        # Set the many-to-many relationships after the user has been saved
        for group in groups:
            user.groups.add(group)

        for permission in user_permissions:
            user.user_permissions.add(permission)

        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = "__all__"
