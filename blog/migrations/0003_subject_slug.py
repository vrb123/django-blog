# Generated by Django 3.0.2 on 2020-01-05 16:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_article_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='subject',
            name='slug',
            field=models.SlugField(default='default', editable=False),
            preserve_default=False,
        ),
    ]