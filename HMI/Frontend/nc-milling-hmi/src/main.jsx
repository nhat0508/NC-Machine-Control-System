import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
 
// --- BẮT ĐẦU ĐOẠN CODE "DỌN DẸP" CONSOLE ---
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = args[0];
  if (typeof msg === 'string') {
    // Nếu là cảnh báo của Clock hoặc PCFSoftShadowMap từ thư viện, ta "bịt miệng" nó lại
    if (msg.includes('THREE.Clock') || msg.includes('PCFSoftShadowMap') || msg.includes('THREE.WebGLShadowMap')) {
      return;
    }
  }
  // Các cảnh báo khác vẫn cho hiện bình thường
  originalWarn(...args);
};
// --- KẾT THÚC ---
 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)