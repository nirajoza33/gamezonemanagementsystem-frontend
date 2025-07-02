"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User, Loader, Minimize2, Maximize2 } from "lucide-react"
import "../css/ChatBot.css"

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🎮 Welcome to GameZone! I'm your gaming assistant. I can help you with games, bookings, offers, and reviews. What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
      suggestions: ["Show Games", "Check Offers", "My Bookings", "Game Reviews"],
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // API Base URL - adjust according to your setup
  const API_BASE_URL = "https://localhost:7186/api" // Update this to your API URL

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  // API Integration Functions
  const fetchGames = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/TblGames`)
      const games = await response.json()
      return games.slice(0, 6) // Show more games for better selection
    } catch (error) {
      console.error("Error fetching games:", error)
      return []
    }
  }

  const fetchOffers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/TblOffers/Featured`)
      const offers = await response.json()
      return offers.slice(0, 4) // Show more offers
    } catch (error) {
      console.error("Error fetching offers:", error)
      return []
    }
  }

  const fetchBookings = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/TblBookings?userId=${userId}`)
      const bookings = await response.json()
      return bookings.slice(0, 3)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      return []
    }
  }

  // Game Selection and Booking
  const handleGameSelect = (game) => {
    setSelectedGame(game)
    setShowBookingForm(true)

    const bookingMessage = {
      id: Date.now(),
      text: `Great choice! You selected "${game.title}". Let's proceed with booking.`,
      sender: "bot",
      timestamp: new Date(),
      type: "booking_form",
      data: game,
      suggestions: ["Confirm Booking", "Select Different Game", "Check Offers"],
    }

    setMessages((prev) => [...prev, bookingMessage])
  }

  const handleOfferClaim = (offer) => {
    const claimMessage = {
      id: Date.now(),
      text: `🎁 Awesome! You're interested in "${offer.title}". This offer gives you ${offer.discountDisplay}!`,
      sender: "bot",
      timestamp: new Date(),
      type: "offer_details",
      data: offer,
      suggestions: ["Claim Offer", "View Terms", "Show Games"],
    }

    setMessages((prev) => [...prev, claimMessage])
  }

  // Message Processing
  const processMessage = async (message) => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("game") || lowerMessage.includes("play")) {
      return await handleGamesQuery()
    } else if (lowerMessage.includes("offer") || lowerMessage.includes("discount") || lowerMessage.includes("deal")) {
      return await handleOffersQuery()
    } else if (lowerMessage.includes("booking") || lowerMessage.includes("reserve")) {
      return await handleBookingsQuery()
    } else if (lowerMessage.includes("review") || lowerMessage.includes("rating")) {
      return await handleReviewsQuery()
    } else if (lowerMessage.includes("help")) {
      return handleHelpQuery()
    } else if (lowerMessage.includes("confirm booking")) {
      return handleBookingConfirmation()
    } else if (lowerMessage.includes("select different game")) {
      return await handleGamesQuery()
    } else {
      return handleGeneralQuery(message)
    }
  }

  const handleGamesQuery = async () => {
    const games = await fetchGames()
    if (games.length > 0) {
      return {
        text: "🎮 Here are our popular games. Click on any game to book:",
        type: "games",
        data: games,
        suggestions: ["Check Offers", "My Bookings", "Game Reviews"],
      }
    }
    return {
      text: "Sorry, I couldn't fetch the games right now. Please try again later.",
      suggestions: ["Try Again", "Check Offers", "Help"],
    }
  }

  const handleOffersQuery = async () => {
    const offers = await fetchOffers()
    if (offers.length > 0) {
      return {
        text: "🎁 Check out these amazing offers. Click to learn more:",
        type: "offers",
        data: offers,
        suggestions: ["Show Games", "My Bookings", "Help"],
      }
    }
    return {
      text: "No active offers available right now. Check back soon for exciting deals!",
      suggestions: ["Show Games", "My Bookings", "Help"],
    }
  }

  const handleBookingsQuery = async () => {
    const userId = 1 // Get from auth context in real implementation
    const bookings = await fetchBookings(userId)
    if (bookings.length > 0) {
      return {
        text: "📅 Here are your recent bookings:",
        type: "bookings",
        data: bookings,
        suggestions: ["New Booking", "Cancel Booking", "Show Games"],
      }
    }
    return {
      text: "You don't have any bookings yet. Would you like to book a game?",
      suggestions: ["Show Games", "Check Offers", "Help"],
    }
  }

  const handleReviewsQuery = async () => {
    return {
      text: "⭐ I can help you with game reviews! Which game would you like to see reviews for?",
      suggestions: ["Show Games", "Popular Reviews", "Write Review"],
    }
  }

  const handleBookingConfirmation = () => {
    if (selectedGame) {
      return {
        text: `✅ Booking confirmed for "${selectedGame.title}"! You'll receive a confirmation email shortly. Booking ID: #${Math.floor(Math.random() * 10000)}`,
        suggestions: ["New Booking", "My Bookings", "Show Games"],
      }
    }
    return {
      text: "Please select a game first to proceed with booking.",
      suggestions: ["Show Games", "Check Offers", "Help"],
    }
  }

  const handleHelpQuery = () => {
    return {
      text: `🤖 I can help you with:
      
• 🎮 Browse and book games
• 📅 Check your bookings
• 🎁 Find offers and deals
• ⭐ Read game reviews
• 💬 General gaming questions

What would you like to do?`,
      suggestions: ["Show Games", "Check Offers", "My Bookings", "Game Reviews"],
    }
  }

  const handleGeneralQuery = (message) => {
    const responses = [
      "That's interesting! Is there anything specific about our games you'd like to know?",
      "I'm here to help with your gaming needs! Try asking about games, bookings, or offers.",
      "Great question! Let me know if you need help with games, bookings, or special offers.",
      "I'd love to help! Feel free to ask about our games, current offers, or your bookings.",
    ]

    return {
      text: responses[Math.floor(Math.random() * responses.length)],
      suggestions: ["Show Games", "Check Offers", "My Bookings", "Help"],
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion)
    handleSendMessage(suggestion)
  }

  const handleSendMessage = async (messageText = inputText) => {
    if (!messageText.trim()) return

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsLoading(true)
    setIsTyping(true)

    setTimeout(async () => {
      try {
        const response = await processMessage(messageText)
        const botMessage = {
          id: Date.now() + 1,
          text: response.text,
          sender: "bot",
          timestamp: new Date(),
          type: response.type,
          data: response.data,
          suggestions: response.suggestions,
        }

        setMessages((prev) => [...prev, botMessage])
      } catch (error) {
        const errorMessage = {
          id: Date.now() + 1,
          text: "Sorry, I encountered an error. Please try again.",
          sender: "bot",
          timestamp: new Date(),
          suggestions: ["Try Again", "Help"],
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
        setIsTyping(false)
      }
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const renderMessageContent = (message) => {
    if (message.type === "games" && message.data) {
      return (
        <div className="games-list">
          <p className="message-text">{message.text}</p>
          <div className="games-grid">
            {message.data.map((game, index) => (
              <div key={index} className="game-card clickable" onClick={() => handleGameSelect(game)}>
                <div className="game-info">
                  <h4>{game.title}</h4>
                  <p className="game-category">{game.cname}</p>
                  <p className="game-price">₹{game.pricing}</p>
                  <div className="game-actions">
                    <span className="book-btn">📅 Book Now</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (message.type === "offers" && message.data) {
      return (
        <div className="offers-list">
          <p className="message-text">{message.text}</p>
          <div className="offers-grid">
            {message.data.map((offer, index) => (
              <div key={index} className="offer-card clickable" onClick={() => handleOfferClaim(offer)}>
                <div className="offer-info">
                  <h4>{offer.title}</h4>
                  <p className="offer-discount">{offer.discountDisplay}</p>
                  <p className="offer-time">{offer.timeLeft}</p>
                  <div className="offer-actions">
                    <span className="claim-btn">🎁 Learn More</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (message.type === "bookings" && message.data) {
      return (
        <div className="bookings-list">
          <p className="message-text">{message.text}</p>
          <div className="bookings-grid">
            {message.data.map((booking, index) => (
              <div key={index} className="booking-card">
                <div className="booking-info">
                  <h4>Booking #{booking.bookingId}</h4>
                  <p className="booking-date">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                  <p className="booking-status">{booking.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (message.type === "booking_form" && message.data) {
      return (
        <div className="booking-form">
          <p className="message-text">{message.text}</p>
          <div className="selected-game">
            <h4>🎮 {message.data.title}</h4>
            <p>Category: {message.data.cname}</p>
            <p>Price: ₹{message.data.pricing}</p>
            <div className="booking-details">
              <p>📅 Select your preferred date and time to complete the booking.</p>
            </div>
          </div>
        </div>
      )
    }

    if (message.type === "offer_details" && message.data) {
      return (
        <div className="offer-details">
          <p className="message-text">{message.text}</p>
          <div className="selected-offer">
            <h4>🎁 {message.data.title}</h4>
            <p className="offer-description">{message.data.description}</p>
            <p className="offer-discount-big">{message.data.discountDisplay}</p>
            <p className="offer-validity">Valid until: {new Date(message.data.validUntil).toLocaleDateString()}</p>
          </div>
        </div>
      )
    }

    return <p className="message-text">{message.text}</p>
  }

  if (!isOpen) {
    return (
      <div className="chatbot-trigger" onClick={() => setIsOpen(true)}>
        <div className="trigger-icon">
          <MessageCircle size={24} />
        </div>
        <div className="trigger-pulse"></div>
        <div className="trigger-notification">💬</div>
      </div>
    )
  }

  return (
    <div className={`chatbot-container ${isMinimized ? "minimized" : ""}`}>
      <div className="chatbot-header">
        <div className="header-info">
          <div className="bot-avatar">
            <Bot size={20} />
          </div>
          <div className="bot-details">
            <h3>GameZone Assistant</h3>
            <span className="status">Online</span>
          </div>
        </div>
        <div className="header-controls">
          <button className="control-btn" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button className="control-btn close-btn" onClick={() => setIsOpen(false)}>
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-avatar">
                  {message.sender === "bot" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="message-content">
                  {renderMessageContent(message)}
                  <span className="message-time">{formatTime(message.timestamp)}</span>

                  {message.suggestions && (
                    <div className="suggestions">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="suggestion-btn"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message bot typing">
                <div className="message-avatar">
                  <Bot size={16} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <div className="input-container">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about games, bookings, offers..."
                disabled={isLoading}
              />
              <button
                className="send-btn"
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim()}
              >
                {isLoading ? <Loader size={18} className="spinning" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ChatBot
