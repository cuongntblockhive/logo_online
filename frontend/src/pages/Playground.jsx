import React from "react";
import "./../css/playground.css";
import loto1 from "./../assets/images/loto1.jpg";
import { useState, useEffect } from "react";
import socket from "../socket";
function PlayGround(props) {
    const [oldNumber , setOldNumnber] = useState([])
    useEffect(() => {
        socket.on("callingNumber", (data) => {
            setOldNumnber(data);
        });
      }, []);

      const handleWin = () => {
        
      }
      const handleReturn = () => {
        props.onReturn(false)
      }
  const handleClick = (event) => {
    if (event.detail === 2) {
      const x = event.clientX;
      const y = event.clientY;
      console.log("x", x, "y", y);
      const spanE = document.createElement("span");
      spanE.style.width = "10px";
      spanE.style.height = "10px";
      spanE.style.borderRadius  = "50px";
      spanE.style.backgroundColor  = "red";
      spanE.style.position = "absolute";
      spanE.style.left = x - 5 + "px";
      spanE.style.top = y - 5    + "px";
      console.log("double click");
      const wrapper = document.querySelector(".wrapper")
      wrapper.appendChild(spanE)
    }
  };
  return (
    <div className="wrapper">
        <div className="control">
            <button onClick={handleWin} className="btn">Kinh rồi</button>
            <button onClick={handleReturn} className="btn">Quay lại, chơi ván khác</button>
        </div>
      <img src={loto1} className="paper" onClick={handleClick} />
      <div className="resultNumber">
        {
        oldNumber.map((item, index) => <div className={`ball ${index === oldNumber.length - 1 ? 'newest': ''}`}>{item}</div>)
      }
      </div>
      
    </div>
  );
}

export default PlayGround;
