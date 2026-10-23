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
      <div className="space-y-5 text-sm text-neutral-300">
        <div className="p-3.5 rounded-xl bg-charcoal-850 border border-charcoal-700/80 space-y-2">
          <div className="flex items-center gap-2 text-sage-400 font-medium">
            <HeartHandshake className="w-5 h-5 shrink-0" />
            <span>Você não precisa atravessar este momento sem suporte.</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            O Froid Care é uma ferramenta de autorregulação e autoconhecimento pessoal. Ele não substitui
            o atendimento médico, psicológico ou psiquiátrico, nem deve ser usado como única resposta
            em situações de crise aguda.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
            Canais Gratuitos de Atendimento Humano (Brasil)
          </h4>

          <div className="space-y-3">
            {EMERGENCY_CONTACTS.map((contact) => (
              <div
                key={contact.phone}
                className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-800 hover:border-charcoal-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-100">{contact.name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-sage-950/90 text-sage-300 text-xs font-mono font-bold border border-sage-800/60">
                      {contact.phone}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">{contact.description}</p>
                </div>

                <a
                  href={contact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-750 text-xs font-medium text-neutral-200 border border-charcoal-700 shrink-0 self-start sm:self-auto"
                >
                  {contact.phone.startsWith('1') ? (
                    <>
                      <PhoneCall className="w-3.5 h-3.5 text-sage-400" />
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

        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-neutral-300 space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Sintomas físicos e segurança médica</span>
          </div>
          <p className="text-neutral-400 leading-relaxed">
            Nem todo desconforto físico é ansiedade. Se você estiver sentindo dor aguda no peito,
            falta de ar repentina e grave, formigamento persistente em um dos lados do corpo ou perda
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

