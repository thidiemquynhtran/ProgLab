# data_analysis/views.py
from django.shortcuts import render
import pandas as pd
from django.http import JsonResponse
from .models import Order, OrderItem, Product
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils import (
    calculate_total_customers,
    calculate_average_order_value,
    calculate_repeat_purchase_rate,
    calculate_total_revenue,
    get_total_sales_by_month_with_filters,
    get_total_sales_by_product_with_filters,
    get_pizza_category_distribution,
    get_customer_locations,
    get_monthly_sales_by_category,
    get_total_sales_by_state,
    get_total_sales_by_year_with_filters,
    calculate_total_shops,
    calculate_total_items_sold,
    calculate_total_orders,
    get_revenue_by_store_in_state
  
    )

def index_view(request):
    return render(request, 'index.html')

def products_view(request):
    # Your logic to prepare data for the template (if needed)
    context = {}  # Create a context dictionary to pass data to the template (if needed)
    return render(request, 'products.html', context)

def stores_view(request):
    # Your logic to prepare data for the template (if needed)
    context = {} 
    return render(request, 'stores.html', context)

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
    year = request.GET.get('year', None)
    sales_data = get_total_sales_by_month_with_filters(year=year)
    return JsonResponse(sales_data, safe=False)

@api_view(['GET'])
def total_sales_by_product_view(request):
    # Holen Sie sich die erforderlichen Daten aus Ihrer Datenbank
    orders_df = pd.DataFrame(Order.objects.values('orderid', 'orderdate','total'))
    items_df = pd.DataFrame(OrderItem.objects.values('orderid', 'sku'))
    products_df = pd.DataFrame(Product.objects.values('sku', 'name','price'))

    # Aufruf der Funktion mit den abgerufenen DataFrames als Argumente
    data = get_total_sales_by_product_with_filters(orders_df, items_df, products_df)
    return Response(data)

@api_view(['GET'])
def pizza_category_distribution_view(request):
    # Holen Sie sich die erforderlichen Daten aus Ihrer Datenbank
    orders_df = pd.DataFrame(Order.objects.values('orderid', 'orderdate', 'nitems'))
    items_df = pd.DataFrame(OrderItem.objects.values('orderid', 'sku'))
    products_df = pd.DataFrame(Product.objects.values('sku', 'name', 'price'))

    # Holen Sie die Jahr- und Monatsparameter aus der Anfrage
    year = request.GET.get('year')
    month = request.GET.get('month')

    # Aufruf der Funktion mit den abgerufenen DataFrames als Argumente und den optionalen Filtern
    data = get_pizza_category_distribution(orders_df, items_df, products_df, year=year, month=month)
    return Response(data)

@api_view(['GET'])
def monthly_sales_by_category_view(request):
   # Fetch required data from your database
    orders_df = pd.DataFrame(Order.objects.values('orderid', 'orderdate', 'nitems'))
    items_df = pd.DataFrame(OrderItem.objects.values('orderid', 'sku'))
    products_df = pd.DataFrame(Product.objects.values('sku', 'name', 'price'))

    # Get the year and category parameters from the request
    year = request.GET.get('year')
    category = request.GET.get('category')

    # Call the function with the retrieved DataFrames as arguments and the optional filters
    data = get_monthly_sales_by_category(orders_df, items_df, products_df, year=year, category=category)
    return Response(data)

@api_view(['GET'])
def total_sales_by_state_view(request):
    state = request.query_params.get('state')
    data = get_total_sales_by_state(state)
    return Response(data)

@api_view(['GET'])
def total_sales_by_year_view(request):
    data = get_total_sales_by_year_with_filters()
    return Response(data)

@api_view(['GET'])
def customer_locations_view(request):
    customer_locations = get_customer_locations()
    return Response({'customer_locations': customer_locations})

#Return total shops keymetric
@api_view(['GET'])
def total_shops_view(request):
    total_shops = calculate_total_shops()
    return Response({'total_shops': total_shops})

#Return total items sold keymetric
@api_view(['GET'])
def total_items_sold_view(request):
    total_items_sold = calculate_total_items_sold()
    return Response({'total_items_sold': total_items_sold})

#Return total orders keymetric
@api_view(['GET'])
def total_orders_view(request):
    total_orders = calculate_total_orders()
    return Response({'total_orders': total_orders})

#Return bar chart compare revenue
@api_view(['GET'])
def revenue_by_store_in_state_view(request):
    state = request.GET.get('state')
    if not state:
        return Response({"error": "State parameter is required"}, status=400)
    
    data = get_revenue_by_store_in_state(state)
    return JsonResponse(data, safe=False)