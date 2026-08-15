import { create } from 'zustand';
import { StyleId } from '../data/styles';
import { getBuilderTitle } from '../data/builderTitles';

export interface PhotoPosition {
  x: number; // -100 to 100 percentage offset
  y: number; // -100 to 100 percentage offset
}

export interface BuilderData {
  id: string;
  name: string;
  role: string;
  teamName: string;
  power: string;
  builderTitle: string;
  photo: string | null;
  rawFile: File | null;
  style: StyleId;
  photoZoom: number;
  photoPosition: PhotoPosition;
}

export type AppStep = 'landing' | 'builder' | 'result' | 'crew' | 'crew-result';

export interface BuilderState {
  // Primary Builder
  builder: BuilderData;
  generatedDataUrl: string | null;
  generatedBlob: Blob | null;
  isGenerating: boolean;
  generationStep: string;

  // Crew Mode (up to 3 builders)
  crew: BuilderData[];
  crewGeneratedDataUrl: string | null;
  crewGeneratedBlob: Blob | null;
  isCrewGenerating: boolean;

  // Navigation & UI
  activeStep: AppStep;
  toastMessage: string | null;

  // Actions
  setPhoto: (dataUrl: string, file?: File) => void;
  setName: (name: string) => void;
  setRole: (role: string) => void;
  setTeamName: (teamName: string) => void;
  setPower: (power: string) => void;
  setBuilderTitle: (title: string) => void;
  regenerateTitle: () => void;
  setStyle: (style: StyleId) => void;
  setPhotoZoom: (zoom: number) => void;
  setPhotoPosition: (pos: Partial<PhotoPosition>) => void;
  setGeneratedResult: (dataUrl: string | null, blob: Blob | null) => void;
  setIsGenerating: (isGenerating: boolean, stepMessage?: string) => void;

  // Crew Actions
  addCrewMember: (member: BuilderData) => void;
  updateCrewMember: (index: number, member: Partial<BuilderData>) => void;
  removeCrewMember: (index: number) => void;
  setCrewGeneratedResult: (dataUrl: string | null, blob: Blob | null) => void;
  setIsCrewGenerating: (isGenerating: boolean) => void;

  // Navigation Actions
  setActiveStep: (step: AppStep) => void;
  showToast: (msg: string | null) => void;
  resetSingleBuilder: () => void;
  resetAll: () => void;
}

const DEFAULT_BUILDER: BuilderData = {
  id: 'builder-primary',
  name: '',
  role: '',
  teamName: '',
  power: '',
  builderTitle: 'GOA BUILDER',
  photo: null,
  rawFile: null,
  style: 'beach-club',
  photoZoom: 1.0,
  photoPosition: { x: 0, y: 0 },
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  builder: { ...DEFAULT_BUILDER },
  generatedDataUrl: null,
  generatedBlob: null,
  isGenerating: false,
  generationStep: 'finding your frame...',

  crew: [],
  crewGeneratedDataUrl: null,
  crewGeneratedBlob: null,
  isCrewGenerating: false,

  activeStep: 'landing',
  toastMessage: null,

  setPhoto: (dataUrl: string, file?: File) => {
    set((state) => ({
      builder: {
        ...state.builder,
        photo: dataUrl,
        rawFile: file || state.builder.rawFile,
      },
    }));
  },

  setName: (name: string) => {
    set((state) => {
      const currentRole = state.builder.role;
      const title = getBuilderTitle(currentRole, name);
      return {
        builder: {
          ...state.builder,
          name,
          builderTitle: state.builder.builderTitle === 'GOA BUILDER' ? title : state.builder.builderTitle,
        },
      };
    });
  },

  setRole: (role: string) => {
    set((state) => {
      const title = getBuilderTitle(role, state.builder.name);
      return {
        builder: {
          ...state.builder,
          role,
          builderTitle: title,
        },
      };
    });
  },

  setTeamName: (teamName: string) => {
    set((state) => ({
      builder: {
        ...state.builder,
        teamName,
      },
    }));
  },

  setPower: (power: string) => {
    set((state) => ({
      builder: {
        ...state.builder,
        power,
      },
    }));
  },

  setBuilderTitle: (builderTitle: string) => {
    set((state) => ({
      builder: {
        ...state.builder,
        builderTitle,
      },
    }));
  },

  regenerateTitle: () => {
    const current = get().builder;
    const newTitle = getBuilderTitle(current.role, current.name, true);
    set((state) => ({
      builder: {
        ...state.builder,
        builderTitle: newTitle,
      },
    }));
  },

  setStyle: (style: StyleId) => {
    set((state) => ({
      builder: {
        ...state.builder,
        style,
      },
    }));
  },

  setPhotoZoom: (photoZoom: number) => {
    set((state) => ({
      builder: {
        ...state.builder,
        photoZoom,
      },
    }));
  },

  setPhotoPosition: (pos: Partial<PhotoPosition>) => {
    set((state) => ({
      builder: {
        ...state.builder,
        photoPosition: {
          ...state.builder.photoPosition,
          ...pos,
        },
      },
    }));
  },

  setGeneratedResult: (generatedDataUrl: string | null, generatedBlob: Blob | null) => {
    set({ generatedDataUrl, generatedBlob });
  },

  setIsGenerating: (isGenerating: boolean, stepMessage = 'finding your frame...') => {
    set({ isGenerating, generationStep: stepMessage });
  },

  addCrewMember: (member: BuilderData) => {
    set((state) => {
      if (state.crew.length >= 3) return state;
      return {
        crew: [...state.crew, member],
      };
    });
  },

  updateCrewMember: (index: number, member: Partial<BuilderData>) => {
    set((state) => {
      const updated = [...state.crew];
      if (updated[index]) {
        updated[index] = { ...updated[index], ...member };
      }
      return { crew: updated };
    });
  },

  removeCrewMember: (index: number) => {
    set((state) => ({
      crew: state.crew.filter((_, i) => i !== index),
    }));
  },

  setCrewGeneratedResult: (crewGeneratedDataUrl: string | null, crewGeneratedBlob: Blob | null) => {
    set({ crewGeneratedDataUrl, crewGeneratedBlob });
  },

  setIsCrewGenerating: (isCrewGenerating: boolean) => {
    set({ isCrewGenerating });
  },

  setActiveStep: (activeStep: AppStep) => {
    set({ activeStep });
  },

  showToast: (toastMessage: string | null) => {
    set({ toastMessage });
    if (toastMessage) {
      setTimeout(() => {
        if (get().toastMessage === toastMessage) {
          set({ toastMessage: null });
        }
      }, 3500);
    }
  },

  resetSingleBuilder: () => {
    set({
      builder: { ...DEFAULT_BUILDER, id: `builder-${Date.now()}` },
      generatedDataUrl: null,
      generatedBlob: null,
      activeStep: 'landing',
    });
  },

  resetAll: () => {
    set({
      builder: { ...DEFAULT_BUILDER, id: `builder-${Date.now()}` },
      generatedDataUrl: null,
      generatedBlob: null,
      crew: [],
      crewGeneratedDataUrl: null,
      crewGeneratedBlob: null,
      activeStep: 'landing',
    });
  },
}));
