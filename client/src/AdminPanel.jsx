import React, { useEffect, useState } from "react";

export const AdminPanel = () => {
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

  useEffect(() => {
    getAllNotVerifiedPosts();
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
        const data = await response.json();
        console.log(data);
        localStorage.setItem("token", JSON.stringify(data));
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
          body: JSON.stringify(values),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        getAllNotVerifiedPosts();
      }
    } catch (error) {
      console.error("Error occurred during post creation:", error.message);
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
          <h1>Create Category</h1>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="categoryName">Category Name</label>
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
      </div>
    </>
  );
};
export default AdminPanel;
