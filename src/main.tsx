import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AcessoGate } from './components/AcessoGate.tsx';

createRoot(document.getElementById('root')!).render(<AcessoGate><App /></AcessoGate>);
