// src/components/ui/ErrorState.jsx
export default function ErrorState({ message, retry }) {
  return (
    <div className="state-box error">
      <div className="state-icon">⚠️</div>
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {retry && (
        <button className="retry-btn" onClick={retry}>
          Retry
        </button>
      )}
    </div>
  );
}
