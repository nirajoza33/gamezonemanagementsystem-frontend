import React, { useState, useEffect } from "react";
import axios from "axios";
import OwnerNavbar from "./OwnerNavbar";

const GameManager = () => {
    const [games, setGames] = useState([]);
    const [formData, setFormData] = useState({
        gameId: 0,
        title: "",
        description: "",
        pricing: "",
        categoryId: "",
        userId: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState(null);

    const apiBase = "https://localhost:7186/api/TblGames";

    const fetchGames = async () => {
        try {
            const res = await axios.get(apiBase);
            setGames(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch games.");
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("GameId", formData.gameId);
        data.append("Title", formData.title);
        data.append("Description", formData.description);
        data.append("Pricing", formData.pricing);
        data.append("CategoryId", formData.categoryId);
        data.append("UserId", formData.userId);
        if (imageFile) {
            data.append("ImageFile", imageFile);
        }

        try {
            if (editing) {
                await axios.post(`${apiBase}/UpdateGameWithImage`, data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await axios.post(apiBase, data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            setFormData({
                gameId: 0,
                title: "",
                description: "",
                pricing: "",
                categoryId: "",
                userId: ""
            });
            setImageFile(null);
            setEditing(false);
            fetchGames();
        } catch (err) {
            console.error(err);
            setError("Failed to save game.");
        }
    };

    const handleEdit = (game) => {
        setFormData({
            gameId: game.gameId,
            title: game.title,
            description: game.description,
            pricing: game.pricing,
            categoryId: game.categoryId,
            userId: game.userId
        });
        setEditing(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiBase}/${id}`);
            fetchGames();
        } catch (err) {
            console.error(err);
            setError("Failed to delete game.");
        }
    };

    return (
        <>
        <OwnerNavbar/>
        <div className="container py-4" style={{ backgroundColor: "#0d0d0d", minHeight: "100vh", color: "#00ffcc" }}>
            <h2 className="text-center mb-4" style={{ textShadow: "0 0 15px #00ffcc" }}>
                🛠 Game Manager (CRUD)
            </h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="p-4 rounded mb-4"
                style={{
                    background: "linear-gradient(145deg, rgba(20, 20, 70, 0.9), rgba(0, 255, 150, 0.2))",
                    border: "2px solid #00ffcc",
                    boxShadow: "0 0 15px #00ffcc"
                }}>
                <h4>{editing ? "Update Game" : "Add New Game"}</h4>

                <div className="mb-2">
                    <label>Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange}
                        className="form-control bg-dark text-white border-neon" required />
                </div>
                <div className="mb-2">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange}
                        className="form-control bg-dark text-white border-neon" required />
                </div>
                <div className="mb-2">
                    <label>Pricing</label>
                    <input type="number" name="pricing" value={formData.pricing} onChange={handleChange}
                        className="form-control bg-dark text-white border-neon" required />
                </div>
                <div className="mb-2">
                    <label>Upload Image</label>
                    <input
                        type="file"
                        name="imageFile"
                        onChange={handleImageChange}
                        className="form-control bg-dark text-white border-neon"
                        accept="image/*"
                        required={!editing}
                    />
                </div>
                <div className="mb-2">
                    <label>Category ID</label>
                    <input type="number" name="categoryId" value={formData.categoryId} onChange={handleChange}
                        className="form-control bg-dark text-white border-neon" required />
                </div>
                <div className="mb-2">
                    <label>User ID</label>
                    <input type="number" name="userId" value={formData.userId} onChange={handleChange}
                        className="form-control bg-dark text-white border-neon" required />
                </div>
                <button type="submit" className="btn btn-success"
                    style={{ backgroundColor: "#00ffcc", border: "none", boxShadow: "0 0 10px #00ffcc" }}>
                    {editing ? "Update" : "Add"}
                </button>
            </form>

            <h4 className="mb-3">🎮 Game List</h4>
            <div className="row">
                {games.map((game) => (
                    <div key={game.gameId} className="col-md-4 mb-3">
                        <div className="p-3 rounded"
                            style={{
                                background: "rgba(0, 0, 0, 0.7)",
                                border: "1px solid #00ffcc",
                                boxShadow: "0 0 10px rgba(0,255,204,0.4)"
                            }}>
                            <h5 style={{ color: "#0ff" }}>{game.title}</h5>
                            <p style={{ color: "#ccc" }}>{game.description}</p>
                            <p><strong>₹</strong>{game.pricing}</p>
                            <p><strong>Category ID:</strong> {game.categoryId}</p>
                            <p><strong>User ID:</strong> {game.userId}</p>
                            <img src={`https://localhost:7186/uploads/${game.imageUrl}`} alt={game.title} style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />

                            <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(game)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(game.gameId)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default GameManager;
