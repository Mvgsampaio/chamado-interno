
import React from 'react';
import { User, UserRole } from '@/types';

interface UserManagementProps {
  users: User[];
  onUpdateUsers: (users: User[]) => void;
  onGenerateMocks: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onUpdateUsers, onGenerateMocks }) => {
  const toggleRole = (userId: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        // Prevent accidental lockout of all admins (simple check)
        if (u.username === 'admin' && u.role === UserRole.ADMIN) {
          alert('Não é possível remover o nível do administrador principal.');
          return u;
        }
        return {
          ...u,
          role: u.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN
        };
      }
      return u;
    });
    onUpdateUsers(updatedUsers);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Controle de Permissões</h2>
          <p className="text-slate-500 font-medium">Defina os níveis de acesso dos colaboradores</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest">Colaborador</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest">Login / E-mail</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest">Nível de Acesso</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white text-[10px]">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-slate-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs font-black text-slate-900 uppercase">@{user.username}</div>
                  <div className="text-[10px] text-slate-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    user.role === UserRole.ADMIN ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleRole(user.id)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${
                      user.role === UserRole.ADMIN 
                        ? 'text-slate-500 border-slate-200 hover:bg-slate-50' 
                        : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    {user.role === UserRole.ADMIN ? 'Remover Admin' : 'Promover Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="max-w-2xl">
          <h4 className="font-black mb-2 flex items-center gap-2 text-sm uppercase tracking-widest text-blue-400">
            <i className="fas fa-shield-alt"></i>
            Ferramentas de Desenvolvedor / Admin
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Administradores podem gerenciar o banco de dados local. Utilize o botão ao lado para preencher o sistema com chamados fictícios 
            e testar o comportamento dos filtros, status e relatórios gerenciais em larga escala.
          </p>
        </div>
        <button
          onClick={onGenerateMocks}
          className="whitespace-nowrap px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all"
        >
          <i className="fas fa-magic mr-2"></i>
          Gerar 20 Chamados de Teste
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
