import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Games.css"; // Optional styling
import Navbar from "./Navbar";

const Games = () => {
  const [games, setGames] = useState([]);

  const fetchGames = async () => {
    try {
      const res = await axios.get("https://localhost:7186/api/TblGames");
      setGames(res.data);
    } catch (err) {
      console.error("Error fetching games:", err);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    console.log("Fetched games:", games);
  }, [games]);

  return (
    <div className="games-container">
        <Navbar/>
      <h2>🎮 Available Games</h2>
      <div className="game-grid">
        {games.map((game) => (
          <div key={game.gameId} className="game-card">
            <img
              src={`https://localhost:7186/uploads/${game.imageUrl}`}
              alt={game.title}
              className="game-image"
            />
            <div className="game-info">
              <h3>{game.title}</h3>
              
              <p><strong>Description:</strong> {game.description}</p>
              <p><strong>Price:</strong> ₹{game.pricing}</p>
              <p><strong>Category ID:</strong> {game.cname}</p>
              {/* <p><strong>User ID:</strong> {game.userId}</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;
