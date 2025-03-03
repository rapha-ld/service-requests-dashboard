
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Apply dark mode class to document root before rendering
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.classList.add(savedTheme);

createRoot(document.getElementById("root")!).render(<App />);
