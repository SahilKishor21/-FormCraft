import { createSlice } from '@reduxjs/toolkit';
import { ThemeState } from '../../types';

const loadThemeFromStorage = (): boolean => {
  try {
    const saved = localStorage.getItem('isDarkMode');
    return saved ? JSON.parse(saved) : false;
  } catch {
    return false;
  }
};

const initialState: ThemeState = {
  isDarkMode: loadThemeFromStorage(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      try {
        localStorage.setItem('isDarkMode', JSON.stringify(state.isDarkMode));
      } catch (error) {
        console.error('Failed to save theme to localStorage:', error);
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;