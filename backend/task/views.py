import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from .scoring import analyze_tasks, top_suggestions


def parse_body(request):
    try:
        body_unicode = request.body.decode('utf-8')
        if not body_unicode:
            return []
        data = json.loads(body_unicode)
        if isinstance(data, dict):
            # wrap single-object input into list
            return [data]
        if not isinstance(data, list):
            raise ValueError('Expected a JSON array of tasks')
        return data
    except Exception as e:
        raise ValueError(str(e))


@csrf_exempt
def health_check(request):
    """Simple health check endpoint"""
    return JsonResponse({'status': 'ok', 'message': 'Backend is running'})


@csrf_exempt
def analyze_view(request):
    if request.method != 'POST':
        return HttpResponseBadRequest('POST required')
    
    # Log the raw request
    import sys
    print(f"DEBUG analyze_view: method={request.method}, content_type={request.content_type}", file=sys.stderr)
    print(f"DEBUG analyze_view: raw body length={len(request.body)}, body={request.body[:200]}", file=sys.stderr)
    
    try:
        tasks = parse_body(request)
        print(f"DEBUG analyze_view: parsed {len(tasks)} tasks", file=sys.stderr)
    except ValueError as e:
        print(f"DEBUG analyze_view: parse error {e}", file=sys.stderr)
        return HttpResponseBadRequest(f'Invalid JSON: {e}')

    strategy = request.GET.get('strategy', 'smart')
    print(f"DEBUG analyze_view: strategy={strategy}, task count={len(tasks)}", file=sys.stderr)
    
    result = analyze_tasks(tasks, strategy=strategy)
    print(f"DEBUG analyze_view: returning {len(result)} results", file=sys.stderr)
    
    return JsonResponse(result, safe=False)


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
