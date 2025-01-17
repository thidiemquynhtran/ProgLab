from django.contrib import admin
from .models import Product
# Register your models here.

class ProductAdmin(admin.ModelAdmin):
    list_display = ['sku','name','price','category','size']

admin.site.register(Product, ProductAdmin)