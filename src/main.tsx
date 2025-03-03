
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Always set dark mode as the default theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.classList.remove('light', 'dark');
document.documentElement.classList.add(savedTheme);
localStorage.setItem('theme', savedTheme);

createRoot(document.getElementById("root")!).render(<App />);
