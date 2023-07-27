from rest_framework.routers import DefaultRouter

from .viewsets import MarketplaceViewSet

router = DefaultRouter()
router.register("", MarketplaceViewSet, basename="marketplace")

urlpatterns = [
    *router.urls,
]
