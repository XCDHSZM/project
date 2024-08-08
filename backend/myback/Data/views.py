from django.shortcuts import render
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view
from rest_framework.response import Response
# Create your views here.
@api_view(['GET'])
def getData(request):
    print(123)
    # 示例数据
    data = {
        'message': '这里是返回的数据',
        'status': 'success'
    }
    return Response(data, status=200)
