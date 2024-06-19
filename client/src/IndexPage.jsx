import { useState, useEffect } from "react";
import Navbar from "./Navbar";

export const IndexPage = () => {
  const user = JSON.parse(localStorage.getItem("token"));
  const authToken = user?.token;
  const [holidays, setHolidays] = useState([]);
  const [filteredHolidays, setFilteredHolidays] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [beingFiltered, setBeingFiltered] = useState(false);
  const [userLikes, setUserLikes] = useState([]);

  const fetchHolidays = async () => {
    const response = await fetch("http://localhost:3002/celebration/all");
    const data = await response.json();
    const celebrations = data.data.filter(
      (celebration) => celebration.isVerified === 1
    );
    setHolidays(celebrations);
    setFilteredHolidays(celebrations);
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

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleFilter = () => {
    const filtered = holidays.filter((holiday) => {
      const holidayDate = new Date(holiday.date);
      const start = new Date(startDate);
      return holidayDate.getTime() === start.getTime();
    });
    setFilteredHolidays(filtered);
    setBeingFiltered(true);
  };

  const handleFilter2 = (category) => {
    const filtered = holidays.filter(
      (holiday) => holiday.category.name === category
    );
    setFilteredHolidays(filtered);
    setBeingFiltered(true);
  };

  const RatingCheck = async () => {
    try {
      const response = await fetch("http://localhost:3002/users/data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const likedCelebrations = data.data.rating.map(
          (rating) => rating.celebrationId
        );
        setUserLikes(likedCelebrations);
      }
    } catch (error) {
      console.error("Error liking post:", error.message);
    }
  };

  useEffect(() => {
    RatingCheck();
  }, []);

  const handleLike = async (celebrationId) => {
    try {
      const response = await fetch("http://localhost:3002/rating/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ celebrationId }),
      });
      if (response.ok) {
        setUserLikes((prevLikes) => [...prevLikes, celebrationId]);
        setHolidays((prevHolidays) =>
          prevHolidays.map((holiday) =>
            holiday.id === celebrationId
              ? { ...holiday, rating: [...holiday.rating, {}] }
              : holiday
          )
        );
        setFilteredHolidays((prevFiltered) =>
          prevFiltered.map((holiday) =>
            holiday.id === celebrationId
              ? { ...holiday, rating: [...holiday.rating, {}] }
              : holiday
          )
        );
      }
    } catch (error) {
      console.error("Error liking post:", error.message);
    }
  };

  const handleDislike = async (celebrationId) => {
    try {
      const response = await fetch("http://localhost:3002/rating/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ celebrationId }),
      });
      if (response.ok) {
        setUserLikes((prevLikes) =>
          prevLikes.filter((id) => id !== celebrationId)
        );
        setHolidays((prevHolidays) =>
          prevHolidays.map((holiday) =>
            holiday.id === celebrationId
              ? { ...holiday, rating: holiday.rating.slice(0, -1) }
              : holiday
          )
        );
        setFilteredHolidays((prevFiltered) =>
          prevFiltered.map((holiday) =>
            holiday.id === celebrationId
              ? { ...holiday, rating: holiday.rating.slice(0, -1) }
              : holiday
          )
        );
      }
    } catch (error) {
      console.error("Error disliking post:", error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <h1>Visos sventes</h1>
        <div>
          <label htmlFor="startDate">Norima data</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <button onClick={handleFilter}>Filter</button>
        </div>
        <div>
          <h2>Kategorijos</h2>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleFilter2(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div>
          <h1>Clear filters</h1>
          <button
            onClick={() => {
              setFilteredHolidays(holidays);
              setBeingFiltered(false);
            }}
          >
            Clear
          </button>
        </div>

        <h2>Sventes</h2>
        <div>
          {beingFiltered && filteredHolidays.length > 0 ? (
            filteredHolidays.map((holiday) => (
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
                  {userLikes.includes(holiday.id) ? (
                    <button onClick={() => handleDislike(holiday.id)}>
                      Unlike
                    </button>
                  ) : (
                    <button onClick={() => handleLike(holiday.id)}>Like</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No holidays found</p>
          )}
          {!beingFiltered &&
            holidays.length > 0 &&
            holidays.map((holiday) => (
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
                  {userLikes.includes(holiday.id) ? (
                    <button onClick={() => handleDislike(holiday.id)}>
                      Unlike
                    </button>
                  ) : (
                    <button onClick={() => handleLike(holiday.id)}>Like</button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default IndexPage;
