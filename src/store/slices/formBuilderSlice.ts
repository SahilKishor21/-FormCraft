import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormBuilderState, FormSchema, FormField } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const loadFromLocalStorage = (): FormSchema[] => {
  try {
    const saved = localStorage.getItem('savedForms');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (forms: FormSchema[]) => {
  try {
    localStorage.setItem('savedForms', JSON.stringify(forms));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const initialState: FormBuilderState = {
  currentForm: null,
  savedForms: loadFromLocalStorage(),
  isPreviewMode: false,
  selectedFieldId: null,
  formValues: {},
  formErrors: {},
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    createNewForm: (state) => {
      state.currentForm = {
        id: uuidv4(),
        name: 'Untitled Form',
        fields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.formValues = {};
      state.formErrors = {};
    },

    updateFormName: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.name = action.payload;
        state.currentForm.updatedAt = new Date().toISOString();
      }
    },

    addField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        state.currentForm.fields.push(action.payload);
        state.currentForm.updatedAt = new Date().toISOString();
      }
    },

    updateField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        const index = state.currentForm.fields.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.currentForm.fields[index] = action.payload;
          state.currentForm.updatedAt = new Date().toISOString();
        }
      }
    },

    deleteField: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
        state.currentForm.updatedAt = new Date().toISOString();
      }
    },

    reorderFields: (state, action: PayloadAction<FormField[]>) => {
      if (state.currentForm) {
        state.currentForm.fields = action.payload.map((field, index) => ({
          ...field,
          order: index
        }));
        state.currentForm.updatedAt = new Date().toISOString();
      }
    },

    saveForm: (state) => {
      if (state.currentForm) {
        const existingIndex = state.savedForms.findIndex(f => f.id === state.currentForm!.id);
        if (existingIndex !== -1) {
          state.savedForms[existingIndex] = { ...state.currentForm };
        } else {
          state.savedForms.push({ ...state.currentForm });
        }
        saveToLocalStorage(state.savedForms);
      }
    },

    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload);
      if (form) {
        state.currentForm = { ...form };
        state.formValues = {};
        state.formErrors = {};
      }
    },

    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.isPreviewMode = action.payload;
    },

    setSelectedField: (state, action: PayloadAction<string | null>) => {
      state.selectedFieldId = action.payload;
    },

    updateFormValue: (state, action: PayloadAction<{ fieldId: string; value: any }>) => {
      state.formValues[action.payload.fieldId] = action.payload.value;
    },

    setFormError: (state, action: PayloadAction<{ fieldId: string; error: string }>) => {
      if (action.payload.error) {
        state.formErrors[action.payload.fieldId] = action.payload.error;
      } else {
        delete state.formErrors[action.payload.fieldId];
      }
    },

    clearFormData: (state) => {
      state.formValues = {};
      state.formErrors = {};
    },

    deleteFormById: (state, action: PayloadAction<string>) => {
      state.savedForms = state.savedForms.filter(f => f.id !== action.payload);
      saveToLocalStorage(state.savedForms);
    },
  },
});

export const {
  createNewForm,
  updateFormName,
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
  loadForm,
  setPreviewMode,
  setSelectedField,
  updateFormValue,
  setFormError,
  clearFormData,
  deleteFormById,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;