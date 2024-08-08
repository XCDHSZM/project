from django.urls import path
from . import views
urlpatterns = [
    # ...（其他URL配置）
    path('get', views.getData, name='register'),
]