from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet
from rest_framework.views import APIView
from django.db.models.functions import TruncDate
from django.db.models import Sum, Count
from datetime import datetime, timedelta


#from .models import Report
#from .serializer import ReportSerializer
from ..order.models import *
from ..purchase.models import *

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

class SalesDailyView(APIView):
    def get(self, request):
        start_date_str = request.GET.get('start_date')
        end_date_str = request.GET.get('end_date')
        report_type = request.GET.get('type')
        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format"}, status=400)
        orders = Orders.objects.filter(create_time__gte=start_date, create_time__lte=end_date)
        if report_type == "daily":
            raw_daily_data = (
                orders
                .annotate(date=TruncDate('create_time'))
                .values('date')
                .annotate(
                    total_amount=Sum('total_price'),
                    order_count=Count('order_id'))
                .order_by('date')
            )

            raw_daily_data_dict = {}

            for entry in raw_daily_data:
                date = entry['date']
                total_amount = float(entry['total_amount'])  # 确保金额是浮点数
                order_count = entry['order_count']

                raw_daily_data_dict[date] = {
                    "total_amount": total_amount,
                    "order_count": order_count
                }

                current_day = start_date
                daily_data = []
                while current_day <= end_date:
                    data = raw_daily_data_dict.get(current_day, {"total_amount": 0.0, "order_count": 0})
                    daily_data.append({
                        "date": current_day,
                        "total_amount": float(data["total_amount"]),
                        "order_count": data["order_count"]
                    })
                    current_day += timedelta(days=1)

            return Response(daily_data)
        
class PurchaseDailyView(APIView):
    """
    GET /report/purchase/?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&type=daily
    Returns list of { date, total_cost, purchase_count } for each day.
    """
    def get(self, request):
        start_date_str = request.GET.get('start_date')
        end_date_str   = request.GET.get('end_date')
        report_type    = request.GET.get('type')

        # parse & validate dates
        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            end_date   = datetime.strptime(end_date_str,   "%Y-%m-%d").date()
        except (TypeError, ValueError):
            return Response({"error": "Invalid or missing date"}, status=status.HTTP_400_BAD_REQUEST)

        if report_type != "daily":
            return Response({"error": "Unsupported report type"}, status=status.HTTP_400_BAD_REQUEST)

        # filter purchases in range
        qs = InventoryPurchase.objects.filter(
            purchase_time__date__gte=start_date,
            purchase_time__date__lte=end_date
        )

        # aggregate per day
        raw = (
            qs
            .annotate(date=TruncDate('purchase_time'))
            .values('date')
            .annotate(
                total_cost=Sum('total_cost'),
                purchase_count=Count('purchase_id')
            )
            .order_by('date')
        )

        # map for quick lookup
        data_map = { entry['date']: entry for entry in raw }

        # build full list with zero‐fills
        current = start_date
        daily_data = []
        while current <= end_date:
            entry = data_map.get(current, {'total_cost': 0, 'purchase_count': 0})
            daily_data.append({
                "date": current,
                "total_cost": float(entry['total_cost'] or 0),
                "purchase_count": entry['purchase_count']
            })
            current += timedelta(days=1)

        return Response(daily_data)