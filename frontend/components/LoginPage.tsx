
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';
import { GoogleIcon } from './icons/GoogleIcon';
import { VMixIcon } from './icons/VMixIcon';

const LoginPage: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl">
        <div className="flex flex-col items-center">
          <VMixIcon className="w-16 h-16 text-blue-500" />
          <h2 className="mt-6 text-3xl font-bold text-center text-white">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Painel de Controle vMix
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <Button
            onClick={signInWithGoogle}
            className="w-full"
            variant="default"
          >
            <GoogleIcon className="w-5 h-5 mr-3" />
            Entrar com Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
