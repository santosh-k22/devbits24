// import { useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./LandingPage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Blog from "./components/Blog";
import Dashboard from "./components/Dashboard";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <Router>
      <>
        {/* Hola, I am Santosh
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}{" "}
      </button> */}

        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/signUp" element={<SignUp />} />
          <Route exact path="/signIn" element={<SignIn />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/blog" element={<Blog />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
