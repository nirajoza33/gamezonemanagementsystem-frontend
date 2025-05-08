import React, { useState, useEffect } from "react";
import axios from "axios";
import OwnerNavbar from "./OwnerNavbar";

const GameCategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        categoryId: 0,
        categoryName: "",
        description: ""
    });
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState(null);

    const apiBase = "https://localhost:7186/api/TblGameCategories";

    const fetchCategories = async () => {
        try {
            const res = await axios.get(apiBase);
            setCategories(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch categories.");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editing) {
                await axios.put(`${apiBase}/${formData.categoryId}`, {
                    categoryName: formData.categoryName,
                    description: formData.description
                });
            } else {
                await axios.post(apiBase, {
                    categoryName: formData.categoryName,
                    description: formData.description
                });
            }

            setFormData({ categoryId: 0, categoryName: "", description: "" });
            setEditing(false);
            fetchCategories();
        } catch (err) {
            console.error(err);
            setError("Failed to save category.");
        }
    };

    const handleEdit = (category) => {
        setFormData({
            categoryId: category.categoryId,
            categoryName: category.categoryName,
            description: category.description
        });
        setEditing(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiBase}/${id}`);
            fetchCategories();
        } catch (err) {
            console.error(err);
            setError("Failed to delete category.");
        }
    };

    return (
        <>
            <OwnerNavbar />
            <div className="container py-4" style={{ backgroundColor: "#0d0d0d", minHeight: "100vh", color: "#00ffcc" }}>
                <h2 className="text-center mb-4" style={{ textShadow: "0 0 15px #00ffcc" }}>
                    📂 Game Category Manager (CRUD)
                </h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit} className="p-4 rounded mb-4"
                    style={{
                        background: "linear-gradient(145deg, rgba(20, 20, 70, 0.9), rgba(0, 255, 150, 0.2))",
                        border: "2px solid #00ffcc",
                        boxShadow: "0 0 15px #00ffcc"
                    }}>
                    <h4>{editing ? "Update Category" : "Add New Category"}</h4>

                    <div className="mb-2">
                        <label>Category Name</label>
                        <input
                            type="text"
                            name="categoryName"
                            value={formData.categoryName}
                            onChange={handleChange}
                            className="form-control bg-dark text-white border-neon"
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-control bg-dark text-white border-neon"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-success"
                        style={{ backgroundColor: "#00ffcc", border: "none", boxShadow: "0 0 10px #00ffcc" }}>
                        {editing ? "Update" : "Add"}
                    </button>
                </form>

                <h4 className="mb-3">📋 Category List</h4>
                <div className="row">
                    {categories.map((cat) => (
                        <div key={cat.categoryId} className="col-md-4 mb-3">
                            <div className="p-3 rounded"
                                style={{
                                    background: "rgba(0, 0, 0, 0.7)",
                                    border: "1px solid #00ffcc",
                                    boxShadow: "0 0 10px rgba(0,255,204,0.4)"
                                }}>
                                <h5 style={{ color: "#0ff" }}>{cat.categoryName}</h5>
                                <p style={{ color: "#ccc" }}>{cat.description}</p>

                                <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(cat)}>Edit</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat.categoryId)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default GameCategoryManager;
