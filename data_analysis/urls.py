# data_analysis/urls.py

from django.urls import path
from . import views
from .views import  monthly_rpr_view, monthly_sales_progress_view, customer_growth_view, revenue_segments_view,ingredient_usage_view, store_category_revenue_view


urlpatterns = [
    path('total-customers/', views.total_customers_view, name='total_customers'),
    path('api/repeat_customers_by_year/', views.repeat_customers_by_year_view, name='repeat_customers_by_year'),
    path('average-order-value/', views.average_order_value_view, name='average_order_value'),
    path('repeat-purchase-rate/', views.repeat_purchase_rate_view, name='repeat_purchase_rate'),
    path('total-revenue/', views.total_revenue_view, name='total_revenue'),
    path('total-sales-by-month/', views.total_sales_by_month_view, name='total_sales_by_month'),
    path('total-sales-by-product/', views.total_sales_by_product_view, name='total_sales_by_product'),
    path('pizza-category-distribution/', views.pizza_category_distribution_view, name='pizza_category_distribution'),
    path('year-tc-rc-rpr/', views.rpr_line_chart_api, name='year_tc_rc_rpr_list'),
    
    path('total-sales-by-state/', views.total_sales_by_state_view, name='total_sales_by_state'),
    path('total-sales-by-year/', views.total_sales_by_year_view, name='total_sales_by_year'),
    path('customer-locations/', views.customer_locations_view, name='customer_locations'),
    path('total-shops/', views.total_shops_view, name='total_shops'),
    path('total-items-sold/', views.total_items_sold_view, name='total_items_sold'),
    path('total-orders/', views.total_orders_view, name='total_orders'),

    path('pie-data/', views.pie_data_view, name='pie_data_list'),
    path('monthly-sales-by-category/', views.monthly_sales_by_category_view, name='monthly_sales_by_category'),
    path('total-sales-bar-data/', views.total_sales_by_month_bar_list_view, name='total_sales_list'),
    path('store_revenue_items/', views.store_revenue_items_view, name='store_revenue_items'), #scatterplot stores
    path('order_distance_aggregates/', views.order_distance_aggregates_view, name='order_distance_aggregates'), #order distance
    path('product_size_popularity/', views.product_size_popularity_view, name='product_size_popularity'), #size popularity
   
    path('revenue-by-store/', views.revenue_by_store_in_state_view, name='revenue_by_store'),
    path('monthly-sales-progress/', monthly_sales_progress_view, name='monthly-sales-progress'),
    #path('api/totalOrders/Line', views.total_orders_view, name='totalOrders-Line'),
    path('api/average_order_value_Line/', views.average_order_value_Line_view, name='average_order_value_Line'),
    path('rpr/<int:year>/', views.rpr_line_chart_api, name='rpr_line_chart_api'),
    path('api/rpr_tc_rcp/', views.RPR_TC_RPC_view, name='RPR_TC_RPC_view'),
    path('api/customers_and_repeat_customers/', views.customers_and_repeat_customers_view, name='customers_and_repeat_customers'),


   # URL to app: http://127.0.0.1:8000/data_analysis/index.html (don't delete this)
    path('data_analysis/index.html', views.index_view, name='index'),
    path('data_analysis/products.html', views.products_view, name='products'),
    path('data_analysis/stores.html', views.stores_view, name='stores'),
    path('data_analysis/customers.html', views.customers_view, name='customers'),
    path('customer-growth/<int:year>/', customer_growth_view, name='customer_growth'),
    path('monthly-rpr/<int:year>/', monthly_rpr_view, name='monthly_rpr'),
    path('revenue-segments/<int:year>/', revenue_segments_view, name='revenue_segments'),
    path('ingredient-usage/', ingredient_usage_view, name='ingredient_usage'),
    path('store-category-revenue/', store_category_revenue_view, name='store_category_revenue'),



]


# path('dashboard/', views.dashboard, name='dashboard'),