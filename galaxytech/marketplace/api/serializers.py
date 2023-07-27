from rest_framework import serializers

from marketplace.models import Marketplace


class MarketplaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marketplace
        fields = "__all__"
