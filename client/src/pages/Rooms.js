import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Rooms = () => {
  const locationState = useLocation();

  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");

  // ⚠️ sécurisation des données
  const destination = locationState.state?.destination;
  const checkIn = locationState.state?.checkIn;
  const checkOut = locationState.state?.checkOut;
  const guests = locationState.state?.guests;

  useEffect(() => {
    if (!locationState.state) return; // ✅ OK ici (dans useEffect)

    const fetchRooms = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/rooms/search",
          { destination, checkIn, checkOut, guests }
        );
        setRooms(res.data);
      } catch (error) {
        console.error(error);
        setError("Erreur lors du chargement");
      }
    };

    fetchRooms();
  }, [locationState.state]);

  // ✅ condition APRES les hooks
  if (!locationState.state) {
    return <p>Erreur : aucune donnée de recherche</p>;
  }

  return (
    <div className="container mt-5">
      <h2>Chambres disponibles à {destination}</h2>

      {error && <p className="text-danger">{error}</p>}

      <div className="row">
        {rooms.length === 0 && <p>Aucune chambre disponible.</p>}

        {rooms.map((room) => (
          <div className="col-md-4 mb-4" key={room._id}>
            <div className="card shadow-sm">
              {room.imageUrls?.length > 0 && (
                <img
                  src={room.imageUrls[0]}
                  className="card-img-top"
                  alt={room.name}
                />
              )}

              <div className="card-body">
                <h5 className="card-title">{room.name}</h5>
                <p className="card-text">{room.description}</p>
                <p className="card-text fw-bold">
                  Prix: {room.price} TND
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;