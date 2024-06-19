import React, { useState } from "react";

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
  const [categories, setCategories] = useState([]);
  const HandleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
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
      </div>
    </>
  );
};
export default AdminPanel;
