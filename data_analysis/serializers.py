# data_analysis/serializers.py
from rest_framework import serializers
from .models import Customer, Product, Store, Order, OrderItem, PieData, TotalSalesByMonthBar, YearTcRcRpr

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class PieDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = PieData
        fields = '__all__'

class TotalSalesByMonthBarSerializer(serializers.ModelSerializer):
    class Meta:
        model = TotalSalesByMonthBar
        exclude = ['id']  # Die id-Spalte ausschließe


class YearTcRcRprSerializer(serializers.ModelSerializer):
    class Meta:
        model = YearTcRcRpr
        fields = ('year', 'total_customers', 'repeat_customers', 'repeat_purchase_rate')
