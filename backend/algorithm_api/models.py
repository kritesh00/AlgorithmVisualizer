from django.db import models

# Create your models here.

class Algorithm(models.Model):
    ALGORITHM_TYPES = [
        ('sorting', 'Sorting'),
        ('searching', 'Searching'),
        ('pathfinding', 'Pathfinding'),
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    algorithm_type = models.CharField(max_length=20, choices=ALGORITHM_TYPES)
    complexity_time = models.CharField(max_length=50)
    complexity_space = models.CharField(max_length=50)
    code_sample = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.algorithm_type})"

class AlgorithmExecution(models.Model):
    algorithm = models.ForeignKey(Algorithm, on_delete=models.CASCADE)
    array_size = models.IntegerField()
    execution_time = models.FloatField()  # in milliseconds
    comparisons = models.IntegerField(default=0)
    swaps = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.algorithm.name} - Size: {self.array_size}"
