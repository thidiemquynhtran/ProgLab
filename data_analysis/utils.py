# dataanylsis/utils.py

from django.db.models import Sum, F #für total sales year.p
from django.db.models.functions import TruncYear, TruncMonth  #für total sales year.p
from django.db.models import Count, Sum
from .models import Customer, Order
from .models import Order, OrderItem #from .models import Order, OrderItem, #für total sales year.p 
from django.db.models import Count #für pie
from datetime import datetime
from django.db.models.functions import ExtractMonth, ExtractYear
from collections import defaultdict
from decimal import Decimal


#key metrics 

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


#__________________________________Sales Analysis Products, year,size>Balkendigramm

#total sales by year
def get_total_sales_by_month_with_filters(year=None):
    queryset = Order.objects.all()
    
    # Initialisieren Sie eine Struktur zum Halten der aggregierten Daten
    monthly_sales = defaultdict(Decimal)

    # Iterieren Sie über das Queryset und extrahieren Sie Datum und Umsatz
    for order in queryset:
        try:
            order_date = datetime.strptime(order.orderdate, "%Y-%m-%dT%H:%M:%SZ")
            if year and order_date.year != int(year):
                continue
            month_start = order_date.replace(day=1)
            monthly_sales[month_start] += Decimal(order.total)
        except ValueError:
            continue

    # Formatieren Sie die Daten in das gewünschte Format
    sales_data = [
        {'month': month, 'total_sales': total}
        for month, total in sorted(monthly_sales.items())
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

# get total sales  by product balken (aktuell nur jahr filter in balken)
def get_total_sales_by_product_with_filters(product=None):
    queryset = OrderItem.objects.all()

    if product:
        queryset = queryset.filter(product__name=product)

    return queryset.values('product__name').annotate(total_sales=Sum(F('quantity') * F('product__price'))).order_by('product__name')


    #___________pie chart Data
     
def get_pizza_category_distribution():
    queryset = OrderItem.objects.all()

    # Anzahl der verkauften Pizzen pro Kategorie
    pizza_category_counts = queryset.values('product__category').annotate(total_sales=Count('id'))

    # Gesamtanzahl der verkauften Pizzen
    total_pizza_sales = queryset.count()

    # Berechnung des prozentualen Anteils jeder Kategorie
    pizza_category_distribution = []
    for entry in pizza_category_counts:
        category = entry['product__category']
        count = entry['total_sales']
        percentage = (count / total_pizza_sales) * 100
        pizza_category_distribution.append({'category': category, 'percentage': percentage})

    return pizza_category_distribution

    #In dieser Funktion werden zunächst die Bestellungen 
    #gefiltert basierend auf den angegebenen Filtern für Bundesstaat und Jahr. Dann werden die verkauften Pizzen nach Kategorien gruppiert und gezählt. Anschließend wird der 
    #prozentuale Anteil jeder Kategorie an der Gesamtanzahl der verkauften Pizzen berechnet und als Liste von Dictionaries zurückgegeben, wobei jeder 
    #Dictionary die Kategorie und den prozentualen Anteil enthält.


#neu: für Interaktivität/Funktion zur Aggregation der monatlichen Verkäufe nach Kategorie
def get_monthly_sales_by_category(category):
    queryset = Order.objects.filter(orderitem__product__category=category)
    return queryset.annotate(month=TruncMonth('order_date')).values('month').annotate(total_sales=Sum('total')).order_by('month')

    
    #_________Line chart/ filter nach stat 


def get_total_sales_by_state(state=None):
    queryset = Order.objects.all() #order objekte aus DB abrufen

    if state:
        queryset = queryset.filter(store__state=state) # BS geg BSt filtern

    return queryset.annotate(year=TruncYear('order_date')).values('year').annotate(total_sales=Sum('total')).order_by('year') #Bst nach jahr + SUm Verkauf jahr
