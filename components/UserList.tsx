
import React, { useState } from 'react';
import { User, UserRole } from '@/types';
import { UserPlus, Search, Building2, Mail, Key, Trash2 } from 'lucide-react';

interface UserListProps {
  users: User[];
  onUpdateUsers: (users: User[]) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onUpdateUsers }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    sector: '',
    email: '',
    password: ''
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.sector || !newUser.email || !newUser.password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const username = newUser.email.split('@')[0].toLowerCase();
    
    const user: User = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      sector: newUser.sector,
      email: newUser.email,
      username: username,
      password: newUser.password,
      role: UserRole.USER,
      mustResetPassword: true
    };

    onUpdateUsers([...users, user]);
    setIsAdding(false);
    setNewUser({ name: '', sector: '', email: '', password: '' });
  };

  const generateDefaultPassword = () => {
    setNewUser(prev => ({ ...prev, password: '123@abc' }));
  };

  const deleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.username === 'admin') {
      alert('Não é possível excluir o administrador principal.');
      return;
    }
    
    if (confirm(`Tem certeza que deseja excluir o usuário ${user?.name}?`)) {
      onUpdateUsers(users.filter(u => u.id !== userId));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Gestão de Usuários</h2>
          <p className="text-slate-500 font-medium">Cadastre e gerencie os colaboradores do sistema</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
        >
          <UserPlus size={16} />
          Novo Usuário
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Buscar por nome, e-mail ou setor..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="p-8 border-b border-slate-100 bg-slate-50">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Cadastrar Novo Usuário</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Preencha os dados do colaborador</p>
            </div>
            <form onSubmit={handleCreateUser} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="Ex: João Silva"
                    value={newUser.name}
                    onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Setor</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="Ex: TI, RH, Financeiro"
                    value={newUser.sector}
                    onChange={e => setNewUser(prev => ({ ...prev, sector: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="email@empresa.com.br"
                    value={newUser.email}
                    onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha Provisória</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                      placeholder="Senha"
                      value={newUser.password}
                      onChange={e => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={generateDefaultPassword}
                    className="px-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                    title="Gerar senha padrão: 123@abc"
                  >
                    Padrão
                  </button>
                </div>
                <p className="text-[9px] text-slate-400 font-medium italic">* O usuário será obrigado a trocar a senha no primeiro acesso.</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 px-6 py-4 border border-slate-200 text-slate-500 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-blue-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  Criar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest">Colaborador</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest">Setor</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest">Login / E-mail</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white text-[10px]">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{user.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{user.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Building2 size={14} className="text-slate-400" />
                    {user.sector}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs font-black text-slate-900 uppercase">@{user.username}</div>
                  <div className="text-[10px] text-slate-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    title="Excluir Usuário"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
