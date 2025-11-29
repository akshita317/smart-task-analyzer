from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_analyze, name='test'),
    path('analyze/', views.analyze_view, name='analyze'),
    path('suggest/', views.suggest_view, name='suggest'),
]
