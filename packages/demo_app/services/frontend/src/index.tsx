import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => <h1>Hello world!1</h1>;

createRoot(document.querySelector('#AppRoot')!).render(<App />);
