import React, { useState } from "react";

function HomeScreen() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [location, setLocation] = useState("");
  const [rooms, setRooms] = useState([]);

  // 🔍 Ici : la fonction fetch pour rechercher les chambres
  const searchRooms = async () => {
    const response = await fetch("/api/rooms/searchrooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromDate, toDate, location }),
    });

    const data = await response.json();
    console.log(data); // pour vérifier que le backend renvoie bien les chambres
    setRooms(data);
  };

  return (
    <div>
      <h2>Rechercher une chambre</h2>

      <input type="date" onChange={(e) => setFromDate(e.target.value)} />
      <input type="date" onChange={(e) => setToDate(e.target.value)} />
      <input type="text" placeholder="Location" onChange={(e) => setLocation(e.target.value)} />

      <button onClick={searchRooms}>Rechercher</button>

      {/* Affichage des chambres */}
      {rooms.length > 0 ? (
        rooms.map((room) => (
          <div key={room._id}>
            <h3>{room.name}</h3>
            <p>{room.location}</p>
            <p>{room.price} TND</p>
          </div>
        ))
      ) : (
        <p>Aucune chambre trouvée</p>
      )}
    </div>
  );
}

export default HomeScreen;