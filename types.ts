
export enum UserRole {
  ADMIN = 'Administrador',
  USER = 'Usuário Comum'
}

export enum TicketStatus {
  OPEN = 'Em aberto',
  ANALYSIS = 'Em análise',
  WAITING = 'Em espera',
  CLOSED = 'Encerrado'
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  userName: string;
  action: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  sector: string;
  password?: string;
  role: UserRole;
  mustResetPassword?: boolean;
}

export interface Ticket {
  id: string;
  requesterId: string;
  requesterName: string;
  sector: string;
  extension: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  history: HistoryEntry[];
  adminResponse?: string;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

export interface AppConfig {
  is2FAEnabled: boolean;
}
