from django.db import models

# Customer app models
class Membership(models.Model):
    """
    Represents membership details
    """

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f'{self.name} (ID: {self.id})'


class CustomerAddress(models.Model):
    """
    Represents customer address
    """

    membership = models.ForeignKey(Membership, on_delete=models.CASCADE, related_name='address')
    street = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    province = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='Canada')

    def __str__(self):
        return f'{self.street} {self.city} {self.province} {self.postal_code} {self.country}'
