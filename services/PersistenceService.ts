/**
 * SIGNET PERSISTENCE SERVICE
 * Handles local-only storage of identity seeds using IndexedDB.
 * Compliant with Same-Origin Policy (SOP).
 */

const DB_NAME = 'SignetProtocol_v1';
const STORE_NAME = 'IdentityVault';

export interface VaultRecord {
  anchor: string;
  identity: string;
  publicKey: string;
  mnemonic: string;
  timestamp: number;
}

export const PersistenceService = {
  init: (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'anchor' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  saveVault: async (record: VaultRecord): Promise<void> => {
    const db = await PersistenceService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(record);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  getVault: async (anchor: string): Promise<VaultRecord | null> => {
    const db = await PersistenceService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(anchor);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  },

  getActiveVault: async (): Promise<VaultRecord | null> => {
    const db = await PersistenceService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll(null, 1); // Get most recent
      request.onsuccess = () => resolve(request.result[0] || null);
      request.onerror = () => reject(request.error);
    });
  },

  purgeVault: async (anchor: string): Promise<void> => {
    const db = await PersistenceService.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(anchor);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
};
