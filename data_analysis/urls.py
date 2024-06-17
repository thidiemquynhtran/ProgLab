# data_analysis/urls.py

from django.urls import path
from . import views
from .views import monthly_sales_progress_view


urlpatterns = [
    path('total-customers/', views.total_customers_view, name='total_customers'),
    path('average-order-value/', views.average_order_value_view, name='average_order_value'),
    path('repeat-purchase-rate/', views.repeat_purchase_rate_view, name='repeat_purchase_rate'),
    path('total-revenue/', views.total_revenue_view, name='total_revenue'),
    path('total-sales-by-month/', views.total_sales_by_month_view, name='total_sales_by_month'),
    path('total-sales-by-product/', views.total_sales_by_product_view, name='total_sales_by_product'),
    path('pizza-category-distribution/', views.pizza_category_distribution_view, name='pizza_category_distribution'),
    
    path('total-sales-by-state/', views.total_sales_by_state_view, name='total_sales_by_state'),
    path('total-sales-by-year/', views.total_sales_by_year_view, name='total_sales_by_year'),
    path('customer-locations/', views.customer_locations_view, name='customer_locations'),
    path('total-shops/', views.total_shops_view, name='total_shops'),
    path('total-items-sold/', views.total_items_sold_view, name='total_items_sold'),
    path('total-orders/', views.total_orders_view, name='total_orders'),

    path('pie-data/', views.pie_data_view, name='pie_data_list'),
    path('monthly-sales-by-category/', views.monthly_sales_by_category_view, name='monthly_sales_by_category'),
    path('total-sales-bar-data/', views.total_sales_by_month_bar_list_view, name='total_sales_list'),

    
    path('revenue-by-store/', views.revenue_by_store_in_state_view, name='revenue_by_store'),
    path('monthly-sales-progress/', monthly_sales_progress_view, name='monthly-sales-progress'),

    # URL to app: http://127.0.0.1:8000/data_analysis/index.html (don't delete this)
    path('data_analysis/index.html', views.index_view, name='index'),
    path('data_analysis/products.html', views.products_view, name='products'),
    path('data_analysis/stores.html', views.stores_view, name='stores'),
    path('data_analysis/customers.html', views.customers_view, name='customers'),

]


# path('dashboard/', views.dashboard, name='dashboard'),