import React from 'react';
import ReactDOM from 'react-dom/client';
import MainApp from './MainApp';

const appRoot = ReactDOM.createRoot(document.getElementById('root'));
appRoot.render(
    <React.StrictMode>
        <MainApp />
    </React.StrictMode>
);