from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models.functions import TruncDate, TruncWeek, TruncMonth
from django.db.models import Sum, Count
from datetime import datetime, timedelta
from calendar import monthrange

from ..authentication.mixins import RoleRequiredMixin
from ..order.models import *
from ..purchase.models import *


def get_monday(date):
    return date - timedelta(days=date.weekday())

def get_sunday(date):
    return date + timedelta(days=(6 - date.weekday()))

def get_first_day_of_month(date):
    return date.replace(day=1)

def get_last_day_of_month(date):
    last_day = monthrange(date.year, date.month)[1]
    return date.replace(day=last_day)

def add_month(date):
    if date.month == 12:
        return date.replace(year=date.year + 1, month=1)
    else:
        return date.replace(month=date.month + 1)

class SalesReportView(RoleRequiredMixin, APIView):
    allowed_roles = [2]
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
                total_amount = float(entry['total_amount'])
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

            return Response(daily_data, status=status.HTTP_200_OK)
        
        elif report_type == "weekly":
            extended_start = get_monday(start_date)
            extended_end = get_sunday(end_date)

            orders = Orders.objects.filter(create_time__gte=extended_start, create_time__lte=extended_end)

            raw_weekly_data = (
                orders
                .annotate(week=TruncWeek('create_time'))
                .values('week')
                .annotate(
                    total_amount=Sum('total_price'),
                    order_count=Count('order_id'))
                .order_by('week')
            )

            raw_weekly_data_dict = {}
            for entry in raw_weekly_data:
                week_start = entry['week'].date()
                raw_weekly_data_dict[week_start] = {
                    "total_amount": float(entry['total_amount']),
                    "order_count": entry['order_count']
                }

            current_week = extended_start
            weekly_data = []
            while current_week <= extended_end:
                data = raw_weekly_data_dict.get(current_week, {"total_amount": 0.0, "order_count": 0})
                weekly_data.append({
                    "date": current_week,
                    "total_amount": data["total_amount"],
                    "order_count": data["order_count"]
                })
                current_week += timedelta(weeks=1)

            return Response(weekly_data, status=status.HTTP_200_OK)
            
        elif report_type == "monthly":
            extended_start = get_first_day_of_month(start_date)
            extended_end = get_last_day_of_month(end_date)

            orders = Orders.objects.filter(create_time__gte=extended_start, create_time__lte=extended_end)

            raw_monthly_data = (
                orders
                .annotate(month=TruncMonth('create_time'))
                .values('month')
                .annotate(
                    total_amount=Sum('total_price'),
                    order_count=Count('order_id'))
                .order_by('month')
            )

            raw_monthly_data_dict = {}
            for entry in raw_monthly_data:
                month_start = entry['month'].date()
                raw_monthly_data_dict[month_start] = {
                    "total_amount": float(entry['total_amount']),
                    "order_count": entry['order_count']
                }

            current_month = extended_start
            monthly_data = []
            while current_month <= extended_end:
                data = raw_monthly_data_dict.get(current_month, {"total_amount": 0.0, "order_count": 0})
                monthly_data.append({
                    "date": current_month,
                    "total_amount": data["total_amount"],
                    "order_count": data["order_count"]
                })
                current_month = add_month(current_month)

            return Response(monthly_data, status=status.HTTP_200_OK)

        else:
            return Response(status=status.HTTP_204_NO_CONTENT)


        
class PurchaseDailyView(RoleRequiredMixin, APIView):
    allowed_roles = [2]
    """
    GET /report/purchase/?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&type=<daily|weekly|monthly>
    Returns list of { date, total_cost, purchase_count } for each period.
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

        # --- daily report (unchanged) ---
        if report_type == "daily":
            qs = InventoryPurchase.objects.filter(
                purchase_time__gte=start_date,
                purchase_time__lte=end_date
            )
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
            data_map = { entry['date']: entry for entry in raw }

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

        # --- weekly report (added) ---
        elif report_type == "weekly":
            extended_start = get_monday(start_date)
            extended_end   = get_sunday(end_date)

            qs = InventoryPurchase.objects.filter(
                purchase_time__gte=extended_start,
                purchase_time__lte=extended_end
            )
            raw_weekly = (
                qs
                .annotate(week=TruncWeek('purchase_time'))
                .values('week')
                .annotate(
                    total_cost=Sum('total_cost'),
                    purchase_count=Count('purchase_id')
                )
                .order_by('week')
            )
            week_map = {
                entry['week'].date(): {
                    "total_cost": float(entry['total_cost']),
                    "purchase_count": entry['purchase_count']
                }
                for entry in raw_weekly
            }

            current_week = extended_start
            weekly_data = []
            while current_week <= extended_end:
                data = week_map.get(current_week, {"total_cost": 0.0, "purchase_count": 0})
                weekly_data.append({
                    "date": current_week,
                    "total_cost": data["total_cost"],
                    "purchase_count": data["purchase_count"]
                })
                current_week += timedelta(weeks=1)

            return Response(weekly_data)

        # --- monthly report (added) ---
        elif report_type == "monthly":
            extended_start = get_first_day_of_month(start_date)
            extended_end   = get_last_day_of_month(end_date)

            qs = InventoryPurchase.objects.filter(
                purchase_time__gte=extended_start,
                purchase_time__lte=extended_end
            )
            raw_monthly = (
                qs
                .annotate(month=TruncMonth('purchase_time'))
                .values('month')
                .annotate(
                    total_cost=Sum('total_cost'),
                    purchase_count=Count('purchase_id')
                )
                .order_by('month')
            )
            month_map = {
                entry['month'].date(): {
                    "total_cost": float(entry['total_cost']),
                    "purchase_count": entry['purchase_count']
                }
                for entry in raw_monthly
            }

            current_month = extended_start
            monthly_data = []
            while current_month <= extended_end:
                data = month_map.get(current_month, {"total_cost": 0.0, "purchase_count": 0})
                monthly_data.append({
                    "date": current_month,
                    "total_cost": data["total_cost"],
                    "purchase_count": data["purchase_count"]
                })
                current_month = add_month(current_month)

            return Response(monthly_data)

        # unsupported type
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)
