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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-charcoal-950">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
            Recuperação de Senha
          </h1>
          <p className="text-sm text-neutral-400">
            Enviaremos um link de redefinição para o seu e-mail.
          </p>
        </div>

        <div className="rounded-2xl bg-charcoal-900 border border-charcoal-800 p-6 md:p-8 shadow-xl space-y-5">
          {sent ? (
            <div className="space-y-4 text-center py-3">
              <div className="inline-flex p-3 rounded-full bg-sage-950 text-sage-400 border border-sage-800/80">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-neutral-100">
                Verifique sua caixa de entrada
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Se existir uma conta associada a <strong className="text-sage-300">{email}</strong>,
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
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300">
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

          <div className="pt-2 border-t border-charcoal-800 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200"
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

