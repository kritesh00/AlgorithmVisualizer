from django.shortcuts import render
from django.db.models import Avg, Count, F
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
        
        # Debug: Check if we have executions
        total_executions = executions.count()
        print(f"Total executions found: {total_executions}")
        
        if total_executions == 0:
            # Return empty stats for all algorithm types if no executions exist
            all_types = ['sorting', 'searching', 'pathfinding']
            formatted_stats = []
            for algo_type in all_types:
                if not algorithm_type or algorithm_type == algo_type:
                    formatted_stats.append({
                        'algorithm_type': algo_type,
                        'avg_execution_time': 0,
                        'total_executions': 0,
                        'avg_comparisons': 0,
                        'avg_swaps': 0,
                    })
            serializer = AlgorithmStatsSerializer(formatted_stats, many=True)
            return Response(serializer.data)
        
        # Get stats with proper field mapping
        stats_query = executions.values('algorithm__algorithm_type').annotate(
            avg_execution_time=Avg('execution_time'),
            total_executions=Count('id'),
            avg_comparisons=Avg('comparisons'),
            avg_swaps=Avg('swaps')
        )
        
        # Debug: Print what we found
        print(f"Stats query results: {list(stats_query)}")
        
        # Format the data to match serializer expectations
        formatted_stats = []
        for stat in stats_query:
            formatted_stats.append({
                'algorithm_type': stat['algorithm__algorithm_type'],
                'avg_execution_time': round(stat['avg_execution_time'] or 0, 2),
                'total_executions': stat['total_executions'] or 0,
                'avg_comparisons': round(stat['avg_comparisons'] or 0, 2),
                'avg_swaps': round(stat['avg_swaps'] or 0, 2),
            })
        
        # If no specific type requested, ensure we show all types (even with 0 executions)
        if not algorithm_type:
            all_types = ['sorting', 'searching', 'pathfinding']
            existing_types = [stat['algorithm_type'] for stat in formatted_stats]
            
            for algo_type in all_types:
                if algo_type not in existing_types:
                    formatted_stats.append({
                        'algorithm_type': algo_type,
                        'avg_execution_time': 0,
                        'total_executions': 0,
                        'avg_comparisons': 0,
                        'avg_swaps': 0,
                    })
        
        serializer = AlgorithmStatsSerializer(formatted_stats, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def record_execution(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def debug_data(self, request):
        """Debug endpoint to see what data we have"""
        executions = AlgorithmExecution.objects.all().select_related('algorithm')
        debug_data = []
        
        for execution in executions[:10]:  # Limit to first 10 for debugging
            debug_data.append({
                'id': execution.id,
                'algorithm_name': execution.algorithm.name,
                'algorithm_type': execution.algorithm.algorithm_type,
                'execution_time': execution.execution_time,
                'comparisons': execution.comparisons,
                'swaps': execution.swaps,
                'array_size': execution.array_size,
            })
        
        return Response({
            'total_executions': AlgorithmExecution.objects.count(),
            'executions_by_type': AlgorithmExecution.objects.values('algorithm__algorithm_type').annotate(count=Count('id')),
            'sample_executions': debug_data
        })
