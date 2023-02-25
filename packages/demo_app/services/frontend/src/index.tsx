import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Button from './components/authform';

const Root = () => (
  <div>
    <h1>Hello world!</h1>
    <Button />
  </div>
);

createRoot(document.querySelector('#AppRoot')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </React.StrictMode>
);
