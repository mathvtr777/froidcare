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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-surface text-on-surface">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 text-primary font-bold text-xl mb-2 shadow-sm">
            F
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
            Froid Care
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mx-auto leading-relaxed">
            Seu refúgio seguro de autorregulação e acolhimento emocional.
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl bg-surface-container border border-outline-variant/40 p-6 md:p-8 shadow-xl space-y-5">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            Entrar na sua conta
          </h2>

          {error && (
            <div className="p-3 rounded-xl bg-error-container/30 border border-error/40 text-xs text-error">
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
                  className="text-xs text-primary hover:underline pt-1 font-medium"
                >
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2 font-semibold"
              isLoading={loading}
            >
              Entrar no aplicativo
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Demo quick access */}
          <div className="pt-2 border-t border-surface-container-high space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full text-xs text-on-surface-variant hover:text-on-surface border-outline-variant/60 hover:bg-surface-container-high"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary mr-1.5" />
              Entrar como Visitante (Acesso Imediato)
            </Button>
          </div>
        </div>

        {/* Sign up prompt */}
        <div className="text-center text-xs text-on-surface-variant">
          Ainda não tem uma conta?{' '}
          <Link
            to="/cadastro"
            className="text-primary hover:underline font-semibold"
          >
            Criar conta gratuita
          </Link>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-on-surface-variant text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Seus registros são estritamente confidenciais e protegidos por RLS.</span>
        </div>
      </div>
    </div>
  );
};
