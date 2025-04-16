from django.db import models

# Create your models here.
class Report(models.Model):
    daily_report = models.CharField(max_length=50)
