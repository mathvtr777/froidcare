import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../components/ui/Button';
import { IntensitySlider } from '../../components/ui/Slider';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { UrgentHelpModal } from '../../components/safety/UrgentHelpModal';

describe('UI Components Tests', () => {
  it('renders Button and triggers onClick handler', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Ação de Teste</Button>);

    const btn = screen.getByRole('button', { name: /ação de teste/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders IntensitySlider with value and accessible textual description', () => {
    const handleChange = vi.fn();
    render(<IntensitySlider value={5} onChange={handleChange} />);

    expect(screen.getByText(/Nível 5 \/ 10/i)).toBeInTheDocument();
    expect(screen.getByText(/5 — Moderada/i)).toBeInTheDocument();
  });

  it('renders ConfirmDialog and responds to cancel and confirm buttons', () => {
    const handleClose = vi.fn();
    const handleConfirm = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Deseja continuar?"
        message="Esta é uma mensagem de confirmação importante."
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
      />
    );

    expect(screen.getByText('Deseja continuar?')).toBeInTheDocument();
    expect(screen.getByText('Esta é uma mensagem de confirmação importante.')).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const confirmBtn = screen.getByRole('button', { name: /confirmar/i });
    fireEvent.click(confirmBtn);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('renders UrgentHelpModal with CVV 188 and SAMU 192 information', () => {
    const handleClose = vi.fn();
    render(<UrgentHelpModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByText(/Apoio e Orientação em Momentos Críticos/i)).toBeInTheDocument();
    expect(screen.getByText(/CVV — Centro de Valorização da Vida/i)).toBeInTheDocument();
    expect(screen.getByText('188')).toBeInTheDocument();
    expect(screen.getByText(/SAMU — Serviço de Atendimento Móvel de Urgência/i)).toBeInTheDocument();
    expect(screen.getByText('192')).toBeInTheDocument();
  });
});
