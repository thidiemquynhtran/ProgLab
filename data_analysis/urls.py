# data_analysis/urls.py

from django.urls import path
from . import views

urlpatterns = [
   
    path('total-customers/', views.total_customers_view, name='total_customers'),
    path('average-sales-revenue/', views.average_sales_revenue_view, name='average_sales_revenue'),
    path('total-sales-by-year/', views.total_sales_by_year_view, name='total_sales_by_year'),
    path('total-sales-by-size/', views.total_sales_by_size_view, name='total_sales_by_size'),
    path('total-sales-by-product/', views.total_sales_by_product_view, name='total_sales_by_product'),
    path('pizza-category-distribution/', views.pizza_category_distribution_view, name='pizza_category_distribution'),
    path('total-sales-by-state/', views.total_sales_by_state_view, name='total_sales_by_state'),
]
# path('dashboard/', views.dashboard, name='dashboard'), 