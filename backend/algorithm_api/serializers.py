from rest_framework import serializers
from .models import Algorithm, AlgorithmExecution

class AlgorithmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Algorithm
        fields = '__all__'

class AlgorithmExecutionSerializer(serializers.ModelSerializer):
    algorithm_name = serializers.CharField(source='algorithm.name', read_only=True)
    
    class Meta:
        model = AlgorithmExecution
        fields = '__all__'

class AlgorithmStatsSerializer(serializers.Serializer):
    algorithm_type = serializers.CharField()
    avg_execution_time = serializers.FloatField()
    total_executions = serializers.IntegerField()
    avg_comparisons = serializers.FloatField()
    avg_swaps = serializers.FloatField()
