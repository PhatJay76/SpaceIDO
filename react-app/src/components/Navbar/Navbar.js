import React from "react";
import { useState } from "react";
import logo from "../../images/Space logo-01.png";
import "./Navbar.css";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  return (
    <nav className="navbar">
      <img src={logo} alt="Logo" width="200px" />

      <ul className={isMobile ? "nav-links-mobile" : "nav-links"} onChange={() => setIsMobile(false)}>
        <li>
          <a className="twitter" href="https://twitter.com/spacemoney9" target="_blank" rel="noreferrer">
            Twitter
          </a>
        </li>
        <li>
          <a className="twitter" href="https://github.com/SpaceMoneydApp" target="_blank" rel="noreferrer">
            Github
          </a>
        </li>
        <li>
          <a className="twitter" href="https://t.me/SpaceDaoDapp" target="_blank" rel="noreferrer">
            Telegram
          </a>
        </li>
        <li>
          <a className="twitter" href="https://medium.com/@spacemoneydapp" target="_blank" rel="noreferrer">
            Medium
          </a>
        </li>
        <li>
          <a className="twitter" href="https://discord.com/invite/SXZXFtWZFH" target="_blank" rel="noreferrer">
            Discord
          </a>
        </li>
        <li>
          <a className="twitter" href="https://spacemoneydapp.gitbook.io/space-dao/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </li>
        <li>
          <a className="twitter" href="https://dao.spaceprojects.online/dashboard" target="_blank" rel="noreferrer">
            Space
          </a>
        </li>
      </ul>

      <button
        className="mobile-menu-icon"
        onClick={() => {
          setIsMobile(!isMobile);
        }}
      >
        {isMobile ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
      </button>
    </nav>
  );
};

export default Navbar;
