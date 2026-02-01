import UserDashboard from "./dashboard/UserDashboard";
import Notes from "./Notes";

export default function Home() {
  return (
    <div className="home-page">
      {/* OVERVIEW */}
      <UserDashboard />

      {/* NOTES */}
      <Notes />
    </div>
  );
}
