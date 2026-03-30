
import React from 'react';
import { User, UserRole, AppConfig } from '@/types';
import { Shield, ShieldAlert, ShieldCheck, FileText, Key } from 'lucide-react';
import { pdfService } from '@/services/pdfService';

interface UserManagementProps {
  users: User[];
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onResetPassword: (userId: string) => void;
  onGenerateMocks: () => void;
  appConfig: AppConfig;
  onUpdateConfig: (config: AppConfig) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ 
  users, 
  onUpdateUser, 
  onResetPassword,
  onGenerateMocks,
  appConfig,
  onUpdateConfig
}) => {
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
                      onClick={() => onResetPassword(user.id)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100"
                      title="Resetar Senha"
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

      <div className="bg-slate-800 p-8 rounded-2xl text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="max-w-2xl">
          <h4 className="font-black mb-2 flex items-center gap-2 text-sm uppercase tracking-widest text-blue-400">
            <i className="fas fa-magic"></i>
            Ferramentas de Desenvolvedor
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
