import axios from 'axios';
import { 
  User, Crop, WeatherData, MarketPrice, GovernmentScheme, 
  AssistanceRequest, AssistanceResponse, KnowledgeArticle, 
  AppNotification, AdminAnalytics 
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agroassist_jwt_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor for token expiry handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login check
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/me')) {
        localStorage.removeItem('agroassist_jwt_token');
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials: { email: string; password: string }) => 
    api.post<{ success: boolean; token: string; user: User; message: string }>('/auth/login', credentials),
  register: (data: any) => 
    api.post<{ success: boolean; token: string; user: User; message: string }>('/auth/register', data),
  forgotPassword: (email: string) => 
    api.post<{ success: boolean; message: string; recovery_token?: string }>('/auth/forgot-password', { email }),
  getMe: () => 
    api.get<{ success: boolean; user: User; profile: any }>('/auth/me'),
};

export const cropsApi = {
  getCrops: (params?: { status?: string; type?: string }) => 
    api.get<{ success: boolean; count: number; crops: Crop[] }>('/crops', { params }),
  addCrop: (cropData: Partial<Crop>) => 
    api.post<{ success: boolean; message: string; crop: Crop }>('/crops', cropData),
  updateCrop: (id: number, cropData: Partial<Crop>) => 
    api.put<{ success: boolean; message: string; crop: Crop }>(`/crops/${id}`, cropData),
  deleteCrop: (id: number) => 
    api.delete<{ success: boolean; message: string }>(`/crops/${id}`),
};

export const weatherApi = {
  getWeather: (district?: string) => 
    api.get<{ success: boolean; weather: WeatherData }>('/weather', { params: { district } }),
};

export const marketApi = {
  getPrices: (params?: { search?: string; district?: string }) => 
    api.get<{ success: boolean; count: number; prices: MarketPrice[] }>('/market-prices', { params }),
  getDistricts: () => 
    api.get<{ success: boolean; districts: string[] }>('/market-prices/districts'),
};

export const schemesApi = {
  getSchemes: (params?: { category?: string; sponsor?: string; search?: string }) => 
    api.get<{ success: boolean; count: number; schemes: GovernmentScheme[] }>('/schemes', { params }),
  createScheme: (schemeData: any) => 
    api.post<{ success: boolean; message: string; scheme: GovernmentScheme }>('/schemes', schemeData),
  applyForScheme: (id: number, applicationData: any) =>
    api.post<{ success: boolean; message: string; reference_id: string }>(`/schemes/${id}/apply`, applicationData),
};

export const assistanceApi = {
  getRequests: (params?: { status?: string; category?: string }) => 
    api.get<{ success: boolean; count: number; requests: AssistanceRequest[] }>('/assistance-requests', { params }),
  createRequest: (data: Partial<AssistanceRequest>) => 
    api.post<{ success: boolean; message: string; request: AssistanceRequest }>('/assistance-requests', data),
  updateStatus: (id: number, status: string, officer_name?: string) => 
    api.put<{ success: boolean; message: string; request: AssistanceRequest }>(`/assistance-requests/${id}/status`, { status, officer_name }),
  addResponse: (id: number, responseData: { 
    message: string; 
    recommended_actions?: string[]; 
    chemical_biological_advice?: string;
    chemical_recommendation?: string;
    status?: string;
  }) => 
    api.post<{ success: boolean; message: string; response: AssistanceResponse; request: AssistanceRequest }>(`/assistance-requests/${id}/responses`, {
      message: responseData.message,
      recommended_actions: responseData.recommended_actions,
      chemical_biological_advice: responseData.chemical_recommendation || responseData.chemical_biological_advice,
      status: responseData.status,
    }),
};

export const knowledgeApi = {
  getArticles: (params?: { category?: string; season?: string; search?: string }) => 
    api.get<{ success: boolean; count: number; articles: KnowledgeArticle[] }>('/knowledge-center', { params }),
};

export const notificationsApi = {
  getNotifications: () => 
    api.get<{ success: boolean; notifications: AppNotification[] }>('/notifications'),
  markAsRead: (id: number) => 
    api.put<{ success: boolean }>(`/notifications/${id}/read`),
  markAllAsRead: () => 
    api.post<{ success: boolean; message: string }>('/notifications/mark-all-read'),
};

export const adminApi = {
  getAnalytics: () => 
    api.get<{ success: boolean; analytics: AdminAnalytics; stats?: any }>('/admin/analytics'),
  getStats: () => 
    api.get<{ success: boolean; stats: any; analytics: AdminAnalytics }>('/admin/analytics'),
  getUsers: () => 
    api.get<{ success: boolean; users: User[] }>('/admin/users'),
  updateUserStatus: (id: number, status: string | boolean) => 
    api.put<{ success: boolean; message: string }>(`/admin/users/${id}/status`, { 
      status: typeof status === 'boolean' ? (status ? 'active' : 'suspended') : status 
    }),
  broadcastNotification: (data: { title: string; message: string; type?: string; target_role?: string }) => 
    api.post<{ success: boolean; message: string }>('/admin/broadcast-notification', data),
  sendBroadcast: (data: { title: string; message: string; type?: string; target_role?: string }) => 
    api.post<{ success: boolean; message: string }>('/admin/broadcast-notification', data),
};

export default api;
