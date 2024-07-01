# Generated by Django 5.0.6 on 2024-06-30 13:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data_analysis', '0010_ingredientusage'),
    ]

    operations = [
        migrations.CreateModel(
            name='StoreCategoryRevenue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('store_id', models.CharField(max_length=7)),
                ('category', models.CharField(max_length=255)),
                ('revenue', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
            options={
                'verbose_name': 'Store Category Revenue',
                'verbose_name_plural': 'Store Category Revenues',
                'db_table': 'store_category_revenue',
            },
        ),
    ]