import type { Task, AnalyzedTask, Strategy } from './task';

// Configuration
const CONFIG = {
  // Try backend API first, fallback to local mock
  USE_BACKEND_API: true,
};

// Get API base URL based on environment
const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return 'http://localhost:8000';
  }

  const hostname = window.location.hostname;

  // Development environment
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }

  // Production environment (Vercel, etc)
  // Set VITE_API_URL environment variable for production
  const apiUrl = (globalThis as any).VITE_API_URL;
  if (apiUrl) {
    return apiUrl;
  }

  // Default fallback
  return 'http://localhost:8000';
};

const API_BASE = getApiBaseUrl();

export interface AnalyzeRequest {
  tasks: Task[];
  strategy: Strategy;
}

export interface SuggestRequest {
  tasks: Task[];
  strategy: Strategy;
}

/**
 * Analyze tasks using the backend API
 */
export async function analyzeTasks(
  tasks: Task[],
  strategy: Strategy = 'smart'
): Promise<AnalyzedTask[]> {
  try {
    const url = new URL(`${API_BASE}/api/tasks/analyze/`);
    url.searchParams.append('strategy', strategy);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tasks),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error analyzing tasks:', error);
    throw error;
  }
}

/**
 * Get top task suggestions using the backend API
 */
export async function getSuggestions(
  tasks: Task[],
  strategy: Strategy = 'smart'
): Promise<AnalyzedTask[]> {
  try {
    const url = new URL(`${API_BASE}/api/tasks/suggest/`);
    url.searchParams.append('strategy', strategy);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tasks),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error getting suggestions:', error);
    throw error;
  }
}

/**
 * Test connection to backend
 */
export async function testConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/tasks/suggest/`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}

export { API_BASE };
