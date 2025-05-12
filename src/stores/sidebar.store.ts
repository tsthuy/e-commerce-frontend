import { create } from 'zustand';

type State = {
  isOpen: boolean;
};

type Action = {
  toggle: () => void;
};

const initialState: State = {
  isOpen: true
};

export const useSidebarStore = create<State & Action>((set) => ({
  ...initialState,
  toggle: (): void => set((state) => ({ ...state, isOpen: !state.isOpen }))
}));
