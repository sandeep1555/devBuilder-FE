
import { createContext, useState, useEffect, useContext } from 'react';


const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

    const loadTheme = () => {
        return localStorage.getItem('color-theme') || 'light';
    };

    const saveTheme = (theme) => {
        localStorage.setItem('color-theme', theme);
    };

    const [theme, setTheme] = useState(loadTheme);

    useEffect(() => {
        saveTheme(theme);
        document.documentElement.className = theme;
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};




export const useTheme = () => {
    return useContext(ThemeContext);
};