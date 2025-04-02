from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response

from backend.purchase.models import InventoryPurchase
from backend.purchase.serializers import InventoryPurchaseSerializer


# Create your views here.

class InventoryPurchaseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for InventoryPurchase and Item Model
    """

    queryset = InventoryPurchase.objects.all()
    serializer_class = InventoryPurchaseSerializer


    def destroy(self, request, *args, **kwargs):
        """
        delete and rollback InventoryPurchase
        """
        purchase = self.get_object()
        from django.db import transaction
        with transaction.atomic():
            for item in purchase.items.all():
                product = item.product
                quantity = item.quantity_purchased

                product.stock -= quantity
                product.save()

            product.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)






