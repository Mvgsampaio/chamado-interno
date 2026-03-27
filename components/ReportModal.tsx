
import React, { useState, useMemo, useRef } from 'react';
import { Ticket, TicketStatus } from '@/types';
import { Calendar, X, ChevronDown, FileDown, ChartLine, CalendarDays, CalendarCheck } from 'lucide-react';
import { pdfService } from '@/services/pdfService';

interface ReportModalProps {
  tickets: Ticket[];
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ tickets, onClose }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);
  
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  const filteredTickets = useMemo(() => {
    if (!startDate || !endDate) return [];

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return tickets.filter(t => {
      const created = new Date(t.createdAt);
      return created >= start && created <= end;
    });
  }, [tickets, startDate, endDate]);

  const reportData = useMemo(() => {
    if (filteredTickets.length === 0 && !hasGenerated) return null;

    const breakdown = {
      [TicketStatus.OPEN]: filteredTickets.filter(t => t.status === TicketStatus.OPEN).length,
      [TicketStatus.ANALYSIS]: filteredTickets.filter(t => t.status === TicketStatus.ANALYSIS).length,
      [TicketStatus.WAITING]: filteredTickets.filter(t => t.status === TicketStatus.WAITING).length,
      [TicketStatus.CLOSED]: filteredTickets.filter(t => t.status === TicketStatus.CLOSED).length,
    };

    return {
      total: filteredTickets.length,
      breakdown
    };
  }, [filteredTickets, hasGenerated]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setHasGenerated(true);
  };

  const handleDownloadPDF = () => {
    pdfService.generateTicketReport(filteredTickets, {
      status: 'Todos',
      priority: 'Todas'
    });
  };

  const triggerPicker = (input: HTMLInputElement | null) => {
    if (!input) return;
    try {
      if ('showPicker' in HTMLInputElement.prototype) {
        input.showPicker();
      } else {
        input.focus();
        input.click();
      }
    } catch {
      input.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-md sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border-0 sm:border sm:border-slate-200 animate-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar size={20} className="text-blue-600" />
            Gerar Relatório
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors p-2">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto">
          <form onSubmit={handleGenerate} className="space-y-5 sm:space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-5">
              <div className="relative group">
                <label className="block text-[10px] sm:text-[11px] font-black text-slate-500 uppercase mb-1.5 sm:mb-2 ml-1 tracking-widest">
                  Período Inicial
                </label>
                <div 
                  className="relative cursor-pointer"
                  onClick={() => triggerPicker(startInputRef.current)}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
                    <CalendarDays size={18} />
                  </div>
                  <input
                    ref={startInputRef}
                    type="date"
                    required
                    className="w-full pl-11 pr-12 py-3.5 sm:py-4 border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-black text-xs sm:text-[13px] bg-slate-50 focus:bg-white transition-all cursor-pointer relative z-0"
                    value={startDate}
                    onFocus={(e) => triggerPicker(e.target)}
                    onClick={(e) => triggerPicker(e.currentTarget)}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setHasGenerated(false);
                    }}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-300 z-10">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>

              <div className="relative group">
                <label className="block text-[10px] sm:text-[11px] font-black text-slate-500 uppercase mb-1.5 sm:mb-2 ml-1 tracking-widest">
                  Período Final
                </label>
                <div 
                  className="relative cursor-pointer"
                  onClick={() => triggerPicker(endInputRef.current)}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">
                    <CalendarCheck size={18} />
                  </div>
                  <input
                    ref={endInputRef}
                    type="date"
                    required
                    className="w-full pl-11 pr-12 py-3.5 sm:py-4 border-2 border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-black text-xs sm:text-[13px] bg-slate-50 focus:bg-white transition-all cursor-pointer relative z-0"
                    value={endDate}
                    onFocus={(e) => triggerPicker(e.target)}
                    onClick={(e) => triggerPicker(e.currentTarget)}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setHasGenerated(false);
                    }}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-300 z-10">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 sm:py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 text-[10px] sm:text-[11px] uppercase tracking-widest active:scale-95 transform"
            >
              PROCESSAR DADOS
            </button>
          </form>

          {hasGenerated && reportData && (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-5 sm:p-6 bg-slate-900 rounded-[1.5rem] sm:rounded-[2rem] text-center border-4 border-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <ChartLine size={64} className="text-white" />
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] relative z-10">Ocorrências no Período</p>
                <p className="text-4xl sm:text-5xl font-black text-white mt-1 relative z-10 tracking-tighter">{reportData.total}</p>
              </div>

              <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100 space-y-2 sm:space-y-3">
                <ReportRow label="Em Aberto" count={reportData.breakdown[TicketStatus.OPEN]} color="text-white" bg="bg-blue-600" />
                <ReportRow label="Em Análise" count={reportData.breakdown[TicketStatus.ANALYSIS]} color="text-white" bg="bg-indigo-600" />
                <ReportRow label="Em Espera" count={reportData.breakdown[TicketStatus.WAITING]} color="text-white" bg="bg-orange-600" />
                <ReportRow label="Encerrados" count={reportData.breakdown[TicketStatus.CLOSED]} color="text-white" bg="bg-emerald-600" />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleDownloadPDF}
                  className="flex-grow py-3 bg-blue-600 text-white font-black rounded-xl text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <FileDown size={16} />Baixar Relatório (PDF)
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-100 text-slate-600 font-black rounded-xl text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReportRow = ({ label, count, color, bg }: { label: string, count: number, color: string, bg: string }) => (
  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
    <span className={`text-[9px] sm:text-[10px] font-black uppercase px-2 py-1 rounded border shadow-sm ${bg} ${color} tracking-tight`}>{label}</span>
    <span className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">{count}</span>
  </div>
);

export default ReportModal;
