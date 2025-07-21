from django.contrib import admin
from .models import Algorithm, AlgorithmExecution

# Register your models here.

@admin.register(Algorithm)
class AlgorithmAdmin(admin.ModelAdmin):
    list_display = ('name', 'algorithm_type', 'complexity_time', 'complexity_space', 'created_at')
    list_filter = ('algorithm_type', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(AlgorithmExecution)
class AlgorithmExecutionAdmin(admin.ModelAdmin):
    list_display = ('algorithm', 'array_size', 'execution_time', 'comparisons', 'swaps', 'created_at')
    list_filter = ('algorithm', 'created_at')
    readonly_fields = ('created_at',)
