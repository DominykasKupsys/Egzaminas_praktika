import React, { useState, useEffect } from "react";

export const CreatePage = () => {
  const user = JSON.parse(localStorage.getItem("token"));
  if (!user) {
    window.location.href = "/login";
  }
  const authToken = user.token;
  const [values, setValues] = useState({
    category: "",
    name: "",
    date: "",
    location: "",
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const HandleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setValues({ ...values, [name]: files[0] });
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  const getCategories = async () => {
    try {
      const response = await fetch("http://localhost:3002/category/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error occurred during category fetching:", error.message);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("date", values.date);
    formData.append("category", values.category);
    formData.append("location", values.location);
    formData.append("image", values.image);

    try {
      const response = await fetch("http://localhost:3002/celebration/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error occurred during post creation:", error.message);
    }
  };
  return (
    <div className="d-flex justify-content-center mt-5">
      <form
        onSubmit={onSubmit}
        style={{ width: "26rem" }}
        encType="multipart/form-data"
      >
        <div data-mdb-input-init class="form-outline mb-4">
          <input
            type="text"
            id="form4Example1"
            class="form-control"
            name="name"
            onChange={HandleChange}
          />
          <label class="form-label" for="form4Example1">
            Pavadinimas
          </label>
        </div>

        <div data-mdb-input-init class="form-outline mb-4">
          <input
            type="date"
            id="form4Example2"
            class="form-control"
            name="date"
            onChange={HandleChange}
          />
          <label class="form-label" for="form4Example2">
            Data
          </label>
        </div>

        <div className="form-outline mb-4">
          <select
            value={values.category}
            name="category"
            id="form4Example3"
            onChange={HandleChange}
            className="form-select"
          >
            <option value="">Select category...</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <label className="form-label" htmlFor="form4Example3">
            Category
          </label>
        </div>

        <div data-mdb-input-init class="form-outline mb-4">
          <input
            class="form-control"
            id="form4Example3"
            rows="4"
            name="location"
            onChange={HandleChange}
          ></input>
          <label class="form-label" for="form4Example3">
            Lokacija
          </label>
        </div>

        <div data-mdb-input-init class="form-outline mb-4">
          <input
            type="file"
            id="form4Example3"
            class="form-control"
            name="image"
            onChange={HandleChange}
          />
          <label class="form-label" for="form4Example3">
            Nuotrauka
          </label>
        </div>

        <div className="d-flex justify-content-center">
          <button
            data-mdb-ripple-init
            type="submit"
            class="btn btn-primary btn-block mb-4"
          >
            Siusti
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreatePage;
