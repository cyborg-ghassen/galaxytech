from rest_framework import viewsets

from marketplace.models import Marketplace

from .serializers import MarketplaceSerializer
from utils.permissions import ViewAdmin


class MarketplaceViewSet(viewsets.ModelViewSet):
    queryset = Marketplace.objects.order_by('-created_at')
    serializer_class = MarketplaceSerializer
    permission_classes = [ViewAdmin]
