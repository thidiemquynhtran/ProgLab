# dataanylsis/utils.py

from django.db.models import Sum, F #für total sales year.p
from django.db.models.functions import TruncYear, TruncMonth  #für total sales year.p
from django.db.models import Count, Sum
from .models import Customer, Order
from .models import Order, OrderItem #from .models import Order, OrderItem, #für total sales year.p 
from django.db.models import Count #für pie
from datetime import datetime
from django.db.models.functions import ExtractMonth, ExtractYear, Substr
from collections import defaultdict
from decimal import Decimal
import pandas as pd
from django.shortcuts import render


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
    queryset = Order.objects.all()
    
    # Initialisieren Sie eine Struktur zum Halten der aggregierten Daten
    monthly_sales = defaultdict(Decimal)

    # Iterieren Sie über das Queryset und extrahieren Sie Datum und Umsatz
    for order in queryset:
        try:
            order_date = datetime.strptime(order.orderdate.split('T')[0], "%Y-%m-%d")
            if year and order_date.year != int(year):
                continue
            # Setzen Sie das Datum auf den ersten Tag des Monats
            month_start = order_date.replace(day=1)
            monthly_sales[month_start] += order.total
        except ValueError:
            continue

   # Format the data into the desired format with separate year and month fields
    sales_data = [
        {
            'year': month.year,
            'month': month.strftime("%m"),
            'total_sales': str(total)
        }
        for month, total in sorted(monthly_sales.items())
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
    
def get_pizza_category_distribution(orders_df, items_df, products_df):
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

    # Definiere die Reihenfolge der Monate manuell
    month_order = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
    order_items_products_df['Month'] = pd.Categorical(
        order_items_products_df['Month'], categories=month_order, ordered=True
    )

    # Gruppiere nach Jahr und Monat und summiere den Umsatz
    result_df = order_items_products_df.groupby(['Year', 'Month'])['Revenue'].sum().reset_index(name='Revenue')

    # Berechne den Gesamtumsatz
    total_revenue = result_df['Revenue'].sum()

    # Berechne den Anteil jedes Monats am Gesamtumsatz
    result_df['RevenuePercentage'] = (result_df['Revenue'] / total_revenue) * 100

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
