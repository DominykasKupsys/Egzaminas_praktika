import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const EditPage = () => {
  const { id } = useParams();
  console.log(id);
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
  const [prevValues, setPrevValues] = useState({});
  console.log(prevValues);
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

  const getPostData = async () => {
    try {
      const response = await fetch(`http://localhost:3002/celebration/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPrevValues(data.data);
      }
    } catch (error) {
      console.error("Error occurred during post fetching:", error.message);
    }
  };

  useEffect(() => {
    getCategories();
    getPostData();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", values.name || prevValues.name);
    formData.append("date", values.date || prevValues.date);
    formData.append("category", values.category || prevValues.category.id);
    formData.append("location", values.location || prevValues.location);
    formData.append("image", values.image || prevValues.image);

    try {
      const response = await fetch(`http://localhost:3002/celebration/${id}`, {
        method: "PUT",
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
  console.log(prevValues);
  return (
    <div className="d-flex justify-content-center mt-5">
      <form onSubmit={onSubmit} style={{ width: "26rem" }}>
        <div data-mdb-input-init className="form-outline mb-4">
          <input
            type="text"
            id="form4Example1"
            className="form-control"
            name="name"
            onChange={HandleChange}
            defaultValue={prevValues.name}
          />
          <label className="form-label" htmlFor="form4Example1">
            Pavadinimas
          </label>
        </div>

        <div data-mdb-input-init className="form-outline mb-4">
          <input
            type="date"
            id="form4Example2"
            className="form-control"
            name="date"
            onChange={HandleChange}
            defaultValue={prevValues.date ? prevValues.date.slice(0, 10) : ""}
          />
          <label className="form-label" htmlFor="form4Example2">
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
            <option value="">{"Pasirinkite nauja kategorija"}</option>
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

        <div data-mdb-input-init className="form-outline mb-4">
          <input
            className="form-control"
            id="form4Example3"
            rows="4"
            name="location"
            onChange={HandleChange}
            defaultValue={prevValues.location}
          ></input>
          <label className="form-label" htmlFor="form4Example3">
            Lokacija
          </label>
        </div>

        <div data-mdb-input-init className="form-outline mb-4">
          <input
            type="file"
            id="form4Example3"
            className="form-control"
            name="image"
            onChange={HandleChange}
            defaultValue={prevValues.image}
          />
          <label className="form-label" htmlFor="form4Example3">
            Nuotrauka
          </label>
        </div>

        <div className="d-flex justify-content-center">
          <button
            data-mdb-ripple-init
            type="submit"
            className="btn btn-primary btn-block mb-4"
          >
            Siusti
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditPage;
