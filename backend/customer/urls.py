"""
/memberships/ – GET (list all memberships), POST (create new membership)
/memberships/{id}/ – GET (retrieve membership), PUT/PATCH (update membership), DELETE (delete membership)
/customer-addresses/ – GET (list all addresses, or filter by ?membership=<id>), POST (create new address)
/customer-addresses/{id}/ – GET (retrieve address), PUT/PATCH (update address), DELETE (delete address)
"""

from rest_framework.routers import DefaultRouter
from backend.customer.views import CustomerAddressViewSet, MembershipViewSet

router = DefaultRouter()
router.register(r'customer', MembershipViewSet)
router.register(r'customer-addresses', CustomerAddressViewSet)

urlpatterns = router.urls

