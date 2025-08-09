import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './store';
import { RootState } from './types';
import { lightTheme, darkTheme } from './theme';
import Header from './components/common/Header';
import CreateForm from './pages/CreateForm';
import PreviewForm from './pages/PreviewForm';
import MyForms from './pages/MyForms';

const AppContent: React.FC = () => {
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/create" replace />} />
            <Route path="/create" element={<CreateForm />} />
            <Route path="/preview" element={<PreviewForm />} />
            <Route path="/myforms" element={<MyForms />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;