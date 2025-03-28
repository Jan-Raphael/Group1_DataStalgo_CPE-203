# Generated by Django 5.1.7 on 2025-03-26 15:58

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=150)),
                ('title', models.CharField(max_length=255)),
                ('tags', models.TextField()),
                ('description', models.TextField()),
                ('contentType', models.IntegerField(choices=[(0, 'Free'), (1, 'Subscription'), (2, 'Premium')])),
                ('price', models.DecimalField(decimal_places=2, default=0, max_digits=6)),
                ('PostDate', models.DateTimeField(auto_now_add=True)),
                ('downvotes', models.ManyToManyField(blank=True, related_name='post_downvotes', to=settings.AUTH_USER_MODEL)),
                ('purchase', models.ManyToManyField(blank=True, related_name='purchased_posts', to=settings.AUTH_USER_MODEL)),
                ('upvotes', models.ManyToManyField(blank=True, related_name='post_upvotes', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='attachments/')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attachments', to='posts.post')),
            ],
        ),
    ]
