# Generated by Django 5.0.6 on 2024-06-10 12:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data_analysis', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='piedata',
            name='id',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='totalsalesbymonthbar',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]