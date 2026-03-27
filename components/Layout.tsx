
import React, { useState } from 'react';
import { User, UserRole } from '@/types';
import { Menu, X, LogOut, LayoutDashboard, Users, Headset, Home, Shield } from 'lucide-react';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, onNavigate, currentPage, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = user.role === UserRole.ADMIN;

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Headset size={18} className="text-white" />
          </div>
          <span className="font-black tracking-tighter text-sm uppercase">Chamados Internos</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-0 z-40 md:relative md:z-20
        w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col shadow-2xl
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div 
          onClick={() => handleNavigate('dashboard')}
          className="p-6 cursor-pointer group transition-all hover:bg-slate-800/50 hidden md:block"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Headset size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tighter">
              Chamados Internos
            </h1>
          </div>
          <p className="text-slate-400 text-[9px] mt-2 uppercase tracking-[0.2em] font-black border-l-2 border-blue-500 pl-2">
            Sua solução esta aqui
          </p>
        </div>

        <nav className="mt-8 px-4 space-y-2 flex-grow">
          <button
            onClick={() => handleNavigate('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${
              currentPage === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={18} />
            Início / Painel
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => handleNavigate('user-list')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${
                  currentPage === 'user-list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users size={18} />
                Usuários
              </button>
              <button
                onClick={() => handleNavigate('users')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${
                  currentPage === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Shield size={18} />
                Permissões
              </button>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center font-black text-xs text-blue-400 shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-black truncate uppercase tracking-tight">{user.name}</p>
              <p className="text-[9px] text-slate-500 font-bold truncate uppercase">{user.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-transparent hover:border-red-900/30"
          >
            <LogOut size={16} />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-grow bg-slate-50 relative flex flex-col min-h-screen w-full overflow-x-hidden">
        {/* Header Bar with Home Shortcut (Conditional) */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-end min-h-[64px] shrink-0">
           {currentPage !== 'dashboard' && (
             <button 
               onClick={() => onNavigate('dashboard')}
               className="flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border border-slate-200 group animate-in fade-in slide-in-from-right-2"
               title="Voltar ao Início"
             >
               <Home size={14} className="group-hover:scale-125 transition-transform" />
               <span className="hidden sm:inline">Painel Inicial</span>
             </button>
           )}
        </header>
        
        <div className="p-4 md:p-10 flex-grow overflow-y-auto max-h-[calc(100vh-64px)]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
