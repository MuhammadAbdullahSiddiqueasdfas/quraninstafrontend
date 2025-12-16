// admin-panel/src/components/LoadingSpinner.jsx
import './styles/LoadingSpinner.css';

export default function LoadingSpinner({ size = 'medium', text = 'Loading...' }) {
  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner ${size}`}>
        <div className="spinner"></div>
      </div>
      <p className="loading-text">{text}</p>
    </div>
  );
}