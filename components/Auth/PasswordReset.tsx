
import React, { useState } from 'react';
import { User } from '@/types';
import { Key, ShieldCheck, AlertCircle } from 'lucide-react';

interface PasswordResetProps {
  user: User;
  onResetComplete: (newPassword: string) => void;
}

const PasswordReset: React.FC<PasswordResetProps> = ({ user, onResetComplete }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    if (newPassword === '123@abc' || newPassword === 'admin') {
      alert('Por favor, escolha uma senha diferente da senha padrão.');
      return;
    }

    setIsSubmitting(true);
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    onResetComplete(newPassword);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20 rotate-3">
            <Key size={32} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Primeiro Acesso</h2>
          <p className="text-slate-400 text-xs font-medium mt-2">Olá, {user.name}. Por segurança, você deve alterar sua senha provisória.</p>
        </div>

        <div className="p-8">
          <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl mb-8">
            <AlertCircle className="text-amber-500 shrink-0" size={20} />
            <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
              Esta é uma medida de segurança obrigatória. Após esta alteração, caso deseje mudar sua senha novamente, você deverá solicitar ao administrador do sistema.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nova Senha</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar Nova Senha</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  placeholder="Repita a nova senha"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  Redefinir e Acessar Sistema
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
