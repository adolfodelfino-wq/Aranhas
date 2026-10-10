import { describe, it, expect } from 'vitest';
import { sanitizeProntuarioKey } from '../services/patientSyncService';

describe('patientSyncService sanitizeProntuarioKey', () => {
  it('sanitizes special characters and trims medical record key', () => {
    expect(sanitizeProntuarioKey(' 482019-2 ')).toBe('482019-2');
    expect(sanitizeProntuarioKey('SUS/123.456@ABC')).toBe('SUS_123.456_ABC');
  });

  it('handles empty strings gracefully', () => {
    expect(sanitizeProntuarioKey('')).toBe('');
    expect(sanitizeProntuarioKey('   ')).toBe('');
  });

  it('limits key length to 64 chars', () => {
    const longKey = 'A'.repeat(100);
    expect(sanitizeProntuarioKey(longKey).length).toBe(64);
  });
});
