// src/components/ui/EmptyState.jsx
export default function EmptyState({ title, message, action }) {
  return (
    <div className="state-box">
      <div className="state-icon">📭</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action && <div className="state-action">{action}</div>}
    </div>
  );
}
