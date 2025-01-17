# dataanylsis/utils.py

import calendar
from django.db.models import Sum, F #für total sales year.p
from django.db.models.functions import TruncYear, TruncMonth  #für total sales year.p
from django.db.models import Count, Sum, Func, F, Q, Subquery
from .models import ClvVsOrders, Customer, IngredientUsage, MonthlyRPR, Order, PriceSensitivity, RevenueSegment, Store, StoreCategoryRevenue
from .models import Order, OrderItem #from .models import Order, OrderItem, #für total sales year.p 
from django.db.models import Count #für pie
from datetime import datetime
from django.db.models.functions import ExtractMonth, ExtractYear, Substr, Cast
from collections import defaultdict
from decimal import Decimal, ROUND_HALF_UP
import pandas as pd
from django.shortcuts import render
from django.db.models import DecimalField, ExpressionWrapper, DateTimeField
from django.http import JsonResponse
from datetime import datetime
from .models import PieData, TotalSalesByMonthBar, YearTcRcRpr,StoreRevenueItem, OrderDistance, OrderDistanceAggregate, ProductSizePopularity

#key metrics ----------

# Keymetric: alle Kunden
def calculate_total_customers():
    return Customer.objects.count()

#Keymetric: avarge order von Kunde
def calculate_average_order_value():
    total_sales = Order.objects.aggregate(total_sales=Sum('total'))['total_sales']
    total_orders = Order.objects.count()
    return total_sales / total_orders if total_orders > 0 else 0
#chart
def average_order_value_Line():
    # Aggregate total sales and order counts by year and month
    orders_by_month = Order.objects.annotate(
        year=ExtractYear('orderdate'),
        month=ExtractMonth('orderdate')
    ).values('year', 'month').annotate(
        total_sales=Sum('total'),
        total_orders=Count('orderid')
    ).order_by('year', 'month')
    # Calculate average order value and convert month numbers to month names
    results = []
    for order in orders_by_month:
        total_sales = order['total_sales'] or 0
        total_orders = order['total_orders'] or 0
        average_order_value = Decimal(total_sales) / total_orders if total_orders > 0 else Decimal(0)
        # Round to two decimal places
        average_order_value = average_order_value.quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)
        results.append({
            'year': order['year'],
            'month': calendar.month_name[order['month']],
            'average_order_value': float(average_order_value)
        })

    return results

#Keymetric: repeat purchase rate
def calculate_repeat_purchase_rate():
    # Anzahl der Kunden mit mehr als einer Bestellung
    repeat_customers = Order.objects.values('customerid').annotate(num_orders=Count('orderid')).filter(num_orders__gt=1).count()
    # Gesamtanzahl der Kunden
    total_customers = Order.objects.values('customerid').distinct().count()
    # Berechne die Repeat Purchase Rate
    repeat_purchase_rate = (repeat_customers / total_customers) * 100 if total_customers > 0 else 0
    return repeat_purchase_rate
#chart
def Rpr_Line(year):
    # Ein leeres Standarddict zum Speichern der RPR für jeden Monat
    # Get all unique months from the Orders table
    months = Order.objects.annotate(month=TruncMonth('orderdate')).values_list('month', flat=True).distinct()

    for month in months:
        # Get all customers who made a purchase in this month
        customers_in_month = Order.objects.filter(orderdate__month=month.month, orderdate__year=month.year).values_list('customerid', flat=True).distinct()
    
        # Get all customers who made a repeat purchase in this month
        repeat_customers_in_month = Order.objects.filter(orderdate__month=month.month, orderdate__year=month.year).values_list('customerid', flat=True).annotate(num_orders=Count('customerid')).filter(num_orders__gt=1).distinct()
    
        # Calculate the repeat purchase rate for this month
        repeat_purchase_rate = (len(repeat_customers_in_month) / len(customers_in_month)) * 100
    
    print(f'Month: {month}, Repeat Purchase Rate: {repeat_purchase_rate:.2f}%')

#Keymetric: gesamtumsatz keymetric
def calculate_total_revenue():
    # Gesamtumsatz
    total_revenue = Order.objects.aggregate(total_revenue=Sum('total'))['total_revenue'] or 0
    return total_revenue

 #Keymetric: Total Number of Shops --> Shops page 
def calculate_total_shops():
    total_shops = Store.objects.count()
    return total_shops

 #Keymetric: Total Items Sold --> Products page
def calculate_total_items_sold():
     total_items_sold= OrderItem.objects.aggregate(total_items=Sum('quantity'))['total_items'] or 0
     return total_items_sold

 #Keymetric: Total Number of Orders --> Homepage
def calculate_total_orders():
     total_orders = Order.objects.count()
     return total_orders
#chart
def fetch_total_orders_by_month():
    # Annotate the orders by extracting the year and month from the order_date
    orders_by_month = Order.objects.annotate(
        year=ExtractYear('orderdate'),
        month=ExtractMonth('orderdate')
    ).values('year', 'month').annotate(
        total_orders=Count('orderid')
    ).order_by('year', 'month')
    # Convert month numbers to month names using the calendar module
    results = []
    for order in orders_by_month:
        order['month'] = calendar.month_name[order['month']]
        results.append(order)
    return results


def get_total_sales_by_state(state=None):
    queryset = Order.objects.all() #order objekte aus DB abrufen

    if state:
        queryset = queryset.filter(store__state=state) # BS geg BSt filtern

    return queryset.annotate(year=TruncYear('order_date')).values('year').annotate(total_sales=Sum('total')).order_by('year') #Bst nach jahr + SUm Verkauf jahr

# heatmapdata:
def get_customer_locations():
    customers = Customer.objects.values('latitude', 'longitude')
    return list(customers)

# Pie Data
def get_pie_data(year=None, month=None):
    # Build the filter criteria based on the provided parameters
    filter_criteria = {}
    if year:
        filter_criteria['year'] = year
    if month:
        month_mapping = {
            'January': 1,
            'February': 2,
            'March': 3,
            'April': 4,
            'May': 5,
            'June': 6,
            'July': 7,
            'August': 8,
            'September': 9,
            'October': 10,
            'November': 11,
            'December': 12,
        }
        month_int = month_mapping.get(month)
        if month_int is not None:
            filter_criteria['month'] = month_int

    # Filter the data based on the provided criteria
    if filter_criteria:
        pie_data = PieData.objects.filter(**filter_criteria).values('name', 'year', 'month', 'revenue')
    else:
        pie_data = PieData.objects.all().values('name', 'year', 'month', 'revenue')

    # Convert month to name format
    month_mapping_reverse = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December',
    }

    for item in pie_data:
        item['month'] = month_mapping_reverse.get(item['month'], '')
    return pie_data

def get_monthly_sales_by_category(year=None, name=None):
    # Build the filter criteria based on the provided parameters
    filter_criteria = {}
    if year:
        filter_criteria['year'] = year
    if name:
        filter_criteria['name'] = name

    if filter_criteria:
        pie_data = PieData.objects.filter(**filter_criteria).values('name', 'year', 'month', 'revenue')
    else:
        pie_data = PieData.objects.all().values('name', 'year', 'month', 'revenue')

    # Filter the data based on the provided criteria
   # pie_data = PieData.objects.filter(**filter_criteria).values('name', 'year', 'month', 'revenue')

    # Convert month number to month name
    month_mapping_reverse = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December',
    }

    # Update month number to month name
    for item in pie_data:
        item['month'] = month_mapping_reverse.get(item['month'], '')

    return pie_data


# Bar Data
def get_bar_data(year=None):
    # Filter the data based on the provided year if it is given
    if year:
        bar_data = TotalSalesByMonthBar.objects.filter(year=year).values('year', 'month', 'revenue')
    else:
        bar_data = TotalSalesByMonthBar.objects.all().values('year', 'month', 'revenue')

    # Konvertiere den Monat in Namenformat
    month_mapping = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December',
    }

    for item in bar_data:
        item['month'] = month_mapping.get(item['month'], '')

    return bar_data

#Bar Chart : compare Revenue among stores(under maps)
def get_revenue_by_store_in_state(state=None):
    # Query to get all stores, optionally filtering by state
    if state:
        stores = Store.objects.filter(state=state).values(
            'storeid', 'zipcode', 'state', 'city', 'latitude', 'longitude'
        )
    else:
        stores = Store.objects.all().values(
            'storeid', 'zipcode', 'state', 'city', 'latitude', 'longitude'
        )

    # Convert stores queryset to a dictionary for easier manipulation
    store_revenues = {store['storeid']: {**store, 'revenue': 0} for store in stores}

    # Query to get all orders, optionally filtering by state
    if state:
        orders = Order.objects.filter(storeid__state=state).values('storeid').annotate(total_revenue=Sum('total'))
    else:
        orders = Order.objects.all().values('storeid').annotate(total_revenue=Sum('total'))

    # Calculate revenue by store
    for order in orders:
        storeid = order['storeid']
        total_revenue = order['total_revenue']
        if storeid in store_revenues:
            store_revenues[storeid]['revenue'] = total_revenue

    return list(store_revenues.values())


#Line chart: total sales for the three years 
def get_monthly_sales_progress():
    # Cast 'orderdate' to DateTimeField before extracting month and year
    sales_data = (
        Order.objects.annotate(
            orderdate_dt=Cast('orderdate', output_field=DateTimeField())
        ).annotate(
            year=ExtractYear('orderdate_dt'),
            month=ExtractMonth('orderdate_dt')
        ).values('year', 'month')
        .annotate(total_sales=Sum('total'))
        .filter(year__in=[2020, 2021, 2022])
        .order_by('year', 'month')
    )
    
    result = {'2020': [], '2021': [], '2022': []}
    for data in sales_data:
        month_name = calendar.month_name[data['month']]
        year = str(data['year'])
        result[year].append({
            'month': month_name,
            'total_sales': float(data['total_sales'])
        })
    
    return result

    #data zu repeatcustomer, totla customer, rpr

def get_year_tc_rc_rpr_data():
    try:
        # Daten aus der Tabelle YearTcRcRpr abrufen
        year_tc_rc_rpr_data = YearTcRcRpr.objects.all()
        return year_tc_rc_rpr_data
    except YearTcRcRpr.DoesNotExist:
        return None

#Line chart growth of total customers    
def get_customer_growth(year):
    # Filter orders by the specified year
    monthly_orders = Order.objects.filter(orderdate__year=year).annotate(month=TruncMonth('orderdate'))
    
    # Count distinct customers per month
    customer_counts = monthly_orders.values('month').annotate(total_customers=Count('customerid', distinct=True))

    # Map month numbers to names
    month_names = ["January", "February", "March", "April", "May", "June", 
                   "July", "August", "September", "October", "November", "December"]
    
    # Organize the data by year and month
    growth_data = []
    for entry in customer_counts:
        month = month_names[entry['month'].month - 1]  # Convert month number to name
        total_customers = entry['total_customers']
        growth_data.append({
            'month': month,
            'total_customers': total_customers
        })

    # Ensure all months are represented
    full_data = [{'month': month, 'total_customers': 0} for month in month_names]
    for data in growth_data:
        for month_data in full_data:
            if month_data['month'] == data['month']:
                month_data['total_customers'] = data['total_customers']
    
    return {
        'year': year,
        'data': full_data
    }

#column chart monthly repeat purchse rate
def get_monthly_rpr(year):
    # Query the database for monthly repeat purchase rate data for the specified year
    data = MonthlyRPR.objects.filter(year=year).values(
        'month', 'total_customers', 'repeat_customers', 'repeat_purchase_rate'
    ).order_by('month')
    
    # Map month numbers to names
    month_names = ["January", "February", "March", "April", "May", "June", 
                   "July", "August", "September", "October", "November", "December"]
    
    # Convert month numbers to names
    monthly_rpr_data = []
    for entry in data:
        month = month_names[entry['month'] - 1]  # Convert month number to name
        monthly_rpr_data.append({
            'month': month,
            'total_customers': entry['total_customers'],
            'repeat_customers': entry['repeat_customers'],
            'repeat_purchase_rate': entry['repeat_purchase_rate']
        })
    
    return monthly_rpr_data


#pie chart top customers
def get_revenue_segments(year):
    data = RevenueSegment.objects.filter(year=year).values(
        'segment', 'segment_revenue'
    )
    
    # Prepare the output format
    formatted_data = [
        {
            'segment': entry['segment'],
            'segment_revenue': float(entry['segment_revenue'])
        }
        for entry in data
    ]

    return formatted_data

#bar chart ingredients usage
def get_ingredient_usage():
    data = IngredientUsage.objects.values(
        'ingredient', 'usage_count', 'usage_percentage'
    ).order_by('-usage_percentage')
    
    return list(data)

#Heatmap StoreCategoryRevenue
def get_store_category_revenue():
    data = StoreCategoryRevenue.objects.values(
        'store_id', 'category', 'revenue'
    ).order_by('store_id', 'category')
    
    return list(data)

    #stores scatterplot
def get_store_revenue_items():
    return StoreRevenueItem.objects.all()

#bis table for distance aggr
def get_order_distances():
    return OrderDistance.objects.all()

#distance tabelle
def get_order_distance_aggregates():
    return OrderDistanceAggregate.objects.all()

def get_product_size_popularity():
    return ProductSizePopularity.objects.all()

# Fetch price sensitivity data
def get_price_sensitivity_data():
    data = PriceSensitivity.objects.all().values('price', 'total_sales')
    result = list(data)
    return result

# Fetch CLV vs. number of orders data
def get_clv_vs_orders_data():
    data = ClvVsOrders.objects.all().values('customerid', 'total_orders', 'clv')
    result = list(data)
    return result