import React from 'react';
import { Modal } from '../ui/Modal';
import { EMERGENCY_CONTACTS } from '../../constants';
import { PhoneCall, ShieldAlert, HeartHandshake, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';

export interface UrgentHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UrgentHelpModal: React.FC<UrgentHelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apoio e Orientação em Momentos Críticos"
      maxWidth="lg"
    >
      <div className="space-y-5 text-sm text-on-surface">
        <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-2">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <HeartHandshake className="w-5 h-5 shrink-0" />
            <span>Você não precisa atravessar este momento sem suporte.</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            O Froid Care é uma ferramenta de autorregulação e autoconhecimento pessoal. Ele não substitui
            o atendimento médico, psicológico ou psiquiátrico, nem deve ser usado como única resposta
            em situações de sofrimento intenso agudo.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
            Canais Gratuitos de Atendimento Humano (Brasil)
          </h4>

          <div className="space-y-3">
            {EMERGENCY_CONTACTS.map((contact) => (
              <div
                key={contact.phone}
                className="p-4 rounded-2xl bg-surface-container border border-outline-variant/60 hover:bg-surface-container-high transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-on-surface">{contact.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary text-xs font-mono font-bold border border-tertiary/30">
                      {contact.phone}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">{contact.description}</p>
                </div>

                <a
                  href={contact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-highest hover:bg-primary hover:text-on-primary text-xs font-semibold text-on-surface shrink-0 self-start sm:self-auto transition-all"
                >
                  {contact.phone.startsWith('1') ? (
                    <>
                      <PhoneCall className="w-3.5 h-3.5 text-primary" />
                      Ligar {contact.phone}
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5" />
                      Ver orientações
                    </>
                  )}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-tertiary-container/10 border border-tertiary/30 text-xs text-on-surface space-y-1.5">
          <div className="flex items-center gap-1.5 text-tertiary font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Sintomas físicos e segurança médica</span>
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            Nem todo desconforto físico é ansiedade. Se você estiver sentindo dor aguda no peito,
            falta de ar súbita, formigamento persistente em um dos lados do corpo ou perda
            de consciência, busque imediatamente atendimento médico de urgência (SAMU 192 ou pronto-socorro).
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Entendido, voltar ao aplicativo
          </Button>
        </div>
      </div>
    </Modal>
  );
};
