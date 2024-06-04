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
    longitude = models.DecimalField(db_column='longtitude',max_digits=9, decimal_places=5, blank=True, null=True)
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
    orderdate = models.DateTimeField(db_column='orderDate', max_length=20, blank=True, null=True)  # Field name made lowercase.
    nitems = models.IntegerField(db_column='nItems', blank=True, null=True)  # Field name made lowercase.
    total = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'orders'

class OrderItem(models.Model):
    sku = models.ForeignKey(Product, on_delete=models.SET_NULL, db_column='SKU', blank=True, null=True)  # Field name made lowercase.
    orderid = models.ForeignKey(Order, on_delete=models.SET_NULL, db_column='orderID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = True
        db_table = 'orderItems'