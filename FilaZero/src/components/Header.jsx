import React from 'react';
import { Home, Menu, User } from 'lucide-react';
import minhaLogo from '../assets/logo.png'; 
import './Header.css';

export default function Header() {
  return (
    <header className="header-container">
    
      <a href="/" className="logo-link">
        <img src={minhaLogo} alt="Logo" className="minhaLogo" />
      </a>

      
      <nav className="nav">
        <Home className="icon" size={24} color="#000" />
        <Menu className="icon" size={24} color="#000" />
        <User className="icon" size={24} color="#000" />
      </nav>
    </header>
  );
}


