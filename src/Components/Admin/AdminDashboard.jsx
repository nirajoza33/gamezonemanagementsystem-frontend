import React, { useEffect, useState } from 'react'
import AdminNavbar from './AdminNavbar'
// import { motion } from 'framer-motion';
// import { Users, TowerControl as GameController, ArrowUpRight, Calendar, DollarSign, User } from 'lucide-react';
// import StatCard from './ui/StatCard';
// import AreaChart from './ui/AreaChart';
import axios from 'axios';
// // import '../../index.css'
// import './AdminCss/admin.css'

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [recentGames, setRecentGames] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://localhost:7186/api/TblUsers");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    const fetchGames = async () => {
      try {
        const res = await axios.get("https://localhost:7186/api/TblGames");
        setGames(res.data);

        // Assuming recent games are last 5 added games
        const sortedRecent = res.data.slice(-5).reverse();
        setRecentGames(sortedRecent);
      } catch (err) {
        console.error("Failed to fetch games", err);
      }
    };

    fetchUsers();
    fetchGames();
  }, []);
  
  

  return (
    <div>
      
    </div>
  )
}

export default AdminDashboard
