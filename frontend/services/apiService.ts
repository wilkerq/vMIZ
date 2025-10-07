const API_BASE_URL = 'http://localhost:3001/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Ocorreu um erro desconhecido' }));
      throw new Error(errorBody.message || `Erro HTTP! status: ${response.status}`);
    }
    if (response.status === 204) { // No Content
      return null as T;
    }
    return response.json();
  } catch (error) {
    console.error(`Erro no serviço da API em ${options.method || 'GET'} ${url}:`, error);
    throw error;
  }
}

export const apiService = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: any) => request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any) => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  del: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
