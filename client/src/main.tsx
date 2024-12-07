import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "../node_modules/react-datepicker/dist/react-datepicker.css"
import App from './App.tsx'


import '../node_modules/ckeditor5/dist/ckeditor5.css';
import '../node_modules/ckeditor5-premium-features/dist/ckeditor5-premium-features.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
