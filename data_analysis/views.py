from django.shortcuts import render
import pandas as pd
from django.http import JsonResponse
from rest_framework import status
from .models import IngredientUsage, Order, OrderItem, Product
from rest_framework.decorators import api_view
from rest_framework import generics
from .models import PieData, TotalSalesByMonthBar
from .serializers import PieDataSerializer, TotalSalesByMonthBarSerializer, YearTcRcRprSerializer, StoreRevenueItemSerializer, OrderDistanceSerializer, OrderDistanceAggregateSerializer, ProductSizePopularitySerializer
from rest_framework.response import Response
from .utils import (
    calculate_total_customers,
    calculate_average_order_value,
    calculate_repeat_purchase_rate,
    calculate_total_revenue,
    get_clv_vs_orders_data,
    get_ingredient_usage,
    get_monthly_rpr,
    get_price_sensitivity_data,
    get_revenue_segments,
    get_store_category_revenue,
    get_customer_locations,
    get_monthly_sales_by_category,
    get_total_sales_by_state,
    calculate_total_shops,
    calculate_total_items_sold,
    calculate_total_orders,
    PieData, 
    get_bar_data,
    get_pie_data,
    get_revenue_by_store_in_state,
    get_monthly_sales_progress,
    fetch_total_orders_by_month,
    average_order_value_Line,
    Rpr_Line,
    get_year_tc_rc_rpr_data,
    get_customer_growth,
    get_store_revenue_items,
    get_order_distances, 
    get_order_distance_aggregates,
    get_product_size_popularity
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

def customers_view(request):
    context = {} 
    return render(request, 'customers.html',context)

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



@api_view(['GET'])
def monthly_sales_by_category_view(request):
    # Get the 'year' and 'category' parameters from the query string if they exist
    year = request.query_params.get('year', None)
    category = request.query_params.get('category', None)

    # If the 'year' parameter is provided, convert it to an integer
    if year is not None:
        try:
            year = int(year)
        except ValueError:
            return Response({"error": "Invalid year parameter"}, status=400)

    # Fetch the pie data with the optional year and category parameters
    pie_data = get_monthly_sales_by_category(year=year, name=category)
    return Response(pie_data)


@api_view(['GET'])
def total_sales_by_state_view(request):
    state = request.query_params.get('state')
    data = get_total_sales_by_state(state)
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

#class PieDataListAPIView(generics.ListAPIView):
    #queryset = PieData.objects.all()
    #serializer_class = PieDataSerializer

@api_view(['GET'])
def total_sales_by_month_bar_list_view(request):
    # Get the 'year' parameter from the query string if it exists
    year = request.query_params.get('year', None)

    # If the 'year' parameter is provided, convert it to an integer
    if year is not None:
        try:
            year = int(year)
        except ValueError:
            return Response({"error": "Invalid year parameter"}, status=400)

    # Fetch the bar data with the optional year parameter
    bar_data = get_bar_data(year=year)
    return Response(bar_data)

@api_view(['GET'])
def pie_data_view(request):
   # Get the 'year' and 'month' parameters from the query string if they exist
    year = request.query_params.get('year', None)
    month = request.query_params.get('month', None)

    # If the 'year' parameter is provided, convert it to an integer
    if year is not None:
        try:
            year = int(year)
        except ValueError:
            return Response({"error": "Invalid year parameter"}, status=400)

    # Fetch the pie data with the optional year and month parameters
    pie_data = get_pie_data(year=year, month=month)
    return Response(pie_data)


#Return bar chart compare revenue
@api_view(['GET'])
def revenue_by_store_in_state_view(request):
    state = request.GET.get('state', None)
    
    data = get_revenue_by_store_in_state(state)
    return JsonResponse(data, safe=False)

#Return line chart monthly sales
@api_view(['GET'])
def monthly_sales_progress_view(request):
    data = get_monthly_sales_progress()
    return Response(data)

#Total Orders Line Chart
@api_view(['GET'])
def total_orders_by_month_view(request):
    data = fetch_total_orders_by_month()
    return Response(data)

@api_view(['GET'])
def average_order_value_Line_view(request):
    data = average_order_value_Line()
    return JsonResponse(data, safe=False)

@api_view(['GET'])
def rpr_line_chart_api(request, year):
    rpr_data = Rpr_Line(year)
    return JsonResponse(rpr_data)


def RPR_TC_RPC_view(request):
    data = get_year_tc_rc_rpr_data()
    return JsonResponse(data, safe=False)

@api_view(['GET'])
def rpr_line_chart_api(request):
    if request.method == 'GET':
        # Daten aus der Utility-Methode abrufen
        year_tc_rc_rpr_data = get_year_tc_rc_rpr_data()
        
        if year_tc_rc_rpr_data is not None:
            serializer = YearTcRcRprSerializer(year_tc_rc_rpr_data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
@api_view(['GET'])
def customer_growth_view(request, year):
    data = get_customer_growth(year)
    return JsonResponse(data)     

@api_view(['GET'])
def monthly_rpr_view(request, year):
    data = get_monthly_rpr(year)
    return JsonResponse(data, safe=False)

@api_view(['GET'])
def revenue_segments_view(request, year):
    data = get_revenue_segments(year)
    return JsonResponse(data, safe=False) 

@api_view(['GET'])
def ingredient_usage_view(request):
    data = get_ingredient_usage()
    return JsonResponse(data, safe=False)


@api_view(['GET'])
def store_category_revenue_view(request):
    data = get_store_category_revenue()
    return JsonResponse(data, safe=False)


@api_view(['GET'])
def store_revenue_items_view(request):
    items = get_store_revenue_items()
    serializer = StoreRevenueItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def order_distances_view(request):
    items = get_order_distances()
    serializer = OrderDistanceSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def order_distance_aggregates_view(request):
    items = get_order_distance_aggregates()
    serializer = OrderDistanceAggregateSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def product_size_popularity_view(request):
    items = get_product_size_popularity()
    serializer = ProductSizePopularitySerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def price_sensitivity_view(request):
    data = get_price_sensitivity_data()
    return JsonResponse(data, safe=False)

@api_view(['GET'])
def clv_vs_orders_view(request):
    data = get_clv_vs_orders_data()
    return JsonResponse(data, safe=False)