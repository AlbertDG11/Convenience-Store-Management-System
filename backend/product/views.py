from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Product,FoodProduct, NonFoodProduct,  Inventory
from .serializer import ProductSerializer, InventorySerializer, FoodProductSerializer, NonFoodProductSerializer

class ProductViewSet(viewsets.ViewSet):
    """
    A ViewSet giving full CRUD for Product + its food/nonfood sub‑records,
    all through the one ProductSerializer.
    """

    def list(self, request):
        """
        GET /api/product/products/
        Optionally filter by ?type=food or ?type=nonfood
        """
        qs = Product.objects.all()
        t = request.query_params.get('type')
        if t in ('food', 'nonfood'):
            qs = qs.filter(type=t)
        serializer = ProductSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        """
        GET /api/product/products/{pk}/
        """
        prod = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(prod)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        """
        POST /api/product/products/
        Body: { name, type, discount, price, price_after_discount,
                food_type, storage_condition, expiration_date,
                warranty_period, brand }
        """
        serializer = ProductSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        prod = serializer.save()
        out   = ProductSerializer(prod)
        return Response(out.data, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        """
        PUT /api/product/products/{pk}/
        Full replace of all fields.
        """
        prod = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(prod, data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        prod = serializer.save()
        out  = ProductSerializer(prod)
        return Response(out.data, status=status.HTTP_200_OK)

    def partial_update(self, request, pk=None):
        """
        PATCH /api/product/products/{pk}/
        Partial update of any subset of fields.
        """
        prod = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(prod, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        prod = serializer.save()
        out  = ProductSerializer(prod)
        return Response(out.data, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        """
        DELETE /api/product/products/{pk}/
        """
        prod = get_object_or_404(Product, pk=pk)
        prod.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
 
class FoodProductViewSet(viewsets.ModelViewSet):
    """
    Exposes all FoodProduct rows.
    You can filter by ?product=<product_id> to fetch one specific record.
    """
    queryset = FoodProduct.objects.all()
    serializer_class = FoodProductSerializer

    def list(self, request):
        product_id = request.query_params.get('product')
        qs = self.queryset
        if product_id is not None:
            qs = qs.filter(product__product_id=product_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

class NonFoodProductViewSet(viewsets.ModelViewSet):
    queryset = NonFoodProduct.objects.all()
    serializer_class = NonFoodProductSerializer

    def list(self, request):
        product_id = request.query_params.get('product')
        qs = self.queryset
        if product_id is not None:
            qs = qs.filter(product__product_id=product_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)   
#class FoodProductViewSet(viewsets.ModelViewSet):
#    queryset = FoodProduct.objects.all()
#    serializer_class = FoodProductSerializer


#class NonFoodProductViewSet(viewsets.ModelViewSet):
#    queryset = NonFoodProduct.objects.all()
#    serializer_class = NonFoodProductSerializer
    
class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    