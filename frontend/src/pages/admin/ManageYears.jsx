import { useEffect, useState } from "react";
import { getYears, createYear, deleteYear } from "../../api/adminApi";
import toast from "react-hot-toast";
import "../../styles/manageYears.css";


function ManageYears() {
  const [years, setYears] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    loadYears();
  }, []);

  const loadYears = async () => {
    const res = await getYears();
    setYears(res.data);
  };

  const addYear = async () => {
    if (!name) return;
    await createYear({ name });
    toast.success("Year added");
    setName("");
    loadYears();
  };

  const removeYear = async (id) => {
    await deleteYear(id);
    toast.success("Year deleted");
    loadYears();
  };

  return (
    <>
      <h3>Manage Years</h3>

      <input
        placeholder="MCA 1st Year"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={addYear}>Add Year</button>

      {years.map((y) => (
        <div key={y.id}>
          {y.name}
          <button onClick={() => removeYear(y.id)}>Delete</button>
        </div>
      ))}
    </>
  );
}

export default ManageYears;
