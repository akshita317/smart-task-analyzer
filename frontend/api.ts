import type { Task, AnalyzedTask, Strategy } from './task';

function getApiBaseUrl(): string {
  // First priority: environment variable (includes local dev and production)
  const envUrl = (import.meta as any).env.VITE_API_URL;
  if (envUrl) {
    console.log('Using VITE_API_URL:', envUrl);
    return envUrl;
  }
  
  // Second priority: Check if we're in production (not localhost)
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    const prodUrl = 'https://smart-task-analyzer-backend.up.railway.app';
    console.log('Using production URL:', prodUrl);
    return prodUrl;
  }
  
  // Fallback for local development
  console.log('Using localhost');
  return 'http://localhost:8000';
}

export async function analyzeTasks(tasks: Task[], strategy: Strategy = 'smart'): Promise<AnalyzedTask[]> {
  try {
    const API_BASE = getApiBaseUrl();
    const url = new URL(`${API_BASE}/api/tasks/analyze/`);
    url.searchParams.append('strategy', strategy);
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tasks),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error calling analyzeTasks API:', error);
    throw error;
  }
}

export async function getSuggestions(tasks: Task[], strategy: Strategy = 'smart'): Promise<AnalyzedTask[]> {
  try {
    const API_BASE = getApiBaseUrl();
    const url = new URL(`${API_BASE}/api/tasks/suggest/`);
    url.searchParams.append('strategy', strategy);
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tasks),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error calling getSuggestions API:', error);
    throw error;
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    const API_BASE = getApiBaseUrl();
    const response = await fetch(`${API_BASE}/api/health/`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}
