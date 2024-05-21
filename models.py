# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = True
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = True
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Customers(models.Model):
    customerid = models.CharField(db_column='customerID', primary_key=True, max_length=7)  # Field name made lowercase.
    latitude = models.CharField(max_length=18, blank=True, null=True)
    longitude = models.CharField(max_length=19, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'customers'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = True
        db_table = 'django_migrations'


class Orderitems(models.Model):
    sku = models.ForeignKey('Products', models.DO_NOTHING, db_column='SKU', blank=True, null=True)  # Field name made lowercase.
    orderid = models.ForeignKey('Orders', models.DO_NOTHING, db_column='orderID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = True
        db_table = 'orderItems'


class Orders(models.Model):
    orderid = models.IntegerField(db_column='orderID', primary_key=True)  # Field name made lowercase.
    customerid = models.ForeignKey(Customers, models.DO_NOTHING, db_column='customerID', blank=True, null=True)  # Field name made lowercase.
    storeid = models.ForeignKey('Stores', models.DO_NOTHING, db_column='storeID', blank=True, null=True)  # Field name made lowercase.
    orderdate = models.CharField(db_column='orderDate', max_length=20, blank=True, null=True)  # Field name made lowercase.
    nitems = models.IntegerField(db_column='nItems', blank=True, null=True)  # Field name made lowercase.
    total = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'orders'


class Products(models.Model):
    sku = models.CharField(db_column='SKU', primary_key=True, max_length=5)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=21, blank=True, null=True)  # Field name made lowercase.
    price = models.DecimalField(db_column='Price', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    category = models.CharField(db_column='Category', max_length=10, blank=True, null=True)  # Field name made lowercase.
    size = models.CharField(db_column='Size', max_length=11, blank=True, null=True)  # Field name made lowercase.
    ingredients = models.CharField(db_column='Ingredients', max_length=65, blank=True, null=True)  # Field name made lowercase.
    launch = models.CharField(db_column='Launch', max_length=11, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = True
        db_table = 'products'


class Stores(models.Model):
    storeid = models.CharField(db_column='storeID', primary_key=True, max_length=7)  # Field name made lowercase.
    zipcode = models.IntegerField(blank=True, null=True)
    state_abbr = models.CharField(max_length=2, blank=True, null=True)
    latitude = models.DecimalField(max_digits=8, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=5, blank=True, null=True)
    city = models.CharField(max_length=15, blank=True, null=True)
    state = models.CharField(max_length=10, blank=True, null=True)
    distance = models.CharField(max_length=18, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'stores'
