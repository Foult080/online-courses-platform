import React from "react";
import { Link } from "react-router-dom";
import { FaGlobe, FaGithub, FaRegListAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer mt-auto py-4 bg-light text-white">
      <div style={styles.footer}>
        <p>
          Online-Courses-Platform &copy; Площадка с образовательными материалами
          не претендующая на достоверность <FaGlobe />
        </p>
        <Link to="/privacy" style={styles.link}>
          Политика конфиденциальности <FaRegListAlt />
        </Link>
        <a
          href="https://github.com/Foult080"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          <p>
            Created by @foult080 <FaGithub />
          </p>
        </a>
      </div>
    </footer>
  );
};

const styles = {
  link: {
    textDecoration: "none",
  },
  footer: {
    textAlign: "center",
    paddingTop: "0.5rem",
    paddingBottom: "1rem",
    color: "#007bff",
  },
};

export default Footer;
