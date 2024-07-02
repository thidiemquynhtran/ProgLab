# Generated by Django 5.0.6 on 2024-07-02 15:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data_analysis', '0015_orderdistance_orderdistanceaggregate'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProductSizePopularity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_size', models.CharField(max_length=50)),
                ('total_sales', models.IntegerField()),
                ('total_revenue', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
            options={
                'verbose_name': 'Product Size Popularity',
                'verbose_name_plural': 'Product Size Popularities',
                'db_table': 'product_size_popularity',
                'ordering': ['product_size'],
            },
        ),
    ]
