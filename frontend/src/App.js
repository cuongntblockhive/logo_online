import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Starting from "./pages/Starting";
import socket from "./socket";
import { useEffect } from "react";
import "./App.css"


function App() {
  useEffect(() => {
    return () => {
      socket.on("disconnect", () => {
        console.log(socket.id);
      });
    };
  }, []);
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Starting />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
