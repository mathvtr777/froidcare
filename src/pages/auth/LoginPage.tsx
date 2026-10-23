import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Por favor, informe seu e-mail e senha.');
      return;
    }

    setLoading(true);
    try {
      const res = await signIn(email, password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.error);
      }
    } catch {
      setError('Ocorreu um erro ao entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await signIn('visitante@froidcare.com', 'demo123');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-charcoal-950">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sage-950 border border-sage-800/80 mb-2">
            <span className="text-sage-400 font-bold text-xl">F</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
            Froid Care
          </h1>
          <p className="text-sm text-neutral-400">
            Seu espaço discreto de autorregulação e acolhimento emocional.
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl bg-charcoal-900 border border-charcoal-800 p-6 md:p-8 shadow-xl space-y-5">
          <h2 className="text-lg font-semibold text-neutral-200">
            Entrar na sua conta
          </h2>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <div className="space-y-1">
              <Input
                label="Senha"
                type="password"
                placeholder="Sua senha de acesso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <div className="flex justify-end">
                <Link
                  to="/recuperar-senha"
                  className="text-xs text-sage-400 hover:text-sage-300 hover:underline pt-1"
                >
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={loading}
            >
              Entrar no aplicativo
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Demo quick access if running in demo mode or for quick evaluation */}
          <div className="pt-2 border-t border-charcoal-800 space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full text-xs text-neutral-300 border-charcoal-700 hover:bg-charcoal-800"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              <Sparkles className="w-3.5 h-3.5 text-sage-400 mr-1.5" />
              Entrar como Visitante (Acesso Imediato)
            </Button>
          </div>
        </div>

        {/* Sign up prompt */}
        <div className="text-center text-xs text-neutral-400">
          Ainda não tem uma conta?{' '}
          <Link
            to="/cadastro"
            className="text-sage-400 hover:text-sage-300 font-medium hover:underline"
          >
            Criar conta gratuita
          </Link>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-sage-600" />
          <span>Seus registros são estritamente confidenciais e protegidos por RLS.</span>
        </div>
      </div>
    </div>
  );
};
