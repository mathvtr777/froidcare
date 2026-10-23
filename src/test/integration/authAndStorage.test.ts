import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '../../services/authService';

describe('Auth & Session Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('signs up a new user and creates session', async () => {
    const res = await authService.signUp('novo.usuario@froidcare.com', 'senhaSegura123', 'Usuário Teste');

    expect(res.error).toBeNull();
    expect(res.user).toBeDefined();
    expect(res.user?.email).toBe('novo.usuario@froidcare.com');
    expect(res.user?.display_name).toBe('Usuário Teste');

    const sessionUser = await authService.getSessionUser();
    expect(sessionUser?.id).toBe(res.user?.id);
  });

  it('updates display name successfully', async () => {
    const res = await authService.signUp('teste@froidcare.com', 'senha123', 'Nome Inicial');
    expect(res.user).toBeDefined();

    const updateRes = await authService.updateDisplayName(res.user!.id, 'Novo Nome');
    expect(updateRes.success).toBe(true);

    const updatedUser = await authService.getSessionUser();
    expect(updatedUser?.display_name).toBe('Novo Nome');
  });

  it('signs out and clears user session', async () => {
    await authService.signUp('logout.teste@froidcare.com', 'senha123', 'Logout Test');
    let sessionUser = await authService.getSessionUser();
    expect(sessionUser).not.toBeNull();

    await authService.signOut();
    sessionUser = await authService.getSessionUser();
    expect(sessionUser).toBeNull();
  });
});
