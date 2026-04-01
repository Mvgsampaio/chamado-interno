
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from '@/services/storage';
import { User } from '@/types';
import { ShieldCheck, Lock, User as UserIcon, ArrowRight, RefreshCw, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// Declare the custom element for TypeScript
declare module 'react' {
  interface IntrinsicElements {
    'dotlottie-wc': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { src?: string; autoplay?: boolean; loop?: boolean }, HTMLElement>;
  }
}

interface LoginFormProps {
  onLogin: (user: User) => void;
  is2FAEnabled: boolean;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, is2FAEnabled, onSwitchToRegister }) => {
  const [step, setStep] = useState<'login' | '2fa-setup' | '2fa-verify'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempUser, setTempUser] = useState<User | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate a small delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = await storage.login(identifier, password);

    if (user) {
      if (is2FAEnabled) {
        setTempUser(user);
        setStep('2fa-setup');
        setIsSubmitting(false);
      } else {
        onLogin(user);
      }
    } else {
      alert('Dados de acesso inválidos. Verifique as informações e tente novamente.');
      setIsSubmitting(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate 2FA verification
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (twoFactorCode === '123456' || twoFactorCode === '000000') { // Mock codes
      if (tempUser) {
        onLogin(tempUser);
      }
    } else {
      alert('Código 2FA inválido. Tente 123456.');
      setIsSubmitting(false);
    }
  };

  // Mock OTP URI for the QR Code
  const otpUri = tempUser ? `otpauth://totp/ChamadosInternos:${tempUser.email}?secret=JBSWY3DPEHPK3PXP&issuer=ChamadosInternos` : '';
  const secretKey = "JBSWY3DPEHPK3PXP";

  return (
    <div className="fixed inset-0 bg-slate-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="w-full h-full sm:h-auto sm:max-w-md bg-white sm:rounded-3xl shadow-none sm:shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden border-0 sm:border sm:border-slate-100 flex flex-col">
        <div className="bg-blue-600 p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden shrink-0">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-[140px] h-[140px] sm:w-[180px] sm:h-[180px]">
              <dotlottie-wc 
                src="https://lottie.host/75ae25b4-d4a8-4aa6-a262-23cdadf8cc52/ayuQZbA1aG.lottie" 
                style={{ width: '100%', height: '100%' }} 
                autoplay 
                loop 
              />
            </div>
            <h1 className="text-white text-xl sm:text-2xl font-bold mt-2 text-center">Segurança Ativa</h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 text-center">Protegendo seus dados corporativos</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 flex-grow overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 'login' && (
              <motion.div
                key="login-step"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleLoginSubmit} className="space-y-4 sm:space-y-5">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <UserIcon size={14} className="text-blue-600 sm:w-4 sm:h-4" />
                      Usuário ou E-mail
                    </label>
                    <input
                      type="text"
                      placeholder="Seu usuário"
                      className="w-full p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium text-sm sm:text-base"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Lock size={14} className="text-blue-600 sm:w-4 sm:h-4" />
                      Senha
                    </label>
                    <input
                      type="password"
                      placeholder="Sua senha"
                      className="w-full p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium text-sm sm:text-base"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm sm:text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <RefreshCw size={18} className="animate-spin sm:w-5 sm:h-5" />
                    ) : (
                      <>
                        Entrar
                        <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
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
              </motion.div>
            )}

            {step === '2fa-setup' && (
              <motion.div
                key="2fa-setup-step"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <QrCode size={20} className="text-blue-600 sm:w-6 sm:h-6" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">Configurar 2FA</h2>
                  <p className="text-slate-500 text-[10px] sm:text-sm mt-1 px-2">Escaneie o QR Code abaixo no seu app de autenticação (Google Authenticator, Authy, etc.)</p>
                </div>

                <div className="p-3 sm:p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm mb-3 sm:mb-4">
                  <div className="w-[120px] h-[120px] sm:w-[160px] sm:h-[160px]">
                    <QRCodeSVG value={otpUri} style={{ width: '100%', height: '100%' }} />
                  </div>
                </div>

                <div className="text-center mb-4 sm:mb-6">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Chave Manual</p>
                  <code className="bg-slate-100 px-2 sm:px-3 py-1 rounded text-blue-600 font-mono text-xs sm:text-sm font-bold break-all">{secretKey}</code>
                </div>

                <button
                  onClick={() => setStep('2fa-verify')}
                  className="w-full py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Já escaneei, continuar
                  <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                </button>
                
                <button
                  onClick={() => setStep('login')}
                  className="mt-3 sm:mt-4 text-slate-400 hover:text-slate-600 font-semibold text-xs sm:text-sm transition-colors"
                >
                  Voltar ao login
                </button>
              </motion.div>
            )}

            {step === '2fa-verify' && (
              <motion.div
                key="2fa-verify-step"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <ShieldCheck size={20} className="text-blue-600 sm:w-6 sm:h-6" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">Verificar Código</h2>
                  <p className="text-slate-500 text-[10px] sm:text-sm mt-1 px-2">Insira o código de 6 dígitos gerado pelo seu aplicativo</p>
                </div>

                <form onSubmit={handle2FASubmit} className="w-full space-y-4 sm:space-y-5">
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      className="w-full p-3.5 sm:p-4 text-center text-2xl sm:text-3xl tracking-[0.3em] sm:tracking-[0.5em] rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-bold"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                      disabled={isSubmitting}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="flex flex-col gap-2 sm:gap-3">
                    <button
                      type="submit"
                      className="w-full py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm sm:text-base"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <RefreshCw size={18} className="animate-spin sm:w-5 sm:h-5" />
                      ) : (
                        <>
                          Validar Acesso
                          <ShieldCheck size={18} className="sm:w-5 sm:h-5" />
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setStep('2fa-setup')}
                      className="w-full py-2 text-slate-400 hover:text-slate-600 font-semibold text-xs sm:text-sm transition-colors"
                      disabled={isSubmitting}
                    >
                      Ver QR Code novamente
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
