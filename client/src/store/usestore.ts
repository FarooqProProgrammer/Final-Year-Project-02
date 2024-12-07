import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Zustand store with persistence
interface FormState {
  username: string;
  email: string;
  password: string;
  setFormState: (state: Partial<FormState>) => void;
}

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      username: '',
      email: '',
      password: '',
      setFormState: (state) => set((prev) => ({ ...prev, ...state })),
    }),
    {
      name: 'form-storage', // Name of the localStorage item
    }
  )
);
