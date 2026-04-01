
import React, { useState } from 'react';
import { User, Ticket, UserRole, TicketStatus } from '@/types';
import { X, FileText, History, Info, Send, Paperclip } from 'lucide-react';
import SuccessAnimation from './SuccessAnimation';

interface TicketModalProps {
  user: User;
  ticket: Ticket | null;
  onClose: () => void;
  onSave: (data: Partial<Ticket>) => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ user, ticket, onClose, onSave }) => {
  const isAdmin = user.role === UserRole.ADMIN;
  const isEditing = !!ticket;
  const [isSuccessAnimating, setIsSuccessAnimating] = useState(false);

  const [formData, setFormData] = useState({
    requesterName: ticket?.requesterName || user.name,
    sector: ticket?.sector || user.sector || '',
    extension: ticket?.extension || '',
    description: ticket?.description || '',
    status: ticket?.status || TicketStatus.OPEN,
    adminResponse: ticket?.adminResponse || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) {
      setIsSuccessAnimating(true);
    } else {
      onSave(formData);
    }
  };

  const handleAnimationComplete = () => {
    onSave(formData);
  };

  const statusColors = {
    [TicketStatus.OPEN]: 'bg-blue-600',
    [TicketStatus.ANALYSIS]: 'bg-indigo-600',
    [TicketStatus.WAITING]: 'bg-orange-600',
    [TicketStatus.CLOSED]: 'bg-emerald-600',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border-0 sm:border sm:border-slate-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isEditing ? `Chamado #${ticket.id}` : 'Nova Solicitação'}
            </h3>
            {isEditing && (
              <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                Registrado em: {new Date(ticket.createdAt).toLocaleString('pt-BR')}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          <form id="ticket-form" onSubmit={handleSubmit} className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Left Column: Basic Info */}
            <div className="space-y-4 sm:space-y-5">
              <h4 className="font-black text-slate-900 flex items-center gap-2 uppercase text-[10px] sm:text-[11px] tracking-widest border-b pb-3 mb-2">
                <FileText size={14} className="text-blue-600" />
                Detalhamento
              </h4>
              
              <div>
                <label className="block text-[10px] sm:text-[11px] font-black text-black uppercase mb-1 sm:mb-1.5 ml-1">Solicitante</label>
                <input
                  type="text"
                  required
                  readOnly={isEditing && !isAdmin}
                  className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-black font-bold outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${isEditing && !isAdmin ? 'opacity-70' : ''}`}
                  value={formData.requesterName}
                  onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-black text-black uppercase mb-1 sm:mb-1.5 ml-1">Setor</label>
                  <input
                    type="text"
                    required
                    readOnly={isEditing && !isAdmin}
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-black font-bold outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${isEditing && !isAdmin ? 'opacity-70' : ''}`}
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-black text-black uppercase mb-1 sm:mb-1.5 ml-1">Ramal</label>
                  <input
                    type="text"
                    required
                    readOnly={isEditing && !isAdmin}
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-black font-bold outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${isEditing && !isAdmin ? 'opacity-70' : ''}`}
                    value={formData.extension}
                    onChange={(e) => setFormData({ ...formData, extension: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-[11px] font-black text-black uppercase mb-1 sm:mb-1.5 ml-1">Causa / Descrição</label>
                <textarea
                  required
                  rows={3}
                  readOnly={isEditing && !isAdmin}
                  className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-black font-bold outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base ${isEditing && !isAdmin ? 'opacity-70' : ''}`}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              {/* Status control for Admin */}
              {isAdmin && isEditing && (
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-black text-black uppercase mb-2 sm:mb-3 ml-1">Atualizar Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(TicketStatus).map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setFormData({ ...formData, status: status })}
                        className={`px-2 py-2.5 sm:py-3 rounded-xl border text-[9px] sm:text-[10px] font-black uppercase transition-all shadow-sm flex items-center justify-center gap-1.5 sm:gap-2 ${
                          formData.status === status 
                            ? 'bg-slate-900 text-white border-slate-900' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${statusColors[status]}`}></span>
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Feedback & History */}
            <div className="space-y-5 sm:space-y-6">
              {isEditing ? (
                <>
                  <h4 className="font-black text-slate-900 flex items-center gap-2 uppercase text-[10px] sm:text-[11px] tracking-widest border-b pb-3 mb-2">
                    <History size={14} className="text-blue-600" />
                    Histórico Log
                  </h4>
                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 max-h-[200px] sm:max-h-[250px] overflow-y-auto border border-slate-100 shadow-inner">
                    <div className="space-y-4">
                      {ticket.history.map((entry) => (
                        <div key={entry.id} className="relative pl-6 pb-2 border-l-2 border-slate-200 last:border-0">
                          <div className="absolute left-[-7px] top-0 w-3 h-3 rounded-full bg-white border-2 border-slate-900"></div>
                          <p className="text-[9px] sm:text-[10px] font-black text-slate-900 uppercase leading-tight">{entry.action}</p>
                          <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 mt-1">
                            {entry.userName} • {new Date(entry.timestamp).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 sm:pt-4">
                    <label className="block text-[10px] sm:text-[11px] font-black text-black uppercase mb-1 sm:mb-1.5 ml-1">Parecer do Analista Responsável</label>
                    <textarea
                      rows={4}
                      placeholder={isAdmin ? "Escreva aqui a solução ou análise..." : "Aguardando resposta do analista..."}
                      readOnly={!isAdmin}
                      className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-black font-bold outline-none focus:ring-2 focus:ring-blue-500 resize-none text-xs sm:text-sm ${!isAdmin ? 'italic text-slate-600' : ''}`}
                      value={formData.adminResponse}
                      onChange={(e) => setFormData({ ...formData, adminResponse: e.target.value })}
                    ></textarea>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 sm:p-10 bg-slate-50 rounded-3xl sm:rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-400">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Info size={32} className="text-slate-300 sm:w-10 sm:h-10" />
                  </div>
                  <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-900">Abertura de Chamado</p>
                  <p className="text-[9px] sm:text-[10px] mt-2 leading-relaxed">Preencha os campos obrigatorios.<br/>Seu chamado será priorizado pela nossa equipe técnica.</p>
                  
                  <div className="mt-8 w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-white hover:bg-slate-50 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Paperclip className="w-8 h-8 mb-3 text-slate-300 group-hover:text-blue-500 transition-colors" />
                        <p className="mb-1 text-[10px] sm:text-xs font-bold text-slate-500">Para maiores informações anexe aqui uma imagem</p>
                        <p className="text-[9px] text-slate-400">PNG, JPG ou PDF (MAX. 5MB)</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*,.pdf" />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 flex items-center justify-end gap-2 sm:gap-3 bg-slate-50 shrink-0">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 text-slate-600 font-black hover:text-slate-900 transition-all text-[10px] sm:text-[11px] uppercase tracking-widest"
          >
            Fechar
          </button>
          <button
            form="ticket-form"
            type="submit"
            disabled={isSuccessAnimating}
            className="px-6 sm:px-10 py-2.5 sm:py-3 bg-slate-900 text-white font-black rounded-xl sm:rounded-2xl shadow-xl transition-all text-[10px] sm:text-[11px] uppercase tracking-widest hover:bg-black flex items-center gap-2"
          >
            {isEditing ? 'Salvar' : (
              <>
                <Send size={16} />
                Enviar
              </>
            )}
          </button>
        </div>

        <SuccessAnimation 
          isVisible={isSuccessAnimating} 
          onComplete={handleAnimationComplete} 
        />
      </div>
    </div>
  );
};

export default TicketModal;
