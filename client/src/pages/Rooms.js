import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Rooms = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);

  const destination = state?.destination || "";
  const checkIn = state?.checkIn || "";
  const checkOut = state?.checkOut || "";
  const guests = state?.guests || 1;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/rooms/search", {
          destination,
          checkIn,
          checkOut,
          guests,
        });

        setRooms(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (state) fetchRooms();
  }, [state]);

  const handleBooking = (room) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/login", {
        state: { room, checkIn, checkOut, guests }
      });
    } else {
      navigate("/booking", {
        state: { room, checkIn, checkOut, guests }
      });
    }
  };

  if (!state) {
    return <h3>Aucune recherche ❌</h3>;
  }

  return (
    <div className="container mt-5">
      <h2>Chambres à {destination}</h2>

      <div className="row">
        {rooms.map((room) => (
          <div className="col-md-4 mb-4" key={room._id}>
            <div className="card">
              <img src={room.imageUrls?.[0]} className="card-img-top" />

              <div className="card-body">
                <h5>{room.name}</h5>
                <p>{room.price} TND</p>

                <button
                  className="btn btn-primary"
                  onClick={() => handleBooking(room)}
                >
                  Réserver
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;