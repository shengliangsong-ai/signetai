
import React from 'react';
import ReactDOM from 'react-dom/client';

const TestApp: React.FC = () => {
  return <h1>Hello World from Test</h1>;
};

const rootElement = document.getElementById('root-test');
if (!rootElement) throw new Error("Could not find root element to mount to");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
);
