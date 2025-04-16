from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet


from .models import Report
from .serializer import ReportSerializer

class ReportViewSet(ViewSet):
    """
    ViewSet for Reports
    """
    permission_classes = [IsAuthenticated]

    def list(self, request):
        report_type = request.query_params.get('type')

        if not report_type:
            return Response({"detail": "Missing 'type' query parameter."}, status=status.HTTP_400_BAD_REQUEST)

        """
        Check needed report type
        """
        if report_type == "daily":
            return self.get_daily_report()
        elif report_type == "monthly":
            return self.get_monthly_report()
        elif report_type == "employee":
            return self.get_employee_performance_report()
        elif report_type == "inventory":
            return self.get_inventory_status_report()
        elif report_type == "sales":
            return self.get_sales_report()
        else:
            return Response({"detail": f"Unknown report type: {report_type}"}, status=status.HTTP_400_BAD_REQUEST)

        """
        Calculate needed data
        """

    def get_daily_report(self):
        #TODO
        pass

    def get_monthly_report(self):
        #TODO
        pass

    def get_employee_performance_report(self):
        #TODO
        pass

    def get_inventory_status_report(self):
        pass
    
    def get_sales_report(self):
        pass
