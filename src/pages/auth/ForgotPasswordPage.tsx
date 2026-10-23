import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Por favor, informe seu e-mail cadastrado.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword(email);
      if (res.success) {
        setSent(true);
      } else {
        setError(res.error);
      }
    } catch {
      setError('Ocorreu um erro ao enviar instruções de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-surface text-on-surface">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-2 shadow-[0_0_16px_rgba(90,240,179,0.2)]">
            <span className="material-symbols-outlined text-2xl">lock_reset</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            Recuperação de Senha
          </h1>
          <p className="text-sm text-on-surface-variant">
            Enviaremos um link de redefinição para o seu e-mail.
          </p>
        </div>

        <div className="rounded-3xl bg-surface-container-low border border-outline-variant/60 p-6 md:p-8 shadow-2xl space-y-5">
          {sent ? (
            <div className="space-y-4 text-center py-3">
              <div className="inline-flex p-3 rounded-full bg-primary/15 text-primary border border-primary/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-on-surface">
                Verifique sua caixa de entrada
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Se existir uma conta associada a <strong className="text-primary">{email}</strong>,
                você receberá um e-mail com instruções seguras para criar uma nova senha.
              </p>
              <div className="pt-2">
                <Link to="/login">
                  <Button variant="secondary" size="sm" className="w-full">
                    Voltar ao Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-2xl bg-error/15 border border-error/30 text-xs text-error">
                  {error}
                </div>
              )}

              <Input
                label="E-mail cadastrado"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" className="w-full" isLoading={loading}>
                Enviar link de recuperação
              </Button>
            </form>
          )}

          <div className="pt-2 border-t border-outline-variant/40 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

