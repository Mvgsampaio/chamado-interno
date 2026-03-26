
import React from 'react';
import { User, UserRole } from '@/types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, onNavigate, currentPage, children }) => {
  const isAdmin = user.role === UserRole.ADMIN;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col shadow-2xl z-20">
        <div 
          onClick={() => onNavigate('dashboard')}
          className="p-6 cursor-pointer group transition-all hover:bg-slate-800/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <i className="fas fa-headset text-white"></i>
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
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${
              currentPage === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className="fas fa-th-large text-sm"></i>
            Início / Painel
          </button>

          {isAdmin && (
            <button
              onClick={() => onNavigate('users')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${
                currentPage === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className="fas fa-users-cog text-sm"></i>
              Permissões
            </button>
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
            <i className="fas fa-sign-out-alt"></i>
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50 relative flex flex-col min-h-screen">
        {/* Header Bar with Home Shortcut (Conditional) */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-end min-h-[64px]">
           {currentPage !== 'dashboard' && (
             <button 
               onClick={() => onNavigate('dashboard')}
               className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border border-slate-200 group animate-in fade-in slide-in-from-right-2"
               title="Voltar ao Início"
             >
               <i className="fas fa-home group-hover:scale-125 transition-transform"></i>
               Painel Inicial
             </button>
           )}
        </header>
        
        <div className="p-6 md:p-10 flex-grow overflow-y-auto max-h-[calc(110vh-64px)]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
