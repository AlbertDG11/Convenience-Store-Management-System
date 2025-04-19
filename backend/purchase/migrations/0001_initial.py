# Generated by Django 5.1.7 on 2025-04-19 05:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('product', '0001_initial'),
        ('supplier', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='InventoryPurchase',
            fields=[
                ('purchase_id', models.AutoField(primary_key=True, serialize=False)),
                ('purchase_time', models.DateTimeField()),
                ('total_cost', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('supplier', models.ForeignKey(blank=True, db_column='Supplier_id', null=True, on_delete=django.db.models.deletion.SET_NULL, to='supplier.supplier')),
            ],
            options={
                'db_table': 'inventory_purchase',
            },
        ),
        migrations.CreateModel(
            name='PurchaseItem',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('item_id', models.IntegerField()),
                ('quantity_purchased', models.IntegerField()),
                ('product', models.ForeignKey(blank=True, db_column='Product_id', null=True, on_delete=django.db.models.deletion.RESTRICT, to='product.product')),
                ('purchase', models.ForeignKey(db_column='Purchase_id', on_delete=django.db.models.deletion.CASCADE, to='purchase.inventorypurchase')),
            ],
            options={
                'db_table': 'purchase_item',
                'unique_together': {('purchase', 'item_id')},
            },
        ),
    ]
