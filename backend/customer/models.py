from django.db import models

# Customer app models
class Membership(models.Model):
    membership_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'membership'


class MemberAddress(models.Model):
    id = models.AutoField(primary_key=True)
    membership = models.ForeignKey(
        Membership, on_delete=models.CASCADE, db_column='Membership_id'
    )
    city = models.CharField(max_length=50)
    province = models.CharField(max_length=50)
    street_address = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)

    class Meta:
        db_table = 'member_address'
        unique_together = (
            ('membership', 'city', 'province', 'street_address', 'postal_code'),
        )

