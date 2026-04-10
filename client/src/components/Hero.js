import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import background1 from "../assets/background.jpg"; // ton image de fond
import { cities } from "../assets/assets"; // liste des villes

const Hero = () => {
  const navigate = useNavigate();

  // State pour le formulaire
  const [searchData, setSearchData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  // Fonction pour mettre à jour le state
  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.id]: e.target.value,
    });
  };

  // Fonction pour gérer le clic sur Search
  const handleSearch = (e) => {
    e.preventDefault();

    // TEMPORAIRE : Désactiver la vérification du token pour test
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   navigate("/login");
    // } else {
    navigate("/rooms", { state: searchData });
    // }
  };

  return (
    <div
      className="d-flex flex-column justify-content-center text-white"
      style={{
        height: "100vh",
        backgroundImage: `url(${background1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container text-start">
        {/* Label */}
        <p className="bg-primary bg-opacity-50 px-3 py-1 rounded mt-5 d-inline-block">
          L’expérience hôtelière ultime
        </p>

        {/* Titre */}
        <h1 className="fw-bold display-4 mt-3">Découvrez votre séjour idéal</h1>

        {/* Description */}
        <p className="lead mt-2">
          Profitez de notre service exceptionnel et de nos installations de luxe pour un séjour inoubliable.
        </p>

        {/* Formulaire */}
        <form
          onSubmit={handleSearch}
          className="bg-white text-dark p-4 rounded mt-4"
        >
          <div className="row g-3">
            {/* Destination */}
            <div className="col-md-3">
              <label className="form-label">Destination</label>
              <input
                list="destinations"
                id="destination"
                className="form-control"
                placeholder="Type here"
                onChange={handleChange}
                required
              />
              <datalist id="destinations">
                {cities.map((city, index) => (
                  <option value={city} key={index} />
                ))}
              </datalist>
            </div>

            {/* Check-in */}
            <div className="col-md-3">
              <label className="form-label">Check-in</label>
              <input
                type="date"
                id="checkIn"
                className="form-control"
                onChange={handleChange}
              />
            </div>

            {/* Check-out */}
            <div className="col-md-3">
              <label className="form-label">Check-out</label>
              <input
                type="date"
                id="checkOut"
                className="form-control"
                onChange={handleChange}
              />
            </div>

            {/* Guests */}
            <div className="col-md-2">
              <label className="form-label">Guests</label>
              <input
                type="number"
                min={1}
                max={10}
                id="guests"
                className="form-control"
                onChange={handleChange}
                defaultValue={1}
              />
            </div>

            {/* Bouton */}
            <div className="col-md-1 d-flex align-items-end">
              <button type="submit" className="btn btn-dark w-100">
                🔍
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Hero;