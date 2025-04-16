from django.db import models

# Create your models here.

class Report(models.Model):
    REPORT_TYPES = [
        ('daily', 'Daily Report'),
        ('monthly', 'Monthly Report'),
        ('employee', 'Employee Performance'),
        ('inventory', 'Inventory Status'),
        ('sales', 'Sales Report'),
    ]
    
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    title = models.CharField(max_length=100)
    generated_at = models.DateTimeField(auto_now_add=True)
    content = models.TextField()

    def __str__(self):
        return f"{self.get_report_type_display()} - {self.title}"