import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { remindersService } from '../../services/remindersService';
import { recordsService } from '../../services/recordsService';
import { Reminder } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Check } from 'lucide-react';

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
        days_of_week: [1, 2, 3, 4, 5],
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
    <div className="flex flex-col w-full pb-8 space-y-6">
      {/* Header */}
      <div className="pt-1">
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
          Configurações e Privacidade
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          Gerencie seus dados pessoais, preferências de uso e controle total da sua conta.
        </p>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-primary-container/20 border border-primary/30 text-xs text-primary font-semibold">
          {actionMessage}
        </div>
      )}

      {/* 1. Account Profile */}
      <div className="p-space-md rounded-2xl bg-surface-container border border-outline-variant/40 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5 pb-2 border-b border-surface-container-high/60">
          <span className="material-symbols-outlined text-[22px] text-primary">person</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Dados da Conta</h2>
        </div>

        <div className="text-xs text-on-surface-variant">
          <span className="block font-semibold text-on-surface">E-mail associado:</span>
          <span className="text-primary font-mono text-xs">{user?.email || 'Visitante local'}</span>
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
              <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold">
                <Check className="w-4 h-4" /> Nome atualizado com sucesso
              </span>
            )}
          </div>
        </form>
      </div>

      {/* 2. Interface Preferences */}
      <div className="p-space-md rounded-2xl bg-surface-container border border-outline-variant/40 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5 pb-2 border-b border-surface-container-high/60">
          <span className="material-symbols-outlined text-[22px] text-primary">tune</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Preferências de Interface</h2>
        </div>

        <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-on-surface block">
              Reduzir movimentos e animações visuais
            </span>
            <span className="text-[11px] text-on-surface-variant block leading-relaxed">
              Desativa animações de respiração e transições para quem prefere uma interface estática.
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={reducedMotion}
            onClick={handleToggleReducedMotion}
            className={`w-11 h-6 rounded-full transition-colors p-0.5 focus:outline-none shrink-0 ${
              reducedMotion ? 'bg-primary' : 'bg-surface-container-highest'
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
      <div className="p-space-md rounded-2xl bg-surface-container border border-outline-variant/40 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[22px] text-primary">notifications</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Lembretes Pessoais Opcionais</h2>
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

        <p className="text-xs text-on-surface-variant leading-relaxed">
          Defina horários convenientes para um momento de pausa. O Froid Care não envia notificações
          insistentes nem expõe seu estado emocional em telas bloqueadas.
        </p>

        {/* Existing reminders */}
        {reminders.length > 0 && (
          <div className="space-y-2">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                  <div>
                    <span className="text-xs font-semibold text-on-surface font-mono">{rem.time_of_day}</span>
                    <span className="text-[11px] text-on-surface-variant ml-2">
                      ({rem.days_of_week.map((d) => weekdayLabels[d]).join(', ')})
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteReminder(rem.id)}
                  className="text-xs text-error hover:underline font-semibold"
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
            <span className="text-xs text-on-surface-variant font-semibold">Horário:</span>
            <input
              type="time"
              value={newReminderTime}
              onChange={(e) => setNewReminderTime(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface border border-outline-variant/40 text-xs font-mono"
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
      <div className="p-space-md rounded-2xl bg-surface-container border border-outline-variant/40 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5 pb-2 border-b border-surface-container-high/60">
          <span className="material-symbols-outlined text-[22px] text-primary">verified_user</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            Privacidade, Dados e LGPD
          </h2>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface space-y-2 leading-relaxed">
          <p className="font-semibold text-primary">
            Seus direitos como titular de dados:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-on-surface-variant">
            <li>Seus registros pertencem exclusivamente a você e não são comercializados ou usados para anúncios.</li>
            <li>No banco de dados Supabase, todas as tabelas contam com Row Level Security (RLS) estrito.</li>
            <li>Você pode exportar integralmente seus dados a qualquer momento em formato aberto (JSON).</li>
            <li>Você tem o direito de apagar todos os registros ou solicitar a exclusão total da conta.</li>
          </ul>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportDataJson}
          >
            <span className="material-symbols-outlined text-[18px] mr-1.5 text-primary">download</span>
            Exportar Meus Dados (JSON)
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteRecordsModal(true)}
          >
            <span className="material-symbols-outlined text-[18px] mr-1.5">delete_forever</span>
            Excluir Todos os Registros
          </Button>
        </div>
      </div>

      {/* 5. Account Sign Out & Deletion */}
      <div className="p-space-md rounded-2xl bg-surface-container border border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="font-label-lg text-label-lg text-on-surface font-semibold">
            Sessão e Encerramento
          </h3>
          <p className="text-xs text-on-surface-variant">
            Desconectar deste dispositivo ou encerrar permanentemente sua conta.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
          >
            <span className="material-symbols-outlined text-[18px] mr-1.5">logout</span>
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

      {/* Modals */}
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
