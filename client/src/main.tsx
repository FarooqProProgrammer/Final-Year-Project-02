import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "../node_modules/react-datepicker/dist/react-datepicker.css"
import App from './App.tsx'


import '../node_modules/react-quill/dist/quill.snow.css';
import '../node_modules/react-image-upload/dist/style.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
