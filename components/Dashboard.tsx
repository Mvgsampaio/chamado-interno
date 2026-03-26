
import React, { useState, useMemo } from 'react';
import { User, Ticket, UserRole, TicketStatus } from '@/types';
import TicketModal from '@/components/TicketModal';
import ReportModal from '@/components/ReportModal';

interface DashboardProps {
  user: User;
  tickets: Ticket[];
  onAddTicket: (ticket: Partial<Ticket>) => void;
  onUpdateTicket: (ticketId: string, updates: Partial<Ticket>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, tickets, onAddTicket, onUpdateTicket }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');
  
  const isAdmin = user.role === UserRole.ADMIN;
  
  // 1. Filtrar primeiro por permissão (Admin vê tudo, User vê apenas os seus)
  const baseTickets = useMemo(() => 
    isAdmin ? tickets : tickets.filter(t => t.requesterId === user.id),
    [tickets, isAdmin, user.id]
  );

  // 2. Estatísticas baseadas no que o usuário pode ver
  const stats = {
    total: baseTickets.length,
    open: baseTickets.filter(t => t.status === TicketStatus.OPEN).length,
    analysis: baseTickets.filter(t => t.status === TicketStatus.ANALYSIS).length,
    waiting: baseTickets.filter(t => t.status === TicketStatus.WAITING).length,
    closed: baseTickets.filter(t => t.status === TicketStatus.CLOSED).length,
  };

  // 3. Aplicar o filtro de status selecionado nos cards
  const displayedTickets = useMemo(() => 
    statusFilter === 'ALL' 
      ? baseTickets 
      : baseTickets.filter(t => t.status === statusFilter),
    [baseTickets, statusFilter]
  );

  const openNewTicket = () => {
    setEditingTicket(null);
    setIsModalOpen(true);
  };

  const editTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Painel de Chamados</h2>
          <p className="text-slate-500 font-medium">Gestão integrada de suporte interno</p>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <button
              onClick={() => setIsReportOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-900 hover:bg-slate-50 font-bold rounded-xl shadow-sm transition-all"
            >
              <i className="fas fa-file-export"></i>
              Relatório
            </button>
          )}
          <button
            onClick={openNewTicket}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:scale-105 active:scale-95"
          >
            <i className="fas fa-plus"></i>
            Novo Chamado
          </button>
        </div>
      </div>

      {/* Stats Cards (Now Interactive Filters) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          label="Total" 
          count={stats.total} 
          icon="fa-list" 
          color="bg-white border-slate-200 text-slate-900" 
          isActive={statusFilter === 'ALL'}
          onClick={() => setStatusFilter('ALL')}
        />
        <StatCard 
          label="Em Aberto" 
          count={stats.open} 
          icon="fa-envelope" 
          color="bg-blue-50 text-blue-700 border-blue-100" 
          isActive={statusFilter === TicketStatus.OPEN}
          onClick={() => setStatusFilter(TicketStatus.OPEN)}
        />
        <StatCard 
          label="Em Análise" 
          count={stats.analysis} 
          icon="fa-search" 
          color="bg-purple-50 text-purple-700 border-purple-100" 
          isActive={statusFilter === TicketStatus.ANALYSIS}
          onClick={() => setStatusFilter(TicketStatus.ANALYSIS)}
        />
        <StatCard 
          label="Em Espera" 
          count={stats.waiting} 
          icon="fa-clock" 
          color="bg-amber-50 text-amber-700 border-amber-100" 
          isActive={statusFilter === TicketStatus.WAITING}
          onClick={() => setStatusFilter(TicketStatus.WAITING)}
        />
        <StatCard 
          label="Encerrados" 
          count={stats.closed} 
          icon="fa-check-circle" 
          color="bg-emerald-50 text-emerald-700 border-emerald-100" 
          isActive={statusFilter === TicketStatus.CLOSED}
          onClick={() => setStatusFilter(TicketStatus.CLOSED)}
        />
      </div>

      {/* Ticket List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <i className="fas fa-list text-blue-600"></i>
            Listagem: {statusFilter === 'ALL' ? 'Todos os Chamados' : statusFilter}
          </h3>
          {statusFilter !== 'ALL' && (
            <button 
              onClick={() => setStatusFilter('ALL')}
              className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase"
            >
              Limpar Filtro
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest">ID / Data</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest">Solicitante</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest">Assunto</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedTickets.length > 0 ? (
                  displayedTickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-900">{ticket.id}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">{new Date(ticket.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 font-bold">{ticket.requesterName}</div>
                        <div className="text-xs text-slate-500 font-medium">{ticket.sector}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-800 truncate max-w-xs">{ticket.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => editTicket(ticket)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <i className="fas fa-filter text-4xl mb-3 opacity-20"></i>
                      <p className="font-bold">Nenhum chamado com o status "{statusFilter}" encontrado.</p>
                      <button 
                        onClick={() => setStatusFilter('ALL')}
                        className="mt-4 text-[11px] font-black text-blue-600 uppercase underline underline-offset-4"
                      >
                        Ver todos os chamados
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TicketModal 
          user={user}
          ticket={editingTicket}
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            if (editingTicket) {
              onUpdateTicket(editingTicket.id, data);
            } else {
              onAddTicket(data);
            }
            setIsModalOpen(false);
          }}
        />
      )}

      {isReportOpen && (
        <ReportModal 
          tickets={tickets} 
          onClose={() => setIsReportOpen(false)} 
        />
      )}
    </div>
  );
};

interface StatCardProps {
  label: string;
  count: number;
  icon: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

const StatCard = ({ label, count, icon, color, isActive, onClick }: StatCardProps) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-xl flex items-center gap-4 border shadow-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] text-left group w-full ${color} ${
      isActive ? 'ring-4 ring-blue-500/20 border-blue-400 scale-[1.05]' : 'opacity-80 hover:opacity-100'
    }`}
  >
    <div className={`text-xl w-10 h-10 flex items-center justify-center rounded-lg bg-white/40 group-hover:bg-white/60 transition-colors ${isActive ? 'bg-white/60' : ''}`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <p className="text-[10px] font-black uppercase opacity-80 leading-tight">{label}</p>
      <p className="text-xl font-black tracking-tight">{count}</p>
    </div>
  </button>
);

const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const styles = {
    [TicketStatus.OPEN]: 'bg-blue-100 text-blue-700 border-blue-200',
    [TicketStatus.ANALYSIS]: 'bg-purple-100 text-purple-700 border-purple-200',
    [TicketStatus.WAITING]: 'bg-amber-100 text-amber-700 border-amber-200',
    [TicketStatus.CLOSED]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };
  return (
    <span className={`inline-block px-3 py-1 border text-[10px] font-black uppercase rounded shadow-sm ${styles[status]}`}>
      {status}
    </span>
  );
};

export default Dashboard;
