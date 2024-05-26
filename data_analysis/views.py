# data_analysis/views.py
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils import (
    calculate_total_customers,
    calculate_average_order_value,
    calculate_repeat_purchase_rate,
    calculate_total_revenue,
    get_total_sales_by_month_with_filters,
    get_total_sales_by_size_with_filters,
    get_total_sales_by_product_with_filters,
    get_pizza_category_distribution,
    get_monthly_sales_by_category,
    get_total_sales_by_state
)

def index_view(request):
    return render(request, 'index.html')

#Returns total number of customers
@api_view(['GET'])
def total_customers_view(request):
    total_customers = calculate_total_customers()
    return Response({'total_customers': total_customers})

#Returns average order value
@api_view(['GET'])
def average_order_value_view(request):
    average_order_value = calculate_average_order_value()
    return Response({'average_order_value': average_order_value})

#Returns repeat purchase rate
@api_view(['GET'])
def repeat_purchase_rate_view(request):
    repeat_purchase_rate = calculate_repeat_purchase_rate()
    return Response({'repeat_purchase_rate': repeat_purchase_rate})

#Returns total revenue
@api_view(['GET'])
def total_revenue_view(request):
    total_revenue = calculate_total_revenue()
    return Response({'total_revenue': total_revenue})

#Returns total sales by month, optional year filter
@api_view(['GET'])
def total_sales_by_month_view(request):
    year = request.query_params.get('year')
    data = get_total_sales_by_month_with_filters(year)
    return Response(data)

@api_view(['GET'])
def total_sales_by_size_view(request):
    year = request.query_params.get('year')
    product = request.query_params.get('product')
    size = request.query_params.get('size')
    data = get_total_sales_by_size_with_filters(year, product, size)
    return Response(data)

@api_view(['GET'])
def total_sales_by_product_view(request):
    product = request.query_params.get('product')
    data = get_total_sales_by_product_with_filters(product)
    return Response(data)

@api_view(['GET'])
def pizza_category_distribution_view(request):
    data = get_pizza_category_distribution()
    return Response(data)

@api_view(['GET'])
def monthly_sales_by_category_view(request):
    category = request.query_params.get('category')
    data = get_monthly_sales_by_category(category)
    return Response(data)

@api_view(['GET'])
def total_sales_by_state_view(request):
    state = request.query_params.get('state')
    data = get_total_sales_by_state(state)
    return Response(data)

    
