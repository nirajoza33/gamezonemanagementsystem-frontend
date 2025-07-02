"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import "../css/AboutUs.css"
import Navbar from "./Navbar"
import {
  FaGamepad,
  FaUsers,
  FaTrophy,
  FaStar,
  FaHeart,
  FaRocket,
  FaShieldAlt,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaQuoteLeft,
  FaPlay,
  FaAward,
  FaHandshake,
  FaLightbulb,
  FaSpinner,
} from "react-icons/fa"

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("story")
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [topReviews, setTopReviews] = useState([])
  const [loading, setLoading] = useState(true)

  // Beautiful gaming-themed images
  const heroImages = {
    story:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    mission:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    vision:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  }

  const teamMembers = [
    {
      id: 1,
      name: "Niraj Oza",
      role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      bio: "Gaming enthusiast with 15+ years in entertainment industry. Passionate about creating unforgettable experiences.",
      social: {
        linkedin: "#",
        twitter: "#",
      },
    },
    
    {
      id: 2,
      name: "Meet Bharucha",
      role: "Technical Director",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      bio: "VR and gaming technology specialist. Brings cutting-edge innovations to our gaming experiences.",
      social: {
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      id: 3,
      name: "Samarth Mashruwala",
      role: "Customer Experience Manager",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      bio: "Dedicated to ensuring every visitor has an amazing time. Customer satisfaction is her top priority.",
      social: {
        linkedin: "#",
        facebook: "#",
      },
    },
  ]

  const achievements = [
    {
      icon: <FaTrophy />,
      number: "50K+",
      label: "Happy Customers",
      color: "#f59e0b",
    },
    {
      icon: <FaAward />,
      number: "15+",
      label: "Gaming Awards",
      color: "#8b5cf6",
    },
    {
      icon: <FaStar />,
      number: "4.9",
      label: "Average Rating",
      color: "#f9c349",
    },
    {
      icon: <FaClock />,
      number: "24/7",
      label: "Operating Hours",
      color: "#10b981",
    },
  ]

  const values = [
    {
      icon: <FaHeart />,
      title: "Customer First",
      description: "Every decision we make is centered around creating the best possible experience for our customers.",
      color: "#ef4444",
    },
    {
      icon: <FaLightbulb />,
      title: "Innovation",
      description: "We constantly evolve and bring the latest gaming technologies and experiences to our venue.",
      color: "#f59e0b",
    },
    {
      icon: <FaHandshake />,
      title: "Community",
      description: "Building connections and bringing people together through the joy of gaming and entertainment.",
      color: "#8b5cf6",
    },
    {
      icon: <FaShieldAlt />,
      title: "Safety & Quality",
      description:
        "Maintaining the highest standards of safety and quality in all our gaming equipment and facilities.",
      color: "#10b981",
    },
  ]

  // Fetch top 3 reviews dynamically
  useEffect(() => {
    fetchTopReviews()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % topReviews.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [topReviews.length])

  const fetchTopReviews = async () => {
    try {
      setLoading(true)
      const response = await axios.get("https://localhost:7186/api/TblReviews")

      // Sort reviews by rating (highest first) and likes, then take top 3
      const sortedReviews = response.data
        .sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating
          }
          return b.likes - a.likes
        })
        .slice(0, 3)
        .map((review) => ({
          id: review.reviewId,
          name: review.userName,
          role: "Verified Customer",
          image:
            review.userImage ||
            `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80`,
          text: review.reviewText,
          rating: review.rating,
          game: review.gameTitle,
          date: review.createdDate,
        }))

      setTopReviews(sortedReviews)
    } catch (error) {
      console.error("Error fetching top reviews:", error)
      // Fallback to static testimonials if API fails
      setTopReviews([
        {
          id: 1,
          name: "David Kumar",
          role: "Regular Customer",
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80",
          text: "Playvana has become our go-to place for family fun. The variety of games and the quality of service is outstanding!",
          rating: 5,
          game: "VR Adventure",
        },
        {
          id: 2,
          name: "Priya Sharma",
          role: "Birthday Party Host",
          image:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80",
          text: "Hosted my son's birthday party here and it was perfect! The staff went above and beyond to make it special.",
          rating: 5,
          game: "Arcade Zone",
        },
        {
          id: 3,
          name: "Raj Patel",
          role: "Corporate Event Organizer",
          image:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80",
          text: "Excellent venue for team building activities. Professional service and amazing gaming facilities.",
          rating: 5,
          game: "Team Challenge",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(<FaStar key={i} className={`star-icon ${i <= rating ? "filled" : "empty"}`} />)
    }
    return stars
  }

  return (
    <>
      <Navbar />
      <div className="about-us-page">
        {/* Background Effects */}
        <div className="about-bg-overlay"></div>
        <div className="about-bg-pattern"></div>
        <div className="about-floating-elements">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div className="floating-orb orb-5"></div>
        </div>

        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content">
            <div className="hero-badge">
              <FaRocket className="badge-icon" />
              <span>About Playvana</span>
            </div>
            <h1 className="hero-title">
              <span className="title-line-1">Where Family</span>
              <span className="title-line-2">Time Starts</span>
            </h1>
            <p className="hero-subtitle">
              We're passionate about creating unforgettable gaming experiences that bring people together, spark joy,
              and create lasting memories for players of all ages.
            </p>
            <div className="hero-video-btn">
              <button className="video-play-btn">
                <FaPlay className="play-icon" />
                <span>Watch Our Story</span>
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Gaming Experience"
              className="hero-main-image"
            />
            <div className="hero-image-overlay"></div>
          </div>
        </section>

        {/* Story Tabs Section */}
        <section className="story-section">
          <div className="story-container">
            <div className="story-header">
              <h2 className="section-title">Our Journey</h2>
              <p className="section-subtitle">Discover the story behind Playvana and what drives us forward</p>
            </div>

            <div className="story-tabs">
              <button
                className={`tab-btn ${activeTab === "story" ? "active" : ""}`}
                onClick={() => setActiveTab("story")}
              >
                <FaGamepad className="tab-icon" />
                <span>Our Story</span>
              </button>
              <button
                className={`tab-btn ${activeTab === "mission" ? "active" : ""}`}
                onClick={() => setActiveTab("mission")}
              >
                <FaRocket className="tab-icon" />
                <span>Mission</span>
              </button>
              <button
                className={`tab-btn ${activeTab === "vision" ? "active" : ""}`}
                onClick={() => setActiveTab("vision")}
              >
                <FaStar className="tab-icon" />
                <span>Vision</span>
              </button>
            </div>

            <div className="story-content">
              {activeTab === "story" && (
                <div className="story-card active">
                  <div className="story-text">
                    <h3>How It All Started</h3>
                    <p>
                      Playvana was born from a simple idea: to create a space where people of all ages could come
                      together and experience the pure joy of gaming. Founded in 2020 by a group of gaming enthusiasts,
                      we started with just a few arcade machines and a big dream.
                    </p>
                    <p>
                      What began as a small local gaming center has now evolved into a premier entertainment destination
                      featuring cutting-edge VR experiences, classic arcade games, bowling alleys, and much more. Our
                      journey has been driven by our community's enthusiasm and our commitment to innovation.
                    </p>
                    <p>
                      Today, we're proud to be the go-to destination for families, friends, and gaming enthusiasts
                      looking for unforgettable experiences. Every game, every smile, every moment of joy validates our
                      mission to bring people together through the magic of gaming.
                    </p>
                  </div>
                  <div className="story-image">
                    <img src={heroImages.story || "/placeholder.svg"} alt="Our Story" className="story-img" />
                    <div className="image-overlay"></div>
                  </div>
                </div>
              )}

              {activeTab === "mission" && (
                <div className="story-card active">
                  <div className="story-text">
                    <h3>Our Mission</h3>
                    <p>
                      To create extraordinary gaming experiences that bring people together, foster connections, and
                      provide a safe, fun environment where memories are made and friendships are forged.
                    </p>
                    <p>
                      We believe that gaming is more than just entertainment – it's a way to connect, learn, compete,
                      and grow. Our mission is to provide state-of-the-art gaming facilities, exceptional customer
                      service, and innovative experiences that exceed expectations.
                    </p>
                    <div className="mission-points">
                      <div className="mission-point">
                        <FaUsers className="point-icon" />
                        <span>Building Community Through Gaming</span>
                      </div>
                      <div className="mission-point">
                        <FaHeart className="point-icon" />
                        <span>Creating Lasting Memories</span>
                      </div>
                      <div className="mission-point">
                        <FaShieldAlt className="point-icon" />
                        <span>Ensuring Safe & Fun Environment</span>
                      </div>
                    </div>
                  </div>
                  <div className="story-image">
                    <img src={heroImages.mission || "/placeholder.svg"} alt="Our Mission" className="story-img" />
                    <div className="image-overlay"></div>
                  </div>
                </div>
              )}

              {activeTab === "vision" && (
                <div className="story-card active">
                  <div className="story-text">
                    <h3>Our Vision</h3>
                    <p>
                      To become the world's most beloved gaming destination, setting new standards for entertainment
                      experiences and inspiring the next generation of gamers and innovators.
                    </p>
                    <p>
                      We envision a future where Playvana locations around the globe serve as community hubs, bringing
                      together people from all walks of life through the universal language of gaming and fun.
                    </p>
                    <div className="vision-goals">
                      <div className="vision-goal">
                        <div className="goal-number">2025</div>
                        <div className="goal-text">Expand to 5 new cities</div>
                      </div>
                      <div className="vision-goal">
                        <div className="goal-number">100K</div>
                        <div className="goal-text">Happy customers annually</div>
                      </div>
                      <div className="vision-goal">
                        <div className="goal-number">50+</div>
                        <div className="goal-text">Gaming experiences</div>
                      </div>
                    </div>
                  </div>
                  <div className="story-image">
                    <img src={heroImages.vision || "/placeholder.svg"} alt="Our Vision" className="story-img" />
                    <div className="image-overlay"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="achievements-section">
          <div className="achievements-container">
            <h2 className="section-title">Our Achievements</h2>
            <div className="achievements-grid">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="achievement-card"
                  style={{ "--accent-color": achievement.color, "--delay": `${index * 0.1}s` }}
                >
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-number">{achievement.number}</div>
                  <div className="achievement-label">{achievement.label}</div>
                  <div className="achievement-glow"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="values-container">
            <div className="values-header">
              <h2 className="section-title">Our Core Values</h2>
              <p className="section-subtitle">The principles that guide everything we do</p>
            </div>
            <div className="values-grid">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="value-card"
                  style={{ "--accent-color": value.color, "--delay": `${index * 0.1}s` }}
                >
                  <div className="value-icon">{value.icon}</div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                  <div className="value-glow"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="team-container">
            <div className="team-header">
              <h2 className="section-title">Meet Our Team</h2>
              <p className="section-subtitle">The passionate people behind Playvana's success</p>
            </div>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={member.id} className="team-card" style={{ "--delay": `${index * 0.1}s` }}>
                  <div className="member-image-container">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="member-image"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=300&width=300"
                      }}
                    />
                    <div className="member-overlay">
                      <div className="member-social">
                        {member.social.linkedin && (
                          <a href={member.social.linkedin} className="social-link">
                            <FaLinkedinIn />
                          </a>
                        )}
                        {member.social.twitter && (
                          <a href={member.social.twitter} className="social-link">
                            <FaTwitter />
                          </a>
                        )}
                        {member.social.facebook && (
                          <a href={member.social.facebook} className="social-link">
                            <FaFacebookF />
                          </a>
                        )}
                        {member.social.instagram && (
                          <a href={member.social.instagram} className="social-link">
                            <FaInstagram />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">{member.name}</h3>
                    <p className="member-role">{member.role}</p>
                    <p className="member-bio">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Testimonials Section */}
        <section className="testimonials-section">
          <div className="testimonials-container">
            <div className="testimonials-header">
              <h2 className="section-title">Top Customer Reviews</h2>
              <p className="section-subtitle">Real experiences from our amazing community</p>
            </div>

            {loading ? (
              <div className="testimonials-loading">
                <FaSpinner className="loading-spinner" />
                <p>Loading top reviews...</p>
              </div>
            ) : (
              <div className="testimonials-carousel">
                <div className="testimonial-card active">
                  <div className="testimonial-content">
                    <FaQuoteLeft className="quote-icon" />
                    <p className="testimonial-text">{topReviews[currentTestimonial]?.text}</p>
                    <div className="testimonial-rating">{renderStars(topReviews[currentTestimonial]?.rating || 5)}</div>
                    {topReviews[currentTestimonial]?.game && (
                      <div className="testimonial-game">
                        <FaGamepad className="game-icon" />
                        <span>Played: {topReviews[currentTestimonial].game}</span>
                      </div>
                    )}
                    {topReviews[currentTestimonial]?.date && (
                      <div className="testimonial-date">
                        <FaClock className="date-icon" />
                        <span>{formatDate(topReviews[currentTestimonial].date)}</span>
                      </div>
                    )}
                  </div>
                  <div className="testimonial-author">
                    <img
                      src={topReviews[currentTestimonial]?.image || "/placeholder.svg"}
                      alt={topReviews[currentTestimonial]?.name}
                      className="author-image"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=80&width=80"
                      }}
                    />
                    <div className="author-info">
                      <h4 className="author-name">{topReviews[currentTestimonial]?.name}</h4>
                      <p className="author-role">{topReviews[currentTestimonial]?.role}</p>
                    </div>
                  </div>
                </div>
                <div className="testimonial-dots">
                  {topReviews.map((_, index) => (
                    <button
                      key={index}
                      className={`dot ${index === currentTestimonial ? "active" : ""}`}
                      onClick={() => setCurrentTestimonial(index)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="contact-container">
            <div className="contact-header">
              <h2 className="section-title">Get In Touch</h2>
              <p className="section-subtitle">We'd love to hear from you and answer any questions</p>
            </div>
            <div className="contact-grid">
              <div className="contact-info">
                <div className="contact-item">
                  <div className="contact-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="contact-details">
                    <h3>Visit Us</h3>
                    <p>Y Junction, Dumas Road, Surat, Gujarat 395007</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <FaPhone />
                  </div>
                  <div className="contact-details">
                    <h3>Call Us</h3>
                    <p>+91 98765 43210</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <FaEnvelope />
                  </div>
                  <div className="contact-details">
                    <h3>Email Us</h3>
                    <p>hello@Playvana.com</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <FaClock />
                  </div>
                  <div className="contact-details">
                    <h3>Operating Hours</h3>
                    <p>Mon-Sun: 10:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>
              <div className="contact-map">
                <iframe
                  title="Playvana Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3722.309361314106!2d72.78993601533227!3d21.104570385980095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f8cb0cdcf61%3A0xc53e48b528d62064!2sY%20Junction%20Dumas%20Road%20BRTS!5e0!3m2!1sen!2sin!4v1653462222295!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: "16px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default AboutPage
