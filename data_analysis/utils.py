# dataanylsis/utils.py

from django.db.models import Sum, F #für total sales year.p
from django.db.models.functions import TruncYear, TruncMonth  #für total sales year.p
from django.db.models import Count, Sum
from .models import Customer, Order
from .models import Order, OrderItem #from .models import Order, OrderItem, #für total sales year.p 
from django.db.models import Count #für pie

# alle Kunden
def calculate_total_customers():
    return Customer.objects.count()

#avarge sales umsatz
def calculate_average_sales_revenue():
    total_sales = Order.objects.aggregate(total_sales=Sum('total'))['total_sales']
    total_orders = Order.objects.count()
    return total_sales / total_orders if total_orders > 0 else 0

#__________________________________Sales Analysis Products, year,size>Balkendigramm

#total sales by year
def get_total_sales_by_year_with_filters(year=None, product=None):
    queryset = Order.objects.all()

    if year:
        queryset = queryset.filter(order_date__year=year)
    if product:
        queryset = queryset.filter(orderitem__product__name=product)

    return queryset.annotate(year=TruncYear('order_date')).values('year').annotate(total_sales=Sum('total')).order_by('year')


#get total sales by size
def get_total_sales_by_size_with_filters(year=None, product=None, size=None):
    queryset = Order.objects.all()

    if year:
        queryset = queryset.filter(order_date__year=year)
    if product:
        queryset = queryset.filter(orderitem__product__name=product)
    if size:
        queryset = queryset.filter(orderitem__product__size=size)

    return queryset.values('size').annotate(total_sales=Sum('total')).order_by('size')

# get total sales  by product 
def get_total_sales_by_product_with_filters(product=None):
    queryset = OrderItem.objects.all()

    if product:
        queryset = queryset.filter(product__name=product)

    return queryset.values('product__name').annotate(total_sales=Sum(F('quantity') * F('product__price'))).order_by('product__name')


    #___________pie chart Data
     
    def get_pizza_category_distribution(state=None, year=None):
    queryset = OrderItem.objects.all()

    if state:
        queryset = queryset.filter(order__store__state=state)
    if year:
        queryset = queryset.filter(order__order_date__year=year)

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

    #_________Line chart/ filter nach stat 


def get_total_sales_by_state(state=None):
    queryset = Order.objects.all()

    if state:
        queryset = queryset.filter(store__state=state)

    return queryset.annotate(year=TruncYear('order_date')).values('year').annotate(total_sales=Sum('total')).order_by('year')
