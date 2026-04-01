import React, { useState, useMemo } from 'react';
import { User, Ticket, TicketStatus, UserRole } from '@/types';
import TicketModal from '@/components/TicketModal';
import ReportModal from '@/components/ReportModal';
import { 
  Plus, 
  FileText, 
  Filter, 
  Edit2, 
  Clock, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  PauseCircle, 
  LayoutDashboard,
  Calendar
} from 'lucide-react';

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

  const baseTickets = useMemo(() => 
    isAdmin ? tickets : tickets.filter(t => t.requesterId === user.id),
    [tickets, isAdmin, user.id]
  );

  const stats = {
    total: baseTickets.length,
    open: baseTickets.filter(t => t.status === TicketStatus.OPEN).length,
    analysis: baseTickets.filter(t => t.status === TicketStatus.ANALYSIS).length,
    waiting: baseTickets.filter(t => t.status === TicketStatus.WAITING).length,
    closed: baseTickets.filter(t => t.status === TicketStatus.CLOSED).length,
  };

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
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutDashboard className="text-blue-600" size={28} />
            Dashboard
          </h2>
          <p className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] mt-1">
            teste
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {isAdmin && (
            <button
              onClick={() => setIsReportOpen(true)}
              className="flex-grow sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-slate-200 text-slate-900 font-black rounded-xl sm:rounded-2xl hover:bg-slate-50 transition-all text-[10px] sm:text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm"
            >
              <Calendar size={16} />
              Relatório
            </button>
          )}
          <button
            onClick={openNewTicket}
            className="flex-grow sm:flex-none px-4 sm:px-8 py-2.5 sm:py-3 bg-slate-900 text-white font-black rounded-xl sm:rounded-2xl hover:bg-black transition-all text-[10px] sm:text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
          >
            <Plus size={18} />
            Novo Chamado
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard 
          label="Total" 
          count={stats.total} 
          icon={<FileText size={20} />} 
          color="bg-slate-100 border-slate-200 text-slate-900"
          isActive={statusFilter === 'ALL'}
          onClick={() => setStatusFilter('ALL')}
        />
        <StatCard 
          label="Abertos" 
          count={stats.open} 
          icon={<AlertCircle size={20} />} 
          color="bg-blue-600 border-blue-700 text-white"
          isActive={statusFilter === TicketStatus.OPEN}
          onClick={() => setStatusFilter(TicketStatus.OPEN)}
        />
        <StatCard 
          label="Análise" 
          count={stats.analysis} 
          icon={<Search size={20} />} 
          color="bg-indigo-600 border-indigo-700 text-white"
          isActive={statusFilter === TicketStatus.ANALYSIS}
          onClick={() => setStatusFilter(TicketStatus.ANALYSIS)}
        />
        <StatCard 
          label="Espera" 
          count={stats.waiting} 
          icon={<PauseCircle size={20} />} 
          color="bg-orange-600 border-orange-700 text-white"
          isActive={statusFilter === TicketStatus.WAITING}
          onClick={() => setStatusFilter(TicketStatus.WAITING)}
        />
        <StatCard 
          label="Encerrados" 
          count={stats.closed} 
          icon={<CheckCircle2 size={20} />} 
          color="bg-emerald-600 border-emerald-700 text-white"
          isActive={statusFilter === TicketStatus.CLOSED}
          onClick={() => setStatusFilter(TicketStatus.CLOSED)}
        />
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-black text-slate-900 uppercase text-[10px] sm:text-[11px] tracking-[0.2em] flex items-center gap-2">
            <Clock size={14} className="text-blue-600" />
            Listagem: {statusFilter === 'ALL' ? 'Todos' : statusFilter}
          </h3>
          <div className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {displayedTickets.length} registros
          </div>
        </div>

        {/* Mobile View: Cards */}
        <div className="block sm:hidden divide-y divide-slate-100">
          {displayedTickets.length > 0 ? (
            displayedTickets.map(ticket => (
              <div key={ticket.id} className="p-4 space-y-3 active:bg-slate-50 transition-colors" onClick={() => editTicket(ticket)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">#{ticket.id}</span>
                    <StatusBadge status={ticket.status} />
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">
                    {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 truncate">{ticket.requesterName}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{ticket.sector}</p>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {ticket.description}
                </p>
                <div className="flex justify-end pt-1">
                  <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                    Ver Detalhes <Edit2 size={10} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState statusFilter={statusFilter} onClear={() => setStatusFilter('ALL')} />
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
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
                        <Edit2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <EmptyState statusFilter={statusFilter} onClear={() => setStatusFilter('ALL')} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <TicketModal 
          user={user}
          ticket={editingTicket || undefined}
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

const EmptyState = ({ statusFilter, onClear }: { statusFilter: string, onClear: () => void }) => (
  <div className="px-6 py-12 text-center text-slate-500">
    <Filter size={48} className="mx-auto mb-4 opacity-10" />
    <p className="font-bold text-sm sm:text-base">Nenhum chamado com o status "{statusFilter}" encontrado.</p>
    <button 
      onClick={onClear}
      className="mt-4 text-[10px] sm:text-[11px] font-black text-blue-600 uppercase underline underline-offset-4"
    >
      Ver todos os chamados
    </button>
  </div>
);

interface StatCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

const StatCard = ({ label, count, icon, color, isActive, onClick }: StatCardProps) => (
  <button 
    onClick={onClick}
    className={`p-3 sm:p-4 rounded-xl flex items-center gap-2 sm:gap-4 border shadow-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] text-left group w-full ${color} ${
      isActive ? 'ring-4 ring-blue-500/20 border-blue-400 scale-[1.05]' : 'opacity-80 hover:opacity-100'
    }`}
  >
    <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-white/40 group-hover:bg-white/60 transition-colors ${isActive ? 'bg-white/60' : ''}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[8px] sm:text-[10px] font-black uppercase opacity-80 leading-tight truncate">{label}</p>
      <p className="text-lg sm:text-xl font-black tracking-tight">{count}</p>
    </div>
  </button>
);

const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const styles = {
    [TicketStatus.OPEN]: 'bg-blue-600 text-white border-blue-700',
    [TicketStatus.ANALYSIS]: 'bg-indigo-600 text-white border-indigo-700',
    [TicketStatus.WAITING]: 'bg-orange-600 text-white border-orange-700',
    [TicketStatus.CLOSED]: 'bg-emerald-600 text-white border-emerald-700',
  };
  return (
    <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 border text-[8px] sm:text-[10px] font-black uppercase rounded shadow-sm ${styles[status]}`}>
      {status}
    </span>
  );
};

export default Dashboard;
