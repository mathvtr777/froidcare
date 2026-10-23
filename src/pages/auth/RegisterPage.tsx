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
            Cadastre-se para iniciar seu acompanhamento pessoal.
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl bg-charcoal-900 border border-charcoal-800 p-6 md:p-8 shadow-xl space-y-5">
          <h2 className="text-lg font-semibold text-neutral-200">
            Criar conta
          </h2>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Como deseja ser chamado(a)? (opcional)"
              placeholder="Ex: Matheus"
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
              className="w-full mt-2"
              isLoading={loading}
            >
              Criar conta e continuar
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </div>

        {/* Login prompt */}
        <div className="text-center text-xs text-neutral-400">
          Já possui cadastro?{' '}
          <Link
            to="/login"
            className="text-sage-400 hover:text-sage-300 font-medium hover:underline"
          >
            Acessar conta existente
          </Link>
        </div>

        {/* Minimal privacy notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-sage-600" />
          <span>Privacidade por padrão: não exigimos histórico de saúde nem dados clínicos.</span>
        </div>
      </div>
    </div>
  );
};

