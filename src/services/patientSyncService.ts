import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from './firebase';
import { PatientSession, ScaleResult } from '../types';

export interface PatientCloudRecord {
  prontuario: string;
  name?: string;
  age?: number;
  scaleHistory: ScaleResult[];
  lastUpdated: string;
  consultationsCount?: number;
}

/**
 * Sanitizes medical record number / prontuário to ensure valid document ID:
 * Alphanumeric, hyphen, underscore, period only, trimmed and max 64 chars.
 */
export function sanitizeProntuarioKey(prontuario: string): string {
  if (!prontuario) return '';
  return prontuario.trim().replace(/[^a-zA-Z0-9_\-\.]/g, '_').slice(0, 64);
}

/**
 * Fetch longitudinal scale history and patient profile silently from Firestore.
 */
export async function fetchPatientCloudHistory(prontuario: string): Promise<PatientCloudRecord | null> {
  const docKey = sanitizeProntuarioKey(prontuario);
  if (!docKey) return null;

  const docPath = `patients/${docKey}`;
  try {
    const docRef = doc(db, 'patients', docKey);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return null;
    }
    const data = snap.data() as PatientCloudRecord;
    return {
      prontuario: data.prontuario || prontuario,
      name: data.name || '',
      age: data.age,
      scaleHistory: Array.isArray(data.scaleHistory) ? data.scaleHistory : [],
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      consultationsCount: data.consultationsCount || (Array.isArray(data.scaleHistory) ? data.scaleHistory.length : 0),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
    return null;
  }
}

/**
 * Silently saves/syncs patient scale history to Firestore without disturbing the clinical flow.
 */
export async function syncPatientToCloud(
  patient: PatientSession,
  history: ScaleResult[]
): Promise<boolean> {
  const docKey = sanitizeProntuarioKey(patient.prontuario);
  if (!docKey) return false;

  // Don't sync demo test patients to the cloud to preserve clean database
  if (patient.isDemo || patient.prontuario.toLowerCase().includes('demo')) {
    return false;
  }

  const docPath = `patients/${docKey}`;
  const payload: PatientCloudRecord = {
    prontuario: patient.prontuario.slice(0, 64),
    name: (patient.name || '').slice(0, 128),
    age: typeof patient.age === 'number' && !isNaN(patient.age) ? Math.min(Math.max(patient.age, 0), 130) : 0,
    scaleHistory: history.slice(0, 300), // Protect against unbounded payload
    lastUpdated: new Date().toISOString(),
    consultationsCount: history.length,
  };

  try {
    const docRef = doc(db, 'patients', docKey);
    await setDoc(docRef, payload, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
    return false;
  }
}
