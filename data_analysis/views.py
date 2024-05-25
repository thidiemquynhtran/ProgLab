# data_analysis/views.py

from django.shortcuts import render
from .utils import calculate_total_customers, calculate_average_sales_revenue

def dashboard(request):
    total_customers = calculate_total_customers()
    average_order_value = calculate_average_order_value
    return render(request, 'dashboard.html', {
        'total_customers': total_customers,
        'average_order_value': average_order_value,
    })
