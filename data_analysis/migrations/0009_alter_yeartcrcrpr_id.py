# Generated by Django 5.0.6 on 2024-06-23 16:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data_analysis', '0008_auto_20240623_1624'),
    ]

    operations = [
        migrations.AlterField(
            model_name='yeartcrcrpr',
            name='id',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
    ]
