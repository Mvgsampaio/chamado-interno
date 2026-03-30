
import { User, Ticket, AppConfig } from '@/types';

const API_URL = '/api';

export const storage = {
  getAppConfig: async (): Promise<AppConfig> => {
    const response = await fetch(`${API_URL}/config`);
    if (!response.ok) return { is2FAEnabled: false };
    const data = await response.json();
    return { is2FAEnabled: data.is_2fa_enabled === 1 };
  },

  saveAppConfig: async (config: AppConfig) => {
    await fetch(`${API_URL}/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is2FAEnabled: config.is2FAEnabled })
    });
  },

  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.map((u: Record<string, unknown>) => ({
      ...u,
      mustResetPassword: u.must_reset_password === 1
    }));
  },

  saveUsers: async () => {
    // This is a bit tricky because the API has individual endpoints
    // But for simplicity in this migration, we'll assume we handle it in App.tsx
  },

  getTickets: async (): Promise<Ticket[]> => {
    const response = await fetch(`${API_URL}/tickets`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.map((t: Record<string, unknown> & { history: Record<string, unknown>[] }) => ({
      ...t,
      requesterId: t.requester_id,
      requesterName: t.requester_name,
      createdAt: t.created_at,
      adminResponse: t.admin_response,
      history: t.history.map((h: Record<string, unknown>) => ({
        ...h,
        userName: h.user_name
      }))
    }));
  },

  saveTickets: async () => {
    // Handled individually in App.tsx
  },

  getCurrentSession: (): User | null => {
    const data = localStorage.getItem('intrahelp_session');
    return data ? JSON.parse(data) : null;
  },

  setSession: (user: User | null) => {
    if (user) {
      localStorage.setItem('intrahelp_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('intrahelp_session');
    }
  },

  login: async (username: string, password: string): Promise<User | null> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) return null;
    const user = await response.json();
    return {
      ...user,
      mustResetPassword: user.must_reset_password === 1
    };
  },

  createTicket: async (ticket: Ticket) => {
    await fetch(`${API_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket)
    });
  },

  updateTicket: async (id: string, updates: Partial<Ticket>) => {
    await fetch(`${API_URL}/tickets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
  },

  createUser: async (user: User) => {
    await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
  },

  updateUser: async (id: string, user: User) => {
    await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
  },

  deleteUser: async (id: string) => {
    await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE'
    });
  },

  resetPassword: async (id: string): Promise<string> => {
    const response = await fetch(`${API_URL}/users/${id}/reset-password`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Falha ao resetar senha');
    const data = await response.json();
    return data.defaultPassword;
  }
};
