# data_analysis/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('total-customers/', views.total_customers_view, name='total_customers'),
    path('average-order-value/', views.average_order_value_view, name='average_order_value'),
    path('repeat-purchase-rate/', views.repeat_purchase_rate_view, name='repeat_purchase_rate'),
    path('total-revenue/', views.total_revenue_view, name='total_revenue'),
    path('total-sales-by-month/', views.total_sales_by_month_view, name='total_sales_by_month'),
    path('total-sales-by-size/', views.total_sales_by_size_view, name='total_sales_by_size'),
    path('total-sales-by-product/', views.total_sales_by_product_view, name='total_sales_by_product'),
    path('pizza-category-distribution/', views.pizza_category_distribution_view, name='pizza_category_distribution'),
    path('monthly-sales-by-category/', views.monthly_sales_by_category_view, name='monthly_sales_by_category'),
    path('total-sales-by-state/', views.total_sales_by_state_view, name='total_sales_by_state'),
    path('total-sales-by-year/', views.total_sales_by_year_view, name='total_sales_by_year'),


    # URL to app: http://127.0.0.1:8000/data_analysis/index.html (don't delete this)
    path('data_analysis/index.html', views.index_view, name='index'),

]


# path('dashboard/', views.dashboard, name='dashboard'), 