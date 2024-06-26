import React, { useEffect, useState } from "react";
import UserIcon from "./IMG/UserIcon.jpg";
import { useNavigate } from "react-router-dom";

export const AdminPanel = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState("");
  const user = JSON.parse(localStorage.getItem("token"));
  if (!user) {
    window.location.href = "/login";
  }
  const authToken = user.token;
  const [values, setValues] = useState({
    name: "",
  });
  const [holiday, setHoliday] = useState([]);
  const [users, setUsers] = useState([]);
  const HandleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const getAllNotVerifiedPosts = async () => {
    try {
      const response = await fetch(
        "http://localhost:3002/celebration/all/notverified",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setHoliday(data.data);
      }
    } catch (error) {
      console.error("Error occurred during registration:", error.message);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await fetch("http://localhost:3002/users/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Error occurred during registration:", error.message);
    }
  };

  useEffect(() => {
    getAllNotVerifiedPosts();
    getAllUsers();
  }, []);

  const onSubmit = async (e) => {
    console.log("clicked");
    console.log(values);
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3002/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        setAlert("Category created successfully");
      }
    } catch (error) {
      console.error("Error occurred during registration:", error.message);
    }
  };

  const verification = async (e) => {
    try {
      const response = await fetch(
        `http://localhost:3002/celebration/verify/${e}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        getAllNotVerifiedPosts();
        navigate("/");
      }
    } catch (error) {
      console.error("Error occurred during post creation:", error.message);
    }
  };

  const blocking = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3002/users/update/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setAlert("User blocked successfully");
        getAllUsers();
      } else {
        const errorData = await response.json();
        console.error("Failed to block user:", errorData.error);
        setAlert(errorData.error || "Failed to block user");
      }
    } catch (error) {
      console.error("Error occurred during user blocking:", error.message);
      setAlert("An error occurred. Please try again.");
    }
  };
  return (
    <>
      {alert && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {alert}
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert("")}
            aria-label="Close"
          ></button>
        </div>
      )}
      <div className="row">
        <div className="col-4">
          <h1>Sukurkite kategorija</h1>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="categoryName">Kategorijos pavadinimas</label>
              <input
                type="text"
                className="form-control"
                id="categoryName"
                placeholder="Enter category name"
                name="name"
                onChange={HandleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </form>
        </div>
        <div className="col-4">
          <h1>Nepatvirtintos sventes</h1>
          {holiday.map((holiday) => (
            <div className="card" style={{ width: "18rem" }} key={holiday.id}>
              <img
                src={`http://localhost:3002/uploads/${holiday.image}`}
                className="card-img-top"
                alt="Holiday"
              />
              <div className="card-body">
                <h5 className="card-title">{holiday.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {holiday.date}
                </h6>
                <p className="card-text">{holiday.category.name}</p>
                <p className="card-text">{holiday.location}</p>
                <p className="card-text">Ratingai: {holiday.rating.length}</p>
                <button onClick={() => verification(holiday.id)}>
                  Patvirtinti
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="col-4">
          <h1>Vartotojai</h1>
          {users.map((user) => (
            <div className="card" style={{ width: "18rem" }} key={user.id}>
              <img src={UserIcon} className="card-img-top" alt="User" />
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">{user.email}</p>
                <button onClick={() => blocking(user.id)}>Block</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
