import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./Components/Main";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import Error404 from "./Components/Ex404";
import "./App.css";

const App = () => {
  return (
    <Router>
      <NavBar />
      <div className="content" style={styles}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

const styles = {
  minHeight: "80vh",
};

export default App;
