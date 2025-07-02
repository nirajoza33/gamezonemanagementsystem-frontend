"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "../css/AttractionsSection.css"

const AttractionsSection = () => {
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = "https://localhost:7186/api"

  useEffect(() => {
    fetchOwners()
  }, [])

  const fetchOwners = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/TblUsers/Admin/get-owners`)

      if (response.data.success && response.data.data) {
        // Take only first 6 owners and create simplified data
        const simplifiedOwners = response.data.data.slice(0, 6).map((owner, index) => ({
          id: owner.userId,
          title: owner.userName,
          description: `Discover amazing gaming experiences from ${owner.userName}. Explore their unique collection of games and enjoy endless entertainment.`,
          image: `/assets/owner-${(index % 3) + 1}.jpg`, // Placeholder images
        }))

        setOwners(simplifiedOwners)
        setError(null)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      console.error("Error fetching owners:", err)
      setError("Failed to load GameZone owners. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="attractions-wrapper">
        <div className="attractions-header">
          <h2 className="section-title">Our GameZone Owners</h2>
          <p className="section-subtitle">Loading amazing gaming experiences...</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading owners...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="attractions-wrapper">
        <div className="attractions-header">
          <h2 className="section-title">Our GameZone Owners</h2>
          <p className="section-subtitle">Discover endless fun and excitement</p>
        </div>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchOwners} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="attractions-wrapper">
      <div className="attractions-header">
        <h2 className="section-title">Our GameZone Owners</h2>
        <p className="section-subtitle">Discover endless fun and excitement from our amazing owners</p>
      </div>

      <div className="attractions-grid">
        {owners.map((owner, index) => (
          <div key={owner.id} className="attraction-card simple" style={{ "--animation-delay": `${index * 0.1}s` }}>
            <div className="card-content">
              <div className="attraction-image-container">
                <div className="image-wrapper">
                  <img src={owner.image || "/placeholder.svg"} alt={owner.title} className="attraction-image" />
                  <div className="image-overlay"></div>
                </div>
              </div>

              <div className="attraction-info">
                <h3 className="attraction-title">{owner.title}</h3>
                <p className="attraction-description">{owner.description}</p>

                <div className="card-actions">
                  <Link
                    to={`/owner-games/${owner.id}`}
                    state={{
                      ownerId: owner.id,
                      ownerName: owner.title,
                      returnPath: "/",
                    }}
                    className="explore-btn"
                  >
                    <span>Explore Games</span>
                    <svg className="arrow-icon" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7 17L17 7M17 7H7M17 7V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Owners Link */}
      <div className="view-all-section">
        <Link to="/gamezone-owners" className="view-all-btn">
          <span>View All GameZone Owners</span>
          <svg className="arrow-icon" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 17L17 7M17 7H7M17 7V17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default AttractionsSection
