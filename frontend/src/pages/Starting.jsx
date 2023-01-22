import React, { useState } from "react";
import { useEffect } from "react";
import socket from "../socket";
import "./../css/starting.css";
import Playground from "./Playground";
function Starting() {
  const [tempName, setTempName] = useState("");
  const [flagSetName, setFlagSetName] = useState(false);
  const [name, setName] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [userJoinData, setuserJoinData] = useState([]);
  const [room, setRoom] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const joinRoom = (room) => {
    socket.emit("joinRoom", {
      name,
      state: isReady,
      room,
    });
    setRoom(room);
  };
  const GetStateData = (state) => {
    return state ? "Ready" : "Not ready";
  };
  const CheckingShakeUser = () => {
    const user = userJoinData.find((item) => item.name === name);
    if (user?.shake) {
      setIsShaking(true);
    }
  };
  useEffect(() => {
    socket.on("updateDataInRoom", (data) => {
      setuserJoinData(data);
    });
    socket.on("readyToPlay", (data) => {
      setIsPlaying(true);
      setuserJoinData(data);
      CheckingShakeUser();
    });
  }, []);

  return isPlaying ? (
    <Playground onReturn={(value) => setIsPlaying(value)} />
  ) : (
    <div className="wrapper">
      <div className="userConfig">
        <input
          className="input"
          placeholder="Your name"
          onChange={(e) => setTempName(e.target.value)}
          disabled={name}
        ></input>
        <button
          className="btn"
          onClick={() => {
            setName(tempName);
            setFlagSetName(true);
          }}
          disabled={!tempName || flagSetName}
        >
          Confirm name
        </button>
        <button
          className="btn"
          disabled={!name || !room}
          onClick={() => {
            const isLocalReady = !isReady;
            setIsReady(isLocalReady);
            socket.emit("updateReadyState", {
              name,
              state: isLocalReady,
              room,
            });
          }}
        >
          {isReady ? "CANCEL" : "READY"}
        </button>
      </div>
      <div className="roomArea">
        <div className="room room_1">
          <div
            className={`label ${userJoinData.length > 0 ? "label-border" : ""}`}
          >
            ROOM 1{" "}
            <button
              disabled={!name}
              className="roomJoin"
              onClick={() => {
                joinRoom("ROOM1");
              }}
            >
              JOIN
            </button>
          </div>
          {userJoinData.map((item) => (
            <div key={item.name} className="tempUserItem">
              <span>{item.name}</span> <span>{GetStateData(item.state)}</span>
            </div>
          ))}
        </div>
        <div className="room room_2">
          <div
            className={`label ${userJoinData.length > 0 ? "label-border" : ""}`}
          >
            ROOM 2{" "}
            <button
              className="roomJoin"
              onClick={() => {
                joinRoom("ROOM2");
              }}
            >
              JOIN
            </button>
          </div>
        </div>
        <div className="room room_3">
          <div
            className={`label ${userJoinData.length > 0 ? "label-border" : ""}`}
          >
            ROOM 3{" "}
            <button
              className="roomJoin"
              onClick={() => {
                joinRoom("ROOM3");
              }}
            >
              JOIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Starting;
