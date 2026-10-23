import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { remindersService } from '../../services/remindersService';
import { recordsService } from '../../services/recordsService';
import { Reminder } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import {
  User,
  Bell,
  Sliders,
  Shield,
  Download,
  Trash2,
  LogOut,
  Check,
  Clock,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, signOut, updateDisplayName } = useAuth();
  const { updatePreferences, reducedMotion } = usePreferences();

  // Name state
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);

  // Reminders state
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminderTime, setNewReminderTime] = useState('20:00');
  const [newReminderDays] = useState<number[]>([1, 2, 3, 4, 5]); // Seg-Sex
  const [reminderSaving, setReminderSaving] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<string>('default');

  // Confirmation modals
  const [deleteRecordsModal, setDeleteRecordsModal] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [isDeletingRecords, setIsDeletingRecords] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name || '');
      loadReminders();
    }
    setNotificationPermission(remindersService.getNotificationPermission());
  }, [user]);

  const loadReminders = async () => {
    if (!user) return;
    try {
      const list = await remindersService.getReminders(user.id);
      setReminders(list);
    } catch (err) {
      console.warn('Erro ao carregar lembretes:', err);
    }
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameSaving(true);
    setNameSuccess(false);
    try {
      const res = await updateDisplayName(displayName);
      if (res.success) {
        setNameSuccess(true);
        setTimeout(() => setNameSuccess(false), 3000);
      }
    } finally {
      setNameSaving(false);
    }
  };

  const handleToggleReducedMotion = async () => {
    await updatePreferences({ reduced_motion: !reducedMotion });
  };

  const handleRequestNotification = async () => {
    const perm = await remindersService.requestNotificationPermission();
    setNotificationPermission(perm);
  };

  const handleAddReminder = async () => {
    if (!user) return;
    setReminderSaving(true);
    try {
      await remindersService.saveReminder(user.id, {
        time_of_day: newReminderTime,
        days_of_week: newReminderDays,
        is_enabled: true,
        label: 'Momento de check-in pessoal',
      });
      await loadReminders();
    } catch (err) {
      console.error('Erro ao adicionar lembrete:', err);
    } finally {
      setReminderSaving(false);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    if (!user) return;
    await remindersService.deleteReminder(user.id, id);
    await loadReminders();
  };

  const handleExportDataJson = async () => {
    if (!user) return;
    const res = await recordsService.fetchRecords(user.id);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `froid-care-export-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAllRecords = async () => {
    if (!user) return;
    setIsDeletingRecords(true);
    try {
      await recordsService.deleteAllRecords(user.id);
      setDeleteRecordsModal(false);
      setActionMessage('Todos os registros foram excluídos permanentemente.');
      setTimeout(() => setActionMessage(null), 4000);
    } finally {
      setIsDeletingRecords(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeletingAccount(true);
    try {
      await recordsService.deleteAllRecords(user.id);
      await signOut();
    } finally {
      setIsDeletingAccount(false);
      setDeleteAccountModal(false);
    }
  };

  const weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
          Configurações e Privacidade
        </h1>
        <p className="text-sm text-neutral-400">
          Gerencie seus dados pessoais, preferências de uso e controle total da sua conta.
        </p>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-sage-950/80 border border-sage-800 text-xs text-sage-300 font-medium">
          {actionMessage}
        </div>
      )}

      {/* 1. Account Profile */}
      <div className="p-5 md:p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-charcoal-800">
          <User className="w-5 h-5 text-sage-400" />
          <h2 className="text-base font-semibold text-neutral-100">Dados da Conta</h2>
        </div>

        <div className="text-xs text-neutral-400">
          <span className="block font-medium text-neutral-300">E-mail associado:</span>
          <span className="text-neutral-200 font-mono">{user?.email || 'Visitante local'}</span>
        </div>

        <form onSubmit={handleSaveName} className="space-y-3 max-w-md pt-1">
          <Input
            label="Como deseja ser chamado(a)?"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            helperText="Este nome é exibido na saudação inicial e nos cabeçalhos de relatórios."
          />

          <div className="flex items-center gap-3">
            <Button size="sm" type="submit" isLoading={nameSaving}>
              Salvar alteração
            </Button>
            {nameSuccess && (
              <span className="inline-flex items-center gap-1 text-xs text-sage-400 font-medium">
                <Check className="w-4 h-4" /> Nome atualizado com sucesso
              </span>
            )}
          </div>
        </form>
      </div>

      {/* 2. Interface Preferences */}
      <div className="p-5 md:p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-charcoal-800">
          <Sliders className="w-5 h-5 text-sage-400" />
          <h2 className="text-base font-semibold text-neutral-100">Preferências de Interface</h2>
        </div>

        <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-charcoal-850 border border-charcoal-800">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-neutral-200 block">
              Reduzir movimentos e animações visuais
            </span>
            <span className="text-[11px] text-neutral-400 block">
              Desativa animações de respiração e transições para quem prefere uma interface estática.
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={reducedMotion}
            onClick={handleToggleReducedMotion}
            className={`w-11 h-6 rounded-full transition-colors p-0.5 focus:outline-none shrink-0 ${
              reducedMotion ? 'bg-sage-600' : 'bg-charcoal-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                reducedMotion ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 3. Gentle Reminders */}
      <div className="p-5 md:p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-charcoal-800">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-sage-400" />
            <h2 className="text-base font-semibold text-neutral-100">Lembretes Pessoais Opcionais</h2>
          </div>

          {notificationPermission !== 'granted' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRequestNotification}
              className="text-xs"
            >
              Habilitar no navegador
            </Button>
          )}
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed">
          Defina horários convenientes para um momento de pausa. O Froid Care não envia mensagens
          insistentes nem expõe seu estado emocional em telas bloqueadas.
        </p>

        {/* Existing reminders list */}
        {reminders.length > 0 && (
          <div className="space-y-2">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="p-3 rounded-xl bg-charcoal-850 border border-charcoal-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-sage-400" />
                  <div>
                    <span className="text-xs font-semibold text-neutral-200">{rem.time_of_day}</span>
                    <span className="text-[11px] text-neutral-400 ml-2">
                      ({rem.days_of_week.map((d) => weekdayLabels[d]).join(', ')})
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteReminder(rem.id)}
                  className="text-xs text-rose-400 hover:text-rose-300"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add reminder controls */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Horário:</span>
            <input
              type="time"
              value={newReminderTime}
              onChange={(e) => setNewReminderTime(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-charcoal-950 border border-charcoal-800 text-xs text-neutral-200"
            />
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleAddReminder}
            isLoading={reminderSaving}
          >
            Adicionar lembrete
          </Button>
        </div>
      </div>

      {/* 4. Data Control & LGPD */}
      <div className="p-5 md:p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-charcoal-800">
          <Shield className="w-5 h-5 text-sage-400" />
          <h2 className="text-base font-semibold text-neutral-100">
            Privacidade, Dados e LGPD
          </h2>
        </div>

        <div className="p-3.5 rounded-xl bg-charcoal-850 border border-charcoal-750 text-xs text-neutral-300 space-y-2 leading-relaxed">
          <p className="font-semibold text-neutral-200">
            Seus direitos como titular de dados:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-neutral-400">
            <li>Seus registros pertencem exclusivamente a você e não são utilizados para publicidade.</li>
            <li>No banco de dados Supabase, todas as tabelas utilizam Row Level Security (RLS) estrito.</li>
            <li>Você pode exportar integralmente seu histórico a qualquer momento em formato aberto (JSON).</li>
            <li>Você tem o direito de apagar todos os registros ou excluir sua conta de forma irrevogável.</li>
          </ul>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportDataJson}
          >
            <Download className="w-4 h-4 mr-1.5" />
            Exportar Meus Dados (JSON)
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteRecordsModal(true)}
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Excluir Todos os Registros
          </Button>
        </div>
      </div>

      {/* 5. Account Sign Out & Deletion */}
      <div className="p-5 md:p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-200">
            Sessão e Encerramento
          </h3>
          <p className="text-xs text-neutral-400">
            Desconectar deste dispositivo ou encerrar permanentemente sua conta.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="text-neutral-300 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Sair da Conta
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteAccountModal(true)}
          >
            Excluir Conta
          </Button>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmDialog
        isOpen={deleteRecordsModal}
        onClose={() => setDeleteRecordsModal(false)}
        onConfirm={handleDeleteAllRecords}
        title="Excluir TODOS os registros emocionais?"
        message="Esta ação apagará permanentemente todos os seus check-ins, anotações e reflexões salvas. O histórico não poderá ser recuperado."
        confirmLabel="Sim, apagar tudo"
        cancelLabel="Cancelar e voltar"
        isDestructive
        isLoading={isDeletingRecords}
      />

      <ConfirmDialog
        isOpen={deleteAccountModal}
        onClose={() => setDeleteAccountModal(false)}
        onConfirm={handleDeleteAccount}
        title="Excluir permanentemente sua conta?"
        message="Sua conta, dados de perfil, preferências e todos os registros serão apagados permanentemente de acordo com as diretrizes da LGPD."
        confirmLabel="Confirmar exclusão da conta"
        cancelLabel="Cancelar"
        isDestructive
        isLoading={isDeletingAccount}
      />
    </div>
  );
};
