# data_analysis/views.py

<<<<<<< HEAD
# Create your views here.
# request -> response
# request handler

from rest_framework import viewsets
from .models import Customer, Product, Store, Order, OrderItem
from .serializers import CustomerSerializer, ProductSerializer, StoreSerializer, OrderSerializer, OrderItemSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer


=======
from django.shortcuts import render
from .utils import calculate_total_customers, calculate_average_sales_revenue

def dashboard(request):
    total_customers = calculate_total_customers()
    average_sales_revenue = calculate_average_sales_revenue()
    return render(request, 'dashboard.html', {
        'total_customers': total_customers,
        'average_sales_revenue': average_sales_revenue,
    })
>>>>>>> 442475b5a08f63a4be1ad45c01b3c5d1bdef9141
