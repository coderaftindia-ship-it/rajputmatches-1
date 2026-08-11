import { API_CONFIG } from '../config/api.config';
import { storageService } from './storage.service';

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  token?: string;
  [key: string]: any;
}

type EventListener = () => void;
const logoutListeners: Set<EventListener> = new Set();

export const onUnauthorizedLogout = (callback: EventListener) => {
  logoutListeners.add(callback);
  return () => {
    logoutListeners.delete(callback);
  };
};

const notifyUnauthorizedLogout = () => {
  logoutListeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.warn('Error executing logout listener:', e);
    }
  });
};

class ApiClient {
  private baseUrl: string = API_CONFIG.BASE_URL;

  private async getHeaders(isFormData = false): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
      headers['Accept'] = 'application/json';
    }

    const token = await storageService.getItem(API_CONFIG.TOKEN_STORAGE_KEY);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
    isFormData = false
  ): Promise<ApiResponse<T>> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${cleanEndpoint}`;
    const headers = await this.getHeaders(isFormData);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...(options.headers || {}),
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        await storageService.removeItem(API_CONFIG.TOKEN_STORAGE_KEY);
        await storageService.removeItem(API_CONFIG.USER_STORAGE_KEY);
        notifyUnauthorizedLogout();
        throw new Error('Unauthorized. Please log in again.');
      }

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = json.message || json.error || `HTTP Error ${response.status}`;
        throw new Error(errorMsg);
      }

      return json;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Network request timed out. Please check your connection.');
      }
      throw error;
    }
  }

  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params) {
      const query = Object.keys(params)
        .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== '')
        .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
        .join('&');
      if (query) {
        url += (endpoint.includes('?') ? '&' : '?') + query;
      }
    }
    const res = await this.request<T>(url, { method: 'GET' });
    return this.extractData(res);
  }

  async post<T = any>(endpoint: string, body?: any, isFormData = false): Promise<T> {
    const res = await this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: isFormData ? body : JSON.stringify(body || {}),
      },
      isFormData
    );
    return this.extractData(res);
  }

  async put<T = any>(endpoint: string, body?: any): Promise<T> {
    const res = await this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body || {}),
    });
    return this.extractData(res);
  }

  async patch<T = any>(endpoint: string, body?: any): Promise<T> {
    const res = await this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body || {}),
    });
    return this.extractData(res);
  }

  async delete<T = any>(endpoint: string, body?: any): Promise<T> {
    const res = await this.request<T>(endpoint, {
      method: 'DELETE',
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.extractData(res);
  }

  extractData(response: any): any {
    if (response && typeof response === 'object') {
      // The backend wraps results in various keys — return the whole response
      // so callers can pick the key they need
      if (response.profiles !== undefined) return response;
      if (response.chats !== undefined) return response.chats;
      if (response.messages !== undefined) return response.messages;
      if (response.data !== undefined) return response.data;
      if (response.user !== undefined) return response;
    }
    return response;
  }

  getTokenFromResponse(response: any): string | null {
    if (!response) return null;
    return response.token || response.data?.token || response.authToken || null;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
