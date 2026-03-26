
import React, { useState } from 'react';
import { storage } from '@/services/storage';
import { User } from '@/types';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToRegister }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = storage.getUsers();
    // Permite login por username ou email
    const user = users.find(u => (u.username === identifier || u.email === identifier) && u.password === password);

    if (user) {
      onLogin(user);
    } else {
      setError('Credenciais inválidas. Use "admin" / "admin" para acesso inicial.');
    }
  };

  const handleForgotPassword = () => {
    alert('Simulação: Um link de redefinição de senha foi enviado para seu e-mail corporativo.');
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200">
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-3xl mb-4 shadow-xl">
          <i className="fas fa-headset"></i>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Chamados Internos</h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Portal de Suporte Interno</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        <div className="bg-white">
          <label className="block text-[11px] font-black text-black uppercase mb-1.5 ml-1">Usuário ou E-mail</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-black font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
            placeholder="Nome de usuário ou e-mail"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        <div className="bg-white">
          <label className="block text-[11px] font-black text-black uppercase mb-1.5 ml-1">Senha de Acesso</label>
          <input
            type="password"
            required
            className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-black font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between py-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-slate-900" />
            <span className="text-[11px] font-black text-black uppercase group-hover:text-slate-700 transition-colors">Manter Conectado</span>
          </label>
          <button 
            type="button" 
            onClick={handleForgotPassword}
            className="text-[11px] font-black text-blue-600 hover:text-blue-800 uppercase"
          >
            Recuperar Senha
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-lg shadow-slate-200 transition-all transform hover:-translate-y-1 active:translate-y-0"
        >
          ACESSAR SISTEMA
        </button>
      </form>

      <div className="mt-10 pt-6 border-t border-slate-100 text-center">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
          Novo colaborador? 
          <button 
            onClick={onSwitchToRegister}
            className="ml-2 text-blue-600 hover:text-blue-800 font-black decoration-2 underline-offset-4 hover:underline"
          >
            CADASTRE-SE AQUI
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;