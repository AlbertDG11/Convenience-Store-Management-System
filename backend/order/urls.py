from rest_framework.routers import DefaultRouter

from backend.order.views import OrderViewSet

router = DefaultRouter()
router.register('orders', OrderViewSet)

urlpatterns = router.urls