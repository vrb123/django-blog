from django.urls import path, re_path
from . import views
from django.conf.urls import url

from .models import Article, Subject

# For redirecting
from django.views.generic import RedirectView


app_name = 'blog'

urlpatterns = [
    
    path('home/', views.index, name='home'),
    path('subjects/', views.SubjectListView.as_view(), name='subjects'),
    path('subject/<slug:slug>/', views.SubjectDetailView.as_view(), name='subject-detail'),
    path('articles/', views.ArticleListView.as_view(), name='articles'),
    path('articles/<slug:slug>/', views.ArticleListBySlugView.as_view(), name='articles-by-subject-slug'),
    path('article/<slug:slug>/', views.ArticleDetailView.as_view(), name='article-detail'),
    path('article/<slug:slug>/post_comment',views.post_comment, name='post-comment'),
    url ('', views.index, name='index'),
]