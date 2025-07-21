from django.shortcuts import render
from django.db.models import Avg, Count
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Algorithm, AlgorithmExecution
from .serializers import AlgorithmSerializer, AlgorithmExecutionSerializer, AlgorithmStatsSerializer

class AlgorithmViewSet(viewsets.ModelViewSet):
    queryset = Algorithm.objects.all()
    serializer_class = AlgorithmSerializer

    @action(detail=False, methods=['get'])
    def by_type(self, request):
        algorithm_type = request.query_params.get('type', None)
        if algorithm_type:
            algorithms = Algorithm.objects.filter(algorithm_type=algorithm_type)
            serializer = self.get_serializer(algorithms, many=True)
            return Response(serializer.data)
        return Response({'error': 'Type parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        stats = Algorithm.objects.values('algorithm_type').annotate(
            count=Count('id')
        )
        return Response(stats)

class AlgorithmExecutionViewSet(viewsets.ModelViewSet):
    queryset = AlgorithmExecution.objects.all()
    serializer_class = AlgorithmExecutionSerializer

    @action(detail=False, methods=['get'])
    def performance_stats(self, request):
        algorithm_type = request.query_params.get('type', None)
        
        if algorithm_type:
            executions = AlgorithmExecution.objects.filter(algorithm__algorithm_type=algorithm_type)
        else:
            executions = AlgorithmExecution.objects.all()
        
        stats = executions.values('algorithm__algorithm_type').annotate(
            avg_execution_time=Avg('execution_time'),
            total_executions=Count('id'),
            avg_comparisons=Avg('comparisons'),
            avg_swaps=Avg('swaps')
        )
        
        serializer = AlgorithmStatsSerializer(stats, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def record_execution(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
