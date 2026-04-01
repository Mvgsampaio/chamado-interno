
import React, { useState } from 'react';
import { User, UserRole } from '@/types';
import { UserPlus, Search, Mail, Key, Trash2, Edit2, Phone } from 'lucide-react';

interface UserListProps {
  users: User[];
  onCreateUser: (user: User) => void;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
  onResetPassword: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onCreateUser, onUpdateUser, onDeleteUser, onResetPassword }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    extension: '',
    sector: 'Geral'
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.username || !newUser.email || !newUser.password) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const user: User = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      username: newUser.username.toLowerCase(),
      email: newUser.email.toLowerCase(),
      sector: newUser.sector,
      extension: newUser.extension,
      password: newUser.password,
      role: UserRole.USER,
      mustResetPassword: true
    };

    onCreateUser(user);
    setIsAdding(false);
    setNewUser({ name: '', username: '', email: '', password: '', extension: '', sector: 'Geral' });
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    onUpdateUser(editingUser.id, {
      name: editingUser.name,
      username: editingUser.username.toLowerCase(),
      email: editingUser.email.toLowerCase(),
      extension: editingUser.extension,
      sector: editingUser.sector
    });
    setEditingUser(null);
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
      onDeleteUser(userId);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.sector && u.sector.toLowerCase().includes(searchTerm.toLowerCase())) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
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
          placeholder="Buscar por nome, e-mail, login ou setor..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Modal de Cadastro */}
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
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  placeholder="Ex: João Silva"
                  value={newUser.name}
                  onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do login do usuário</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  placeholder="Ex: joao.silva"
                  value={newUser.username}
                  onChange={e => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
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
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ramal</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    placeholder="Ex: 1234"
                    value={newUser.extension}
                    onChange={e => setNewUser(prev => ({ ...prev, extension: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
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

      {/* Modal de Edição */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="p-8 border-b border-slate-100 bg-slate-50">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Editar Usuário</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Atualize os dados do colaborador</p>
            </div>
            <form onSubmit={handleUpdateUser} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  value={editingUser.name}
                  onChange={e => setEditingUser(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do login do usuário</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  value={editingUser.username}
                  onChange={e => setEditingUser(prev => prev ? ({ ...prev, username: e.target.value }) : null)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    value={editingUser.email}
                    onChange={e => setEditingUser(prev => prev ? ({ ...prev, email: e.target.value }) : null)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ramal</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    value={editingUser.extension || ''}
                    onChange={e => setEditingUser(prev => prev ? ({ ...prev, extension: e.target.value }) : null)}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-6 py-4 border border-slate-200 text-slate-500 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-blue-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  Salvar Alterações
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
              <th className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest">Ramal</th>
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
                    <Phone size={14} className="text-slate-400" />
                    {user.extension || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs font-black text-slate-900 uppercase">@{user.username}</div>
                  <div className="text-[10px] text-slate-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Editar Usuário"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onResetPassword(user.id)}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Resetar Senha"
                    >
                      <Key size={18} />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      title="Excluir Usuário"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
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
