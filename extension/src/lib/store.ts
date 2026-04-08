import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  vtigerUrl: string;
  vtigerUsername: string;
  vtigerAccessKey: string;
  backendUrl: string;
  isConfigured: boolean;
  setVtigerConfig: (url: string, username: string, key: string) => void;
  setBackendUrl: (url: string) => void;
  resetConfig: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set: any): AppState => ({
      vtigerUrl: '',
      vtigerUsername: '',
      vtigerAccessKey: '',
      backendUrl: 'http://localhost:3001',
      isConfigured: false,
      setVtigerConfig: (url: any, username: any, key: any) => 
        set({ vtigerUrl: url, vtigerUsername: username, vtigerAccessKey: key, isConfigured: !!(url && username && key) }),
      setBackendUrl: (url: any) => set({ backendUrl: url }),
      resetConfig: () => set({ vtigerUrl: '', vtigerUsername: '', vtigerAccessKey: '', isConfigured: false }),
    }),
    {
      name: 'vtiger-smartfix-storage',
    }
  )
);
