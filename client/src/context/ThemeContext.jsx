import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('storycraft_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Reader specific preferences: fontSize ('sm' | 'base' | 'lg' | 'xl' | '2xl'), readerTheme ('light' | 'sepia' | 'dark')
  const [readerSettings, setReaderSettings] = useState(() => {
    const saved = localStorage.getItem('storycraft_reader_settings');
    return saved
      ? JSON.parse(saved)
      : {
          fontSize: 'lg',
          readerTheme: 'light',
          lineHeight: 'relaxed',
        };
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('storycraft_dark_mode', JSON.stringify(isDark));
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('storycraft_reader_settings', JSON.stringify(readerSettings));
  }, [readerSettings]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const updateReaderSettings = (updates) => {
    setReaderSettings((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
        readerSettings,
        updateReaderSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
