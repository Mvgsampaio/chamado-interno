
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
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [appConfig, setAppConfig] = useState<AppConfig>({ is2FAEnabled: false });
  const [isLoading, setIsLoading] = useState(true);

  const refreshUsers = async () => {
    try {
      const fetchedUsers = await storage.getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Erro ao atualizar lista de usuários:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedTickets, fetchedUsers, fetchedConfig] = await Promise.all([
          storage.getTickets(),
          storage.getUsers(),
          storage.getAppConfig()
        ]);
        setTickets(fetchedTickets);
        setUsers(fetchedUsers);
        setAppConfig(fetchedConfig);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  const handleCreateUser = async (user: User) => {
    await storage.createUser(user);
    setUsers([...users, user]);
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    await storage.updateUser(userId, updatedUser);
    setUsers(users.map(u => u.id === userId ? updatedUser : u));
  };

  const handleDeleteUser = async (userId: string) => {
    await storage.deleteUser(userId);
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleResetPassword = async (userId: string) => {
    try {
      const defaultPassword = await storage.resetPassword(userId);
      alert(`Senha resetada com sucesso! A nova senha provisória é: ${defaultPassword}\nO usuário será obrigado a trocá-la no próximo acesso.`);
      
      // Update local state to reflect mustResetPassword: true
      setUsers(users.map(u => u.id === userId ? { ...u, mustResetPassword: true } : u));
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      alert('Ocorreu um erro ao resetar a senha.');
    }
  };

  const handlePasswordReset = async (newPassword: string) => {
    if (!auth.user) return;
    
    const updatedUser = { ...auth.user, password: newPassword, mustResetPassword: false };
    await storage.updateUser(auth.user.id, updatedUser);
    
    const updatedUsers = users.map(u => u.id === auth.user!.id ? updatedUser : u);
    setUsers(updatedUsers);
    
    setAuth({ user: updatedUser, isAuthenticated: true });
    storage.setSession(updatedUser);
    setView('dashboard');
    alert('Senha redefinida com sucesso! Bem-vindo ao sistema.');
  };

  const updateConfig = async (newConfig: AppConfig) => {
    setAppConfig(newConfig);
    await storage.saveAppConfig(newConfig);
  };

  const handleCreateTicket = async (ticketData: Partial<Ticket>) => {
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
    
    await storage.createTicket(newTicket);
    setTickets([newTicket, ...tickets]);
  };

  const handleUpdateTicket = async (ticketId: string, updates: Partial<Ticket>) => {
    if (!auth.user) return;
    
    const historyEntry: HistoryEntry = {
      id: `HIST-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName: auth.user!.name,
      action: updates.status ? `Status alterado para ${updates.status}` : 'Informações atualizadas'
    };

    await storage.updateTicket(ticketId, { ...updates, historyEntry });
    
    const updatedTickets = tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          ...updates,
          history: [...t.history, historyEntry]
        };
      }
      return t;
    });
    setTickets(updatedTickets);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    if (view === 'register') {
      return (
        <div className="fixed inset-0 bg-slate-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <RegisterForm 
            onRegisterSuccess={async () => {
              await refreshUsers();
              setView('login');
            }} 
            onSwitchToLogin={() => setView('login')} 
          />
        </div>
      );
    }
    return (
      <LoginForm 
        onLogin={handleLogin} 
        is2FAEnabled={appConfig.is2FAEnabled} 
        onSwitchToRegister={() => setView('register')}
      />
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
          onCreateUser={handleCreateUser}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
          onResetPassword={handleResetPassword}
        />
      )}
      {view === 'users' && auth.user?.role === UserRole.ADMIN && (
        <UserManagement 
          users={users} 
          onUpdateUser={handleUpdateUser}
          onResetPassword={handleResetPassword}
          appConfig={appConfig}
          onUpdateConfig={updateConfig}
        />
      )}
    </Layout>
  );
};

export default App;
