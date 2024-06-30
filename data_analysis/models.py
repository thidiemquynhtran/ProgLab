from django.db import models

# Create your models here.

class Customer(models.Model):
    customerid = models.CharField(db_column='customerID', primary_key=True, max_length=7)  # Field name made lowercase.
    latitude = models.CharField(max_length=18, blank=True, null=True)
    longitude = models.CharField(max_length=19, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'customers'
        

class Product(models.Model):
    sku = models.CharField(db_column='SKU', primary_key=True, max_length=5)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=21, blank=True, null=True)  # Field name made lowercase.
    price = models.DecimalField(db_column='Price', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    category = models.CharField(db_column='Category', max_length=10, blank=True, null=True)  # Field name made lowercase.
    size = models.CharField(db_column='Size', max_length=11, blank=True, null=True)  # Field name made lowercase.
    ingredients = models.CharField(db_column='Ingredients', max_length=65, blank=True, null=True)  # Field name made lowercase.
    launch = models.CharField(db_column='Launch', max_length=11, blank=True, null=True) # Field name made lowercase.


    class Meta:
        managed = True
        db_table = 'products'
    def __str__(self):
        return self.name

class Store(models.Model):
    storeid = models.CharField(db_column='storeID', primary_key=True, max_length=7)  # Field name made lowercase.
    zipcode = models.IntegerField(db_column='zipcode', blank=True, null=True)
    state_abbr = models.CharField(db_column='state_abbr',max_length=2, blank=True, null=True)
    latitude = models.DecimalField(db_column='latitude',max_digits=8, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(db_column='longitude',max_digits=9, decimal_places=5, blank=True, null=True)
    city = models.CharField(db_column='city',max_length=15, blank=True, null=True)
    state = models.CharField(db_column='state',max_length=10, blank=True, null=True)
    distance = models.CharField(db_column='distance',max_length=18, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'stores'

class Order(models.Model):
    orderid = models.IntegerField(db_column='orderID', primary_key=True)  # Field name made lowercase.
    customerid = models.ForeignKey(Customer, on_delete=models.SET_NULL, db_column='customerID', blank=True, null=True)  # Field name made lowercase.
    storeid = models.ForeignKey(Store, on_delete=models.SET_NULL, db_column='storeID', blank=True, null=True)  # Field name made lowercase.
    orderdate = models.DateField(db_column='orderDate', blank=True, null=True) 
    #orderdate = models.CharField(db_column='orderDate', max_length=20, blank=True, null=True)  # Field name made lowercase.
    nitems = models.IntegerField(db_column='nItems', blank=True, null=True)  # Field name made lowercase.
    total = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
 
    class Meta:
        managed = True
        db_table = 'orders'

class OrderItem(models.Model):
    orderid = models.ForeignKey(Order, db_column='orderID', on_delete=models.CASCADE)
    sku = models.ForeignKey(Product, db_column='SKU', on_delete=models.CASCADE)
    
    class Meta:
        managed = True
        db_table = 'orderItems'
        unique_together = (('orderid', 'sku'),)

#pie chart
class PieData(models.Model):
    id = models.BigAutoField(primary_key=True) 
    name = models.CharField(max_length=255)
    year = models.IntegerField()
    month = models.IntegerField()
    revenue = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'PieData'  # Name der bereits existierenden Tabelle

    def __str__(self):
        return f"{self.name} - {self.year}/{self.month}: {self.revenue}"

#bar chart
class TotalSalesByMonthBar(models.Model):
    id = models.BigAutoField(primary_key=True) 
    year = models.IntegerField()
    month = models.IntegerField()
    revenue = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'TotalSalesByMonthBar'
        verbose_name = 'Total Sales By Month Bar'
        verbose_name_plural = 'Total Sales By Month Bars'

    def __str__(self):
        return f'{self.year}-{self.month}: {self.revenue}'

    
class YearTcRcRpr(models.Model):
    id = models.BigAutoField(primary_key=True)
    year = models.IntegerField()
    total_customers = models.IntegerField()
    repeat_customers = models.IntegerField()
    repeat_purchase_rate = models.DecimalField(decimal_places=2, max_digits=10)

    class Meta:
        db_table = 'yearTcRcRpr'


class MonthlyRPR(models.Model):
    year = models.IntegerField()
    month = models.IntegerField()
    total_customers = models.IntegerField()
    repeat_customers = models.IntegerField()
    repeat_purchase_rate = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        db_table = 'monthly_rpr'
        verbose_name = 'Monthly RPR'
        verbose_name_plural = 'Monthly RPRs'


class RevenueSegment(models.Model):
    year = models.IntegerField()
    segment = models.CharField(max_length=10)
    segment_revenue = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'revenue_segments'
        verbose_name = 'Revenue Segment'
        verbose_name_plural = 'Revenue Segments'   

class IngredientUsage(models.Model):
    ingredient = models.CharField(max_length=255)
    usage_count = models.IntegerField()
    usage_percentage = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        db_table = 'ingredient_usage'
        verbose_name = 'Ingredient Usage'
        verbose_name_plural = 'Ingredient Usages'             

class StoreCategoryRevenue(models.Model):
    store_id = models.CharField(max_length=7)
    category = models.CharField(max_length=255)
    revenue = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'store_category_revenue'
        verbose_name = 'Store Category Revenue'
        verbose_name_plural = 'Store Category Revenues'        