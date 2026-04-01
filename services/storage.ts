
import { User, Ticket, UserRole, AppConfig } from '@/types';

const USERS_KEY = 'intrahelp_users';
const TICKETS_KEY = 'intrahelp_tickets';
const SESSION_KEY = 'intrahelp_session';
const CONFIG_KEY = 'intrahelp_config';

export const storage = {
  getAppConfig: (): AppConfig => {
    const data = localStorage.getItem(CONFIG_KEY);
    if (!data) {
      const defaultConfig: AppConfig = { is2FAEnabled: false };
      localStorage.setItem(CONFIG_KEY, JSON.stringify(defaultConfig));
      return defaultConfig;
    }
    const config = JSON.parse(data);
    // Force disable 2FA as requested by the user to facilitate testing
    if (config.is2FAEnabled) {
      config.is2FAEnabled = false;
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    }
    return config;
  },

  saveAppConfig: (config: AppConfig) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  },

  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      // Seed default admin
      const defaultAdmin: User = {
        id: 'admin-id',
        name: 'admin',
        username: 'admin',
        email: 'admin@empresa.com.br',
        sector: 'TI',
        password: 'admin',
        role: UserRole.ADMIN,
        mustResetPassword: false
      };
      localStorage.setItem(USERS_KEY, JSON.stringify([defaultAdmin]));
      return [defaultAdmin];
    }
    
    const users = JSON.parse(data);
    // Force admin credentials to be admin/admin as requested
    const adminUser = users.find((u: User) => u.username === 'admin');
    if (adminUser && adminUser.password !== 'admin') {
      adminUser.password = 'admin';
      adminUser.name = 'admin';
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    
    return users;
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getTickets: (): Ticket[] => {
    const data = localStorage.getItem(TICKETS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveTickets: (tickets: Ticket[]) => {
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
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
