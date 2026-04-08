
import { User, Ticket, UserRole, AppConfig, HistoryEntry } from '@/types';
import { supabase } from './supabase';

const SESSION_KEY = 'intrahelp_session';

export const storage = {
  getAppConfig: async (): Promise<AppConfig> => {
    const { data, error } = await supabase
      .from('app_config')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      const defaultConfig: AppConfig = { is2FAEnabled: false };
      return defaultConfig;
    }
    
    const config = { is2FAEnabled: data.is_2fa_enabled };
    return config;
  },

  saveAppConfig: async (config: AppConfig) => {
    await supabase
      .from('app_config')
      .upsert({ id: 1, is_2fa_enabled: config.is2FAEnabled });
  },

  login: async (identifier: string, password: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`username.ilike.${identifier},email.ilike.${identifier}`)
      .eq('password', password)
      .single();

    if (error || !data) return null;
    
    return {
      id: data.id,
      name: data.name,
      username: data.username,
      email: data.email,
      sector: data.sector,
      extension: data.extension,
      role: data.role as UserRole,
      mustResetPassword: data.must_reset_password
    };
  },

  getUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error || !data) return [];
    
    return data.map(u => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      sector: u.sector,
      extension: u.extension,
      role: u.role as UserRole,
      mustResetPassword: u.must_reset_password
    }));
  },

  createUser: async (user: User): Promise<void> => {
    await supabase
      .from('users')
      .insert([{
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        sector: user.sector,
        extension: user.extension,
        password: user.password,
        role: user.role,
        must_reset_password: !!user.mustResetPassword
      }]);
  },

  updateUser: async (userId: string, updates: Partial<User>): Promise<void> => {
    const supabaseUpdates: Record<string, string | number | boolean | undefined> = {};
    if (updates.name !== undefined) supabaseUpdates.name = updates.name;
    if (updates.username !== undefined) supabaseUpdates.username = updates.username;
    if (updates.email !== undefined) supabaseUpdates.email = updates.email;
    if (updates.sector !== undefined) supabaseUpdates.sector = updates.sector;
    if (updates.extension !== undefined) supabaseUpdates.extension = updates.extension;
    if (updates.password !== undefined) supabaseUpdates.password = updates.password;
    if (updates.role !== undefined) supabaseUpdates.role = updates.role;
    if (updates.mustResetPassword !== undefined) supabaseUpdates.must_reset_password = !!updates.mustResetPassword;

    await supabase
      .from('users')
      .update(supabaseUpdates)
      .eq('id', userId);
  },

  deleteUser: async (userId: string): Promise<void> => {
    await supabase
      .from('users')
      .delete()
      .eq('id', userId);
  },

  resetPassword: async (userId: string): Promise<string> => {
    const defaultPassword = '123@abc';
    await supabase
      .from('users')
      .update({ password: defaultPassword, must_reset_password: true })
      .eq('id', userId);
    return defaultPassword;
  },

  getTickets: async (): Promise<Ticket[]> => {
    const { data: ticketsData, error: ticketsError } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (ticketsError || !ticketsData) return [];

    const tickets: Ticket[] = [];
    for (const t of ticketsData) {
      const { data: historyData } = await supabase
        .from('ticket_history')
        .select('*')
        .eq('ticket_id', t.id)
        .order('timestamp', { ascending: true });

      tickets.push({
        id: t.id,
        requesterId: t.requester_id,
        requesterName: t.requester_name,
        sector: t.sector,
        extension: t.extension,
        description: t.description,
        status: t.status,
        createdAt: t.created_at,
        adminResponse: t.admin_response,
        history: (historyData || []).map(h => ({
          id: h.id,
          timestamp: h.timestamp,
          userName: h.user_name,
          action: h.action
        }))
      });
    }
    return tickets;
  },

  createTicket: async (ticket: Ticket): Promise<void> => {
    await supabase
      .from('tickets')
      .insert([{
        id: ticket.id,
        requester_id: ticket.requesterId,
        requester_name: ticket.requesterName,
        sector: ticket.sector,
        extension: ticket.extension,
        description: ticket.description,
        status: ticket.status,
        created_at: ticket.createdAt
      }]);

    if (ticket.history && ticket.history.length > 0) {
      const historyToInsert = ticket.history.map(h => ({
        id: h.id,
        ticket_id: ticket.id,
        timestamp: h.timestamp,
        user_name: h.userName,
        action: h.action
      }));
      await supabase
        .from('ticket_history')
        .insert(historyToInsert);
    }
  },

  updateTicket: async (ticketId: string, updates: Partial<Ticket> & { historyEntry?: HistoryEntry }): Promise<void> => {
    const { historyEntry, ...rest } = updates;
    
    const supabaseUpdates: Record<string, string | number | boolean | undefined> = {};
    if (rest.status !== undefined) supabaseUpdates.status = rest.status;
    if (rest.adminResponse !== undefined) supabaseUpdates.admin_response = rest.adminResponse;

    if (Object.keys(supabaseUpdates).length > 0) {
      await supabase
        .from('tickets')
        .update(supabaseUpdates)
        .eq('id', ticketId);
    }

    if (historyEntry) {
      await supabase
        .from('ticket_history')
        .insert([{
          id: historyEntry.id,
          ticket_id: ticketId,
          timestamp: historyEntry.timestamp,
          user_name: historyEntry.userName,
          action: historyEntry.action
        }]);
    }
  },

  getCurrentSession: (): User | null => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  setSession: (user: User | null) => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }
};
