from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Order, OrderItem

# 如果你想在 Order 的编辑页面里一并管理它的 OrderItem，可用 Inline：
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'membership', 'salesperson', 'status', 'total_amount')
    inlines = [OrderItemInline]

# 如果你也想单独页面管理 OrderItem，可再注册：
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity')
