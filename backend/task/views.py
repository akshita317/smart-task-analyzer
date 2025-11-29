import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from .scoring import analyze_tasks, top_suggestions


def parse_body(request):
    try:
        # Get the raw body
        body = request.body
        if not body:
            # Empty body
            return []
        
        body_unicode = body.decode('utf-8')
        if not body_unicode.strip():
            return []
        
        data = json.loads(body_unicode)
        
        # Handle different input formats
        if isinstance(data, dict):
            # Single task object
            return [data]
        elif isinstance(data, list):
            # Array of tasks
            return data
        else:
            raise ValueError(f'Expected dict or list, got {type(data).__name__}')
            
    except json.JSONDecodeError as e:
        raise ValueError(f'Invalid JSON: {str(e)}')
    except Exception as e:
        raise ValueError(f'Error parsing body: {str(e)}')


@csrf_exempt
def health_check(request):
    """Simple health check endpoint"""
    return JsonResponse({'status': 'ok', 'message': 'Backend is running'})


@csrf_exempt  
def test_analyze(request):
    """Test endpoint to debug analyze"""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'})
    
    return JsonResponse({
        'received_body_length': len(request.body),
        'received_body': request.body.decode('utf-8')[:500],
        'test': 'success'
    })


@csrf_exempt
def analyze_view(request):
    """Analyze tasks and return prioritized list"""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)
    
    try:
        # Parse the request body
        body = request.body
        
        if not body:
            return JsonResponse([], safe=False)
        
        # Decode and parse JSON
        data = json.loads(body.decode('utf-8'))
        
        # Ensure it's a list
        if isinstance(data, dict):
            tasks = [data]
        elif isinstance(data, list):
            tasks = data
        else:
            return JsonResponse({'error': 'Expected list or dict'}, status=400)
        
        # If no tasks, return empty list
        if not tasks:
            return JsonResponse([], safe=False)
        
        # Get strategy from query params
        strategy = request.GET.get('strategy', 'smart')
        
        # Analyze tasks
        result = analyze_tasks(tasks, strategy=strategy)
        
        # Return results
        return JsonResponse(result, safe=False)
        
    except json.JSONDecodeError as e:
        return JsonResponse({'error': f'Invalid JSON: {str(e)}'}, status=400)
    except ValueError as e:
        return JsonResponse({'error': f'Value error: {str(e)}'}, status=400)


@csrf_exempt
def suggest_view(request):
    # For simplicity, accept POST with tasks like analyze; GET returns example
    if request.method == 'POST':
        try:
            tasks = parse_body(request)
        except ValueError as e:
            return HttpResponseBadRequest(f'Invalid JSON: {e}')
        strategy = request.GET.get('strategy', 'smart')
        result = top_suggestions(tasks, n=3, strategy=strategy)
        return JsonResponse(result, safe=False)

    # GET: returns example response shape
    example = [
        {
            "title": "Sample task",
            "due_date": "2025-01-31",
            "estimated_hours": 2,
            "importance": 7,
            "dependencies": ["Fix login bug"],
        }
    ]
    result = top_suggestions(example, n=3, strategy='smart')
    return JsonResponse(result, safe=False)
