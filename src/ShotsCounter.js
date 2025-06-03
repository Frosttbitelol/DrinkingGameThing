import React, { useState } from "react";
import "./ShotsCounter.css";

const ESP8266_IP = "http://192.168.4.1"; // Replace this with your actual ESP8266 IP address

function ShotsCounter() {
    const [numParticipants, setNumParticipants] = useState("");
    const [participants, setParticipants] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNumParticipantsChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setNumParticipants(value);
            setParticipants(Array(value).fill("").map(() => ({ name: "", drinks: 0 })));
        } else {
            setNumParticipants("");
            setParticipants([]);
        }
    };

    const handleNameChange = (index, name) => {
        const updated = [...participants];
        updated[index].name = name;
        setParticipants(updated);
    };

    const handleStartGame = (e) => {
        e.preventDefault();
        if (participants.some((p) => p.name.trim() === "")) {
            alert("Please enter names for all participants!");
            return;
        }
        setGameStarted(true);
        setCurrentIndex(0);
    };

    const handleResetGame = () => {
        setGameStarted(false);
        setNumParticipants("");
        setParticipants([]);
        setCurrentIndex(0);
    };

    const incrementDrink = async () => {
        try {
            // Send request to ESP8266 to pour alcohol
            await fetch(`${ESP8266_IP}/pour`, { method: "GET" });

            const updated = [...participants];
            updated[currentIndex].drinks += 1;
            setParticipants(updated);
            goToNextPerson();
        } catch (error) {
            alert("Failed to communicate with ESP8266.");
            console.error("ESP8266 error:", error);
        }
    };

    const goToNextPerson = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % participants.length);
    };

    return (
        <div className="shots-counter-container">
            {!gameStarted ? (
                <div className="setup">
                    <h1>Drinking Game Setup</h1>
                    <form onSubmit={handleStartGame}>
                        <label htmlFor="numParticipants">Number of Participants:</label>
                        <input
                            type="number"
                            id="numParticipants"
                            min="1"
                            value={numParticipants}
                            onChange={handleNumParticipantsChange}
                        />
                        {participants.map((p, index) => (
                            <div key={index}>
                                <label htmlFor={`participant-${index}`}>Participant {index + 1}:</label>
                                <input
                                    type="text"
                                    id={`participant-${index}`}
                                    value={p.name}
                                    onChange={(e) => handleNameChange(index, e.target.value)}
                                />
                            </div>
                        ))}
                        <button type="submit">Start Game</button>
                    </form>
                </div>
            ) : (
                <div className="game">
                    <h1>Drinking Game Tracker</h1>
                    <h2>Next to Drink: <span className="current-player">{participants[currentIndex].name}</span></h2>
                    <button onClick={incrementDrink}>Pour</button>
                    <button onClick={goToNextPerson}>Pass</button>
                    <ul>
                        {participants.map((p, index) => (
                            <li key={index}>
                                <strong>{p.name}</strong> - Drinks: {p.drinks}
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleResetGame}>Reset Game</button>
                </div>
            )}
        </div>
    );
}

export default ShotsCounter;
