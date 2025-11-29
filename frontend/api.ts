import type { Task, AnalyzedTask, Strategy } from './task';

const API_BASE = getApiBaseUrl();

function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8000';
    }
    // For production, try to get from environment variable
    const envUrl = (import.meta as any).env.VITE_API_URL;
    if (envUrl) return envUrl;
  }
  return 'http://localhost:8000';
}

export async function analyzeTasks(tasks: Task[], strategy: Strategy = 'smart'): Promise<AnalyzedTask[]> {
  try {
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
    const response = await fetch(`${API_BASE}/api/health/`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}
