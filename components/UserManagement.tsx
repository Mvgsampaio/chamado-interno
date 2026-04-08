
import React from 'react';
import { User, UserRole, AppConfig } from '@/types';
import { Shield, ShieldAlert, ShieldCheck, FileText, Key } from 'lucide-react';
import { pdfService } from '@/services/pdfService';

interface UserManagementProps {
  users: User[];
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onResetPassword: (userId: string, customPassword?: string) => void;
  appConfig: AppConfig;
  onUpdateConfig: (config: AppConfig) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ 
  users, 
  onUpdateUser, 
  onResetPassword,
  appConfig,
  onUpdateConfig
}) => {
  const [changingPasswordUser, setChangingPasswordUser] = React.useState<User | null>(null);
  const [newPassword, setNewPassword] = React.useState('');

  const toggleRole = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Prevent accidental lockout of all admins (simple check)
    if (user.username === 'admin' && user.role === UserRole.ADMIN) {
      alert('Não é possível remover o nível do administrador principal.');
      return;
    }

    onUpdateUser(userId, {
      role: user.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN
    });
  };

  const handleGenerateReport = () => {
    pdfService.generateUserReport(users);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changingPasswordUser || !newPassword) return;
    
    onResetPassword(changingPasswordUser.id, newPassword);
    setChangingPasswordUser(null);
    setNewPassword('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Controle de Permissões</h2>
          <p className="text-slate-500 font-medium">Defina os níveis de acesso dos colaboradores</p>
        </div>
        <button
          onClick={handleGenerateReport}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-sm"
        >
          <FileText size={16} className="text-blue-600" />
          Gerar Relatório de Acessos (PDF)
        </button>
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
                  <div className="flex items-center gap-2">
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
                    <button
                      onClick={() => setChangingPasswordUser(user)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100"
                      title="Alterar Senha"
                    >
                      <Key size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="max-w-2xl">
          <h4 className="font-black mb-2 flex items-center gap-2 text-sm uppercase tracking-widest text-blue-400">
            <Shield size={18} />
            Segurança do Sistema (2FA)
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            A autenticação de dois fatores adiciona uma camada extra de segurança. Quando ativada, todos os usuários deverão fornecer um código do autenticador após a senha.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Status Atual</span>
            <span className={`text-xs font-black uppercase tracking-widest flex items-center gap-1.5 ${appConfig.is2FAEnabled ? 'text-emerald-400' : 'text-red-400'}`}>
              {appConfig.is2FAEnabled ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
              {appConfig.is2FAEnabled ? 'Ativado' : 'Desativado'}
            </span>
          </div>
          <button
            onClick={() => onUpdateConfig({ ...appConfig, is2FAEnabled: !appConfig.is2FAEnabled })}
            className={`px-6 py-4 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all border ${
              appConfig.is2FAEnabled 
                ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20' 
                : 'bg-blue-500/10 border-blue-500/20 text-blue-500 hover:bg-blue-500/20'
            }`}
          >
            {appConfig.is2FAEnabled ? 'Desativar 2FA' : 'Ativar 2FA'}
          </button>
        </div>
      </div>

      {changingPasswordUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="p-8 border-b border-slate-100 bg-slate-50">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight text-slate-900">Alterar Senha</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Defina uma nova senha para {changingPasswordUser.name}</p>
            </div>
            <form onSubmit={handleChangePassword} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nova Senha</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    autoFocus
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-900"
                    placeholder="Digite a nova senha"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
                <p className="text-[9px] text-slate-400 font-medium italic">* O usuário será obrigado a trocar a senha no primeiro acesso por segurança.</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setChangingPasswordUser(null);
                    setNewPassword('');
                  }}
                  className="flex-1 px-6 py-4 border border-slate-200 text-slate-500 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-blue-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  Confirmar Alteração
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
