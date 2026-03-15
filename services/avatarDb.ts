import { CustomAvatarProps } from '../components/CustomAvatar3D';

const DB_NAME = 'SignetAvatarDB';
const STORE_NAME = 'avatarConfig';
const CUSTOM_STORE_NAME = 'customAvatars';

export interface SavedAvatarConfig extends CustomAvatarProps {
  id?: string;
  name: string;
  voice: string;
  timestamp?: number;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(CUSTOM_STORE_NAME)) {
        db.createObjectStore(CUSTOM_STORE_NAME, { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
    request.onerror = (event) => reject((event.target as IDBOpenDBRequest).error);
  });
};

export const saveAvatarConfig = async (config: SavedAvatarConfig): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(config, 'currentAvatar');
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const loadAvatarConfig = async (): Promise<SavedAvatarConfig | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get('currentAvatar');
    
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

export const saveCustomAvatar = async (config: SavedAvatarConfig): Promise<SavedAvatarConfig> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CUSTOM_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(CUSTOM_STORE_NAME);
    const newConfig = { ...config };
    if (!newConfig.id) newConfig.id = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    if (!newConfig.timestamp) newConfig.timestamp = Date.now();
    
    const request = store.put(newConfig);
    
    request.onsuccess = () => resolve(newConfig);
    request.onerror = () => reject(request.error);
  });
};

export const loadCustomAvatars = async (): Promise<SavedAvatarConfig[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CUSTOM_STORE_NAME, 'readonly');
    const store = transaction.objectStore(CUSTOM_STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => {
      const results = request.result || [];
      results.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
};

export const deleteCustomAvatar = async (id: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CUSTOM_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(CUSTOM_STORE_NAME);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
