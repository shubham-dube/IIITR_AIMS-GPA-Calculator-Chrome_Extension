import React from 'react';
import { createRoot } from 'react-dom/client';
import Transcript from './Transcript';
import './styles/transcript.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Transcript />);