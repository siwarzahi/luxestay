import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Envoie les données à la page Rooms
    navigate("/rooms", { state: searchData });
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-4 rounded shadow">
      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label">Destination</label>
          <input
            type="text"
            name="destination"
            className="form-control"
            placeholder="Enter city"
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Check-in</label>
          <input
            type="date"
            name="checkIn"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Check-out</label>
          <input
            type="date"
            name="checkOut"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Guests</label>
          <input
            type="number"
            name="guests"
            min={1}
            max={10}
            className="form-control"
            onChange={handleChange}
            defaultValue={1}
          />
        </div>
        <div className="col-md-1 d-flex align-items-end">
          <button type="submit" className="btn btn-dark w-100">
            🔍
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;