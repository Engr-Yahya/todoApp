import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      userData: [],
      setUserData: (user) =>
        set((state) => ({
          userData: [...state.userData, user],
        })),
    }),
    {
      name: 'app-storage', 
    },
  ),
) 
export default useStore;