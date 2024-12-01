import create from 'zustand';

interface AppState {
  showVideo: boolean;
  isModelLoading: boolean;
  setShowVideo: (show: boolean) => void;
  setIsModelLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  showVideo: false,
  isModelLoading: true,
  setShowVideo: (show) => set({ showVideo: show }),
  setIsModelLoading: (loading) => set({ isModelLoading: loading }),
}));

