

from rest_framework.routers import DefaultRouter
from backend.customer.views import CustomerAddressViewSet, MembershipViewSet

router = DefaultRouter()
router.register(r'customers', MembershipViewSet)
router.register(r'customer-addresses', CustomerAddressViewSet)

urlpatterns = router.urls

