// src/components/dashboard/StatCard.jsx
export default function StatCard({ title, value }) {
  return (
    <div className="stat-card fade-item">
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value}</h3>
    </div>
  );
}
