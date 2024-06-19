import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("token"));
  if (!user) {
    navigate("/login");
  }
  const user_id = user.id;
  console.log(user_id);
  const [holidays, setHolidays] = useState([]);
  const fetchHolidays = async () => {
    const response = await fetch(
      `http://localhost:3002/celebration/${user_id}/profile`
    );
    const data = await response.json();
    setHolidays(data.data);
  };
  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleDelete = async (id) => {
    const response = await fetch(`http://localhost:3002/celebration/${id}`, {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    fetchHolidays();
  };

  console.log(holidays);

  return (
    <>
      <Navbar />
      <div>
        <h1>Visos sventes</h1>
        <div>
          {holidays.map((holiday) => (
            <div class="card" style={{ width: "18rem" }}>
              <img
                src={`http://localhost:3002/uploads/${holiday.image}`}
                class="card-img-top"
                alt="Sunset Over the Sea"
              />
              <div class="card-body">
                <h5 class="card-title">{holiday.name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">{holiday.date}</h6>
                <p class="card-text">{holiday.categoryId}</p>
                <p class="card-text">{holiday.location}</p>
                <button>
                  <a href={`edit/${holiday.id}`}>Edit</a>
                </button>
                <button onClick={() => handleDelete(holiday.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default Profile;
