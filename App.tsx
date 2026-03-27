
import React, { useState, useEffect } from 'react';
import { User, Ticket, UserRole, AuthState, TicketStatus, HistoryEntry } from '@/types';
import { storage } from '@/services/storage';
import LoginForm from '@/components/Auth/LoginForm';
import PasswordReset from '@/components/Auth/PasswordReset';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import UserManagement from '@/components/UserManagement';
import UserList from '@/components/UserList';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const session = storage.getCurrentSession();
    return session ? { user: session, isAuthenticated: true } : { user: null, isAuthenticated: false };
  });
  const [view, setView] = useState<'login' | 'register' | 'dashboard' | 'users' | 'user-list' | 'reset-password'>(() => {
    const session = storage.getCurrentSession();
    if (session) {
      return session.mustResetPassword ? 'reset-password' : 'dashboard';
    }
    return 'login';
  });
  const [tickets, setTickets] = useState<Ticket[]>(() => storage.getTickets());
  const [users, setUsers] = useState<User[]>(() => storage.getUsers());
  const [appConfig, setAppConfig] = useState<AppConfig>(() => storage.getAppConfig());

  // No longer need the initialization effect if we use lazy initializers
  useEffect(() => {
    // This can be used for other side effects if needed
  }, []);

  const handleLogin = (user: User) => {
    setAuth({ user, isAuthenticated: true });
    storage.setSession(user);
    if (user.mustResetPassword) {
      setView('reset-password');
    } else {
      setView('dashboard');
    }
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
    storage.setSession(null);
    setView('login');
  };

  const updateTickets = (newTickets: Ticket[]) => {
    setTickets(newTickets);
    storage.saveTickets(newTickets);
  };

  const updateUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    storage.saveUsers(newUsers);
  };

  const handlePasswordReset = (newPassword: string) => {
    if (!auth.user) return;
    
    const updatedUsers = users.map(u => {
      if (u.id === auth.user!.id) {
        return { ...u, password: newPassword, mustResetPassword: false };
      }
      return u;
    });
    
    updateUsers(updatedUsers);
    
    // Update session
    const updatedUser = { ...auth.user, password: newPassword, mustResetPassword: false };
    setAuth({ user: updatedUser, isAuthenticated: true });
    storage.setSession(updatedUser);
    setView('dashboard');
    alert('Senha redefinida com sucesso! Bem-vindo ao sistema.');
  };

  const updateConfig = (newConfig: AppConfig) => {
    setAppConfig(newConfig);
    storage.saveAppConfig(newConfig);
  };

  const generateMockTickets = () => {
    if (!auth.user) return;
    
    const sectors = ['TI', 'RH', 'Financeiro', 'Manutenção', 'Logística', 'Vendas'];
    const problems = [
      'Impressora não reconhece o papel no setor',
      'Solicitação de acesso à pasta de rede compartilhada',
      'Computador apresentando lentidão excessiva ao ligar',
      'Ar condicionado fazendo barulho estranho na sala 3',
      'Troca de lâmpada queimada no corredor central',
      'Erro de login no sistema de ponto eletrônico',
      'Pedido de novo mouse e teclado ergonômico',
      'Dúvida sobre o preenchimento de relatório de despesas',
      'Configuração de e-mail corporativo no celular novo',
      'Limpeza de mesa solicitada após manutenção de rede'
    ];

    const newMockTickets: Ticket[] = [];
    const statuses = Object.values(TicketStatus);
    
    // Gerar 20 chamados (5 de cada status)
    for (let i = 0; i < 20; i++) {
      const statusIndex = Math.floor(i / 5);
      const currentStatus = statuses[statusIndex];
      const nextIdNumber = tickets.length + newMockTickets.length + 1;
      const sequentialId = `TK-${nextIdNumber.toString().padStart(3, '0')}`;
      
      const ticket: Ticket = {
        id: sequentialId,
        requesterId: auth.user.id,
        requesterName: auth.user.name,
        sector: sectors[i % sectors.length],
        extension: `10${i % 10}`,
        description: `${problems[i % problems.length]} - Referência interna #${i + 100}`,
        status: currentStatus,
        createdAt: new Date(Date.now() - (i * 3600000)).toISOString(), // Datas variadas nas últimas 20 horas
        history: [{
          id: `HIST-${Date.now()}-${i}`,
          timestamp: new Date().toISOString(),
          userName: 'Sistema',
          action: 'Chamado de teste gerado automaticamente'
        }],
        adminResponse: currentStatus !== TicketStatus.OPEN ? 'Este é um parecer técnico fictício para fins de demonstração do sistema.' : undefined
      };
      newMockTickets.push(ticket);
    }

    updateTickets([...newMockTickets, ...tickets]);
    alert('20 chamados de teste foram gerados com sucesso!');
  };

  const handleCreateTicket = (ticketData: Partial<Ticket>) => {
    if (!auth.user) return;
    
    const nextNumber = tickets.length > 0 
      ? Math.max(...tickets.map(t => parseInt(t.id.split('-')[1]) || 0)) + 1 
      : 1;
    
    const sequentialId = `TK-${nextNumber.toString().padStart(3, '0')}`;

    const newTicket: Ticket = {
      id: sequentialId,
      requesterId: auth.user.id,
      requesterName: ticketData.requesterName || auth.user.name,
      sector: ticketData.sector || '',
      extension: ticketData.extension || '',
      description: ticketData.description || '',
      status: TicketStatus.OPEN,
      createdAt: new Date().toISOString(),
      history: [{
        id: `HIST-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userName: auth.user.name,
        action: 'Abertura do chamado'
      }]
    };
    updateTickets([newTicket, ...tickets]);
  };

  const handleUpdateTicket = (ticketId: string, updates: Partial<Ticket>) => {
    if (!auth.user) return;
    
    const updatedTickets = tickets.map(t => {
      if (t.id === ticketId) {
        const historyEntry: HistoryEntry = {
          id: `HIST-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userName: auth.user!.name,
          action: updates.status ? `Status alterado para ${updates.status}` : 'Informações atualizadas'
        };
        return {
          ...t,
          ...updates,
          history: [...t.history, historyEntry]
        };
      }
      return t;
    });
    updateTickets(updatedTickets);
  };

  if (!auth.isAuthenticated) {
    return (
      <LoginForm onLogin={handleLogin} is2FAEnabled={appConfig.is2FAEnabled} />
    );
  }

  if (view === 'reset-password' && auth.user) {
    return (
      <PasswordReset user={auth.user} onResetComplete={handlePasswordReset} />
    );
  }

  return (
    <Layout 
      user={auth.user!} 
      onLogout={handleLogout} 
      onNavigate={(page) => setView(page as 'login' | 'register' | 'dashboard' | 'users' | 'user-list' | 'reset-password')}
      currentPage={view}
    >
      {view === 'dashboard' && (
        <Dashboard 
          user={auth.user!} 
          tickets={tickets} 
          onAddTicket={handleCreateTicket}
          onUpdateTicket={handleUpdateTicket}
        />
      )}
      {view === 'user-list' && auth.user?.role === UserRole.ADMIN && (
        <UserList 
          users={users} 
          onUpdateUsers={updateUsers}
        />
      )}
      {view === 'users' && auth.user?.role === UserRole.ADMIN && (
        <UserManagement 
          users={users} 
          onUpdateUsers={updateUsers}
          onGenerateMocks={generateMockTickets}
          appConfig={appConfig}
          onUpdateConfig={updateConfig}
        />
      )}
    </Layout>
  );
};

export default App;
