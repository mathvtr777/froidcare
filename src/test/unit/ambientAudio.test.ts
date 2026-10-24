import { describe, it, expect, beforeEach } from 'vitest';
import { ambientAudioService } from '../../services/ambientAudioService';

describe('Ambient Audio Service Unit Tests', () => {
  beforeEach(() => {
    ambientAudioService.stop();
  });

  it('handles sound state changes and mute transitions without throwing', () => {
    expect(() => {
      ambientAudioService.setSound('silence', true);
    }).not.toThrow();

    expect(() => {
      ambientAudioService.setMuted(true);
      ambientAudioService.setMuted(false);
    }).not.toThrow();

    expect(() => {
      ambientAudioService.stop();
    }).not.toThrow();
  });

  it('allows switching between soundscapes safely', () => {
    expect(() => {
      ambientAudioService.setSound('rain', true);
      ambientAudioService.setSound('waves', true);
      ambientAudioService.setSound('forest', true);
      ambientAudioService.setSound('silence', true);
    }).not.toThrow();
  });
});
