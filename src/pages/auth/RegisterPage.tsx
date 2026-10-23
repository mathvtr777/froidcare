import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const res = await signUp(email, password, displayName);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.error);
      }
    } catch {
      setError('Ocorreu um erro ao criar a conta. Tente novamente.');
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
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Cadastre-se para iniciar seu refúgio de acolhimento pessoal.
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl bg-surface-container border border-outline-variant/40 p-6 md:p-8 shadow-xl space-y-5">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            Criar conta
          </h2>

          {error && (
            <div className="p-3 rounded-xl bg-error-container/30 border border-error/40 text-xs text-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Como deseja ser chamado(a)? (opcional)"
              placeholder="Ex: Matheus ou apelido"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              helperText="Usado apenas para saudações discretas no aplicativo."
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              label="Senha (mínimo de 6 caracteres)"
              type="password"
              placeholder="Crie uma senha segura"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <Input
              label="Confirmação da senha"
              type="password"
              placeholder="Digite a mesma senha novamente"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              className="w-full mt-2 font-semibold"
              isLoading={loading}
            >
              Criar conta e continuar
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </div>

        {/* Login prompt */}
        <div className="text-center text-xs text-on-surface-variant">
          Já possui cadastro?{' '}
          <Link
            to="/login"
            className="text-primary hover:underline font-semibold"
          >
            Acessar conta existente
          </Link>
        </div>

        {/* Minimal privacy notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-on-surface-variant text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Privacidade por padrão: não exigimos dados clínicos ou diagnósticos.</span>
        </div>
      </div>
    </div>
  );
};
