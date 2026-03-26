
import React, { useState } from 'react';
import { storage } from '@/services/storage';
import { User, UserRole } from '@/types';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação básica de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    const users = storage.getUsers();
    if (users.some(u => u.email === formData.email)) {
      setError('Este e-mail já está cadastrado no sistema.');
      return;
    }
    
    if (users.some(u => u.username === formData.username)) {
      setError('Este nome de usuário já está em uso.');
      return;
    }

    const newUser: User = {
      id: `USR-${Date.now()}`,
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: UserRole.USER
    };

    storage.saveUsers([...users, newUser]);
    alert('Cadastro realizado com sucesso! Você já pode entrar.');
    onRegisterSuccess();
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Novo Cadastro</h2>
      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-8 border-b pb-4">Acesso à Sua solução esta aqui</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs font-bold border border-red-100">
            {error}
          </div>
        )}

        <div className="bg-white">
          <label className="block text-[11px] font-black text-black uppercase mb-1.5 ml-1">Nome Completo</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-black font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nome e Sobrenome"
          />
        </div>

        <div className="bg-white">
          <label className="block text-[11px] font-black text-black uppercase mb-1.5 ml-1">Nome de Usuário (Login)</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-black font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="Ex: joaosilva"
          />
        </div>

        <div className="bg-white">
          <label className="block text-[11px] font-black text-black uppercase mb-1.5 ml-1">E-mail Corporativo</label>
          <input
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-black font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@empresa.com.br"
          />
        </div>

        <div className="bg-white">
          <label className="block text-[11px] font-black text-black uppercase mb-1.5 ml-1">Senha</label>
          <input
            type="password"
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-black font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Crie uma senha"
          />
        </div>

        <div className="bg-white">
          <label className="block text-[11px] font-black text-black uppercase mb-1.5 ml-1">Confirmar Senha</label>
          <input
            type="password"
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-black font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Repita a senha"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-lg mt-4 transition-all"
        >
          FINALIZAR CADASTRO
        </button>
      </form>

      <div className="mt-8 text-center">
        <button 
          onClick={onSwitchToLogin}
          className="text-[11px] font-black text-slate-500 hover:text-blue-600 uppercase tracking-wide transition-colors"
        >
          Já possui conta? <span className="text-blue-600">Voltar ao Login</span>
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;