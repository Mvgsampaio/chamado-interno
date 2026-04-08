
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, Mail, Lock, UserPlus, ArrowLeft, AlertCircle, CheckCircle2, Phone } from 'lucide-react';
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
    extension: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    const users = await storage.getUsers();
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
      username: formData.username.toLowerCase(),
      email: formData.email.toLowerCase(),
      extension: formData.extension,
      sector: 'Geral',
      password: formData.password,
      role: UserRole.USER
    };

    await storage.createUser(newUser);
    setIsSuccess(true);
    
    // Wait for success animation before switching
    setTimeout(() => {
      onRegisterSuccess();
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-md border border-white/20"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Criar Conta</h2>
        <p className="text-slate-500 mt-2 font-medium">Junte-se à nossa plataforma de suporte</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-semibold border border-red-100 flex items-center gap-3"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}
          {isSuccess && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-green-50 text-green-600 p-4 rounded-2xl text-sm font-semibold border border-green-100 flex items-center gap-3"
            >
              <CheckCircle2 size={18} />
              Cadastro realizado com sucesso! Redirecionando...
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-2">
            <UserIcon size={12} className="text-blue-500" />
            Nome Completo
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-900 font-semibold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Seu nome completo"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-2">
              <UserIcon size={12} className="text-blue-500" />
              Usuário
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-900 font-semibold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Ex: joao"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-2">
              <Phone size={12} className="text-blue-500" />
              Ramal
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-900 font-semibold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
              value={formData.extension}
              onChange={(e) => setFormData({ ...formData, extension: e.target.value })}
              placeholder="Ex: 1234"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-2">
            <Mail size={12} className="text-blue-500" />
            E-mail
          </label>
          <input
            type="email"
            required
            className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-900 font-semibold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="seu@email.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-2">
            <Lock size={12} className="text-blue-500" />
            Senha
          </label>
          <input
            type="password"
            required
            className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-900 font-semibold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Crie uma senha forte"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-2">
            <Lock size={12} className="text-blue-500" />
            Confirmar Senha
          </label>
          <input
            type="password"
            required
            className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-slate-900 font-semibold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Repita a senha"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 mt-4"
        >
          <UserPlus size={20} />
          CRIAR CONTA
        </motion.button>
      </form>

      <div className="mt-8 text-center">
        <button 
          onClick={onSwitchToLogin}
          className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft size={16} />
          Voltar ao Login
        </button>
      </div>
    </motion.div>
  );
};

export default RegisterForm;
