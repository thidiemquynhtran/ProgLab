# data_analysis/views.py
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils import (
    calculate_total_customers,
    calculate_average_sales_revenue,
    get_total_sales_by_year_with_filters,
    get_total_sales_by_size_with_filters,
    get_total_sales_by_product_with_filters,
    get_pizza_category_distribution,
    get_total_sales_by_state
)

def index_view(request):
    return render(request, 'index.html')
  
def dashboard(request):
    total_customers = calculate_total_customers()
    average_order_value = calculate_average_order_value
    return render(request, 'dashboard.html', {
        'total_customers': total_customers,
        'average_order_value': average_order_value,
    })

@api_view(['GET'])
def total_customers_view(request):
    total_customers = calculate_total_customers()

    return Response({'total_customers': total_customers})

@api_view(['GET'])
def average_sales_revenue_view(request):
    average_sales_revenue = calculate_average_sales_revenue()
    return Response({'average_sales_revenue': average_sales_revenue})

@api_view(['GET'])
def total_sales_by_year_view(request):
    year = request.query_params.get('year')
    product = request.query_params.get('product')
    data = get_total_sales_by_year_with_filters(year, product)
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
    state = request.query_params.get('state')
    year = request.query_params.get('year')
    data = get_pizza_category_distribution(state, year)
    return Response(data)

@api_view(['GET'])
def total_sales_by_state_view(request):
    state = request.query_params.get('state')
    data = get_total_sales_by_state(state)
    return Response(data)

    average_order_value = calculate_average_order_value
    return render(request, 'dashboard.html', {
        'total_customers': total_customers,
        'average_order_value': average_order_value,
    })

