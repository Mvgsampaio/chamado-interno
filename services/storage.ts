
import { User, Ticket, UserRole } from '@/types';

const USERS_KEY = 'intrahelp_users';
const TICKETS_KEY = 'intrahelp_tickets';
const SESSION_KEY = 'intrahelp_session';

export const storage = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      // Seed default admin
      const defaultAdmin: User = {
        id: 'admin-id',
        name: 'Administrador Sistema',
        username: 'admin',
        email: 'admin@empresa.com.br',
        password: 'admin',
        role: UserRole.ADMIN
      };
      localStorage.setItem(USERS_KEY, JSON.stringify([defaultAdmin]));
      return [defaultAdmin];
    }
    return JSON.parse(data);
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
