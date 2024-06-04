# dataanylsis/utils.py

from django.db.models import Sum, F #für total sales year.p
from django.db.models.functions import TruncYear, TruncMonth  #für total sales year.p
from django.db.models import Count, Sum
from .models import Customer, Order, Store
from .models import Order, OrderItem #from .models import Order, OrderItem, #für total sales year.p 
from django.db.models import Count #für pie
from datetime import datetime
from django.db.models.functions import ExtractMonth, ExtractYear, Substr, Cast
from collections import defaultdict
from decimal import Decimal
import pandas as pd
from django.shortcuts import render
from django.db.models import DecimalField, ExpressionWrapper, DateTimeField
from django.http import JsonResponse
from datetime import datetime

#key metrics ----------

# alle Kunden
def calculate_total_customers():
    return Customer.objects.count()

#avarge order von Kunde
def calculate_average_order_value():
    total_sales = Order.objects.aggregate(total_sales=Sum('total'))['total_sales']
    total_orders = Order.objects.count()
    return total_sales / total_orders if total_orders > 0 else 0

#repeat purchase rate

def calculate_repeat_purchase_rate():
    # Anzahl der Kunden mit mehr als einer Bestellung
    repeat_customers = Order.objects.values('customerID').annotate(num_orders=Count('orderID')).filter(num_orders__gt=1).count()
    
    # Gesamtanzahl der Kunden
    total_customers = Order.objects.values('customerID').distinct().count()
    
    # Berechne die Repeat Purchase Rate
    repeat_purchase_rate = (repeat_customers / total_customers) * 100 if total_customers > 0 else 0
    
    return repeat_purchase_rate

#gesamtumsatz keymetric
def calculate_total_revenue():
    # Gesamtumsatz
    total_revenue = Order.objects.aggregate(total_revenue=Sum('total'))['total_revenue'] or 0
    
    return total_revenue

#----------

#----------Balkendigramm


#sales nach month
def get_total_sales_by_month_with_filters(year=None):
    # Filter the orders queryset by year if provided
    orders_qs = Order.objects.all()
    
    # Cast orderdate to DateTimeField
    orders_qs = orders_qs.annotate(order_date_dt=Cast('orderdate', DateTimeField()))

    if year:
        orders_qs = orders_qs.filter(order_date_dt__year=year)
    
    # Calculate total sales for each order
    orders_qs = orders_qs.annotate(
        total_sales=Coalesce(
            Sum(
                ExpressionWrapper(
                    F('orderitem__orderid__nitems') * F('orderitem__sku__price'),
                    output_field=DecimalField()
                )
            ),
            Value(0),
            output_field=DecimalField()
        )
    )
    
    # Annotate month and year
    orders_qs = orders_qs.annotate(
        month=ExtractMonth('order_date_dt'),
        year=ExtractYear('order_date_dt')
    )
    
    # Aggregate total sales by month and year
    monthly_sales = (
        orders_qs
        .values('year', 'month')
        .annotate(total_sales=Sum('total_sales'))
        .order_by('year', 'month')
    )

    # Format the data into the desired format with separate year and month fields
    sales_data = [
        {
            'year': month["year"],
            'month': f'{month["month"]:02}',
            'total_sales': str(month["total_sales"])
        }
        for month in monthly_sales
    ]

    return sales_data

    #sales nach year ----------------------------------API fehlt
def get_total_sales_by_year_with_filters():
    queryset = Order.objects.all()

    # Initialisieren Sie eine Struktur zum Halten der aggregierten Daten
    yearly_sales = defaultdict(Decimal)

    # Iterieren Sie über das Queryset und extrahieren Sie Jahr und Umsatz
    for order in queryset:
        try:
            order_date = datetime.strptime(order.orderdate, "%Y-%m-%d")
            # Addieren Sie den Umsatz zum entsprechenden Jahr
            yearly_sales[order_date.year] += order.total
        except ValueError:
            continue

    # Format the data into the desired format with separate year and total sales fields
    sales_data = [
        {
            'year': year,
            'total_sales': str(total)
        }
        for year, total in sorted(yearly_sales.items())
    ]

    return sales_data

    
#get total sales by size balken (aktuell nur jahr filter in balken)
def get_total_sales_by_size_with_filters(year=None, product=None, size=None):
    queryset = Order.objects.all()

    if year:
        queryset = queryset.filter(orderdate__year=year)
    if product:
        queryset = queryset.filter(orderitem__product__name=product)
    if size:
        queryset = queryset.filter(orderitem__product__size=size)

    return queryset.values('size').annotate(total_sales=Sum('total')).order_by('size')


def get_total_sales_by_product_with_filters(orders_df, items_df, products_df):
    # Join orders_df und items_df
    order_items_df = pd.merge(orders_df, items_df, on='orderid')

    # Join order_items_df und products_df
    order_items_products_df = pd.merge(order_items_df, products_df, on='sku')

    # Berechne den Umsatz pro Bestellung
    order_items_products_df['Revenue'] = order_items_products_df['total'] * order_items_products_df['price']

    # Extrahiere Jahr und Monat, unter Beachtung gemischter Datumsformate
    order_items_products_df['orderdate'] = pd.to_datetime(order_items_products_df['orderdate'], errors='coerce')

    # Entferne Zeilen mit ungültigen Datumswerten
    order_items_products_df = order_items_products_df.dropna(subset=['orderdate'])

    # Extrahiere Jahr und Monat
    order_items_products_df['Year'] = order_items_products_df['orderdate'].dt.year
    order_items_products_df['Month'] = order_items_products_df['orderdate'].dt.month_name()

    # Definiere die Reihenfolge der Monate
    month_order = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
    order_items_products_df['Month'] = pd.Categorical(order_items_products_df['Month'], categories=month_order, ordered=True)

    # Grupiere nach Jahr und Monat und summiere den Umsatz
    result_df = order_items_products_df.groupby(['Year', 'Month'])['Revenue'].sum().reset_index(name='Revenue')

    # Sortiere das Ergebnis nach Jahr und Monat
    result_df = result_df.sort_values(by=['Year', 'Month'])

    # Konvertiere das DataFrame in das gewünschte Format
    result_dict = result_df.to_dict(orient='records')

    return result_dict

#--------------------------------------------------------------------------------

    #___________pie chart Data
    
def get_pizza_category_distribution(orders_df, items_df, products_df, year=None, month=None):
    # Join orders_df und items_df
    order_items_df = pd.merge(orders_df, items_df, on='orderid')

    # Füge die Preise aus products_df hinzu
    order_items_df = pd.merge(order_items_df, products_df[['sku', 'price']], on='sku', how='left')

    # Füge die Spalte "name" aus products_df hinzu
    order_items_df = pd.merge(order_items_df, products_df[['sku', 'name']], on='sku', how='left')

    # Berechne den Umsatz pro Produkt
    order_items_df['Revenue'] = order_items_df['nitems'] * order_items_df['price']

    # Extrahiere Jahr und Monat, unter Beachtung gemischter Datumsformate
    order_items_df['orderdate'] = pd.to_datetime(order_items_df['orderdate'], errors='coerce')

    # Entferne Zeilen mit ungültigen Datumswerten
    order_items_df = order_items_df.dropna(subset=['orderdate'])

    # Extrahiere Jahr und Monat
    order_items_products_df['year'] = order_items_products_df['orderdate'].dt.year
    order_items_products_df['month'] = order_items_products_df['orderdate'].dt.month_name()

    # Filter nach Jahr und Monat, falls angegeben
    if year:
        order_items_products_df = order_items_products_df[order_items_products_df['year'] == int(year)]
    if month:
        order_items_products_df = order_items_products_df[order_items_products_df['month'] == month]

    # Gruppiere nach Jahr, Monat und Pizza-Name und summiere den Umsatz
    result_df = order_items_products_df.groupby(['year', 'month', 'name'])['Revenue'].sum().reset_index(name='Revenue')

    # Konvertiere das DataFrame in das gewünschte Format
    result_dict = result_df.to_dict(orient='records')

    return result_dict


#neu: für Interaktivität/Funktion zur Aggregation der monatlichen Verkäufe nach Kategorie
def get_monthly_sales_by_category(category):
    queryset = Order.objects.filter(orderitem__product__name=category)
    return queryset.annotate(month=TruncMonth('order_date')).values('month').annotate(total_sales=Sum('total')).order_by('month')

    
    #_________Line chart/ filter nach stat 


def get_total_sales_by_state(state=None):
    queryset = Order.objects.all() #order objekte aus DB abrufen

    if state:
        queryset = queryset.filter(store__state=state) # BS geg BSt filtern

    return queryset.annotate(year=TruncYear('order_date')).values('year').annotate(total_sales=Sum('total')).order_by('year') #Bst nach jahr + SUm Verkauf jahr

#line Chart Data

def get_line_chart_data():
   #still not done
   # Query the database using Django's ORM
    queryset = Order.objects.all()

    # Extract required data fields and format into the desired JSON structure
    formatted_results = [
        {
            "timestamp": item.orderdate[:10],  # Extract the date part from the datetime field
            "value": float(item.total)  # Convert total to float for JSON compatibility
        }
        for item in queryset
    ]

    # Return the JSON response
    return JsonResponse(formatted_results, safe=False)

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