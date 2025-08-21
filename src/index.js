import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const reactRoot = ReactDOM.createRoot(document.getElementById('root'));
reactRoot.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);