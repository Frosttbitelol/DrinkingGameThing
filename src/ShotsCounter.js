import React, { useState } from "react";
import "./ShotsCounter.css";

function ShotsCounter() {
    const [numParticipants, setNumParticipants] = useState("");
    const [participants, setParticipants] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);

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
    };

    const handleResetGame = () => {
        setGameStarted(false);
        setNumParticipants("");
        setParticipants([]);
    };

    const incrementDrink = (index) => {
        const updated = [...participants];
        updated[index].drinks += 1;
        setParticipants(updated);
    };

    const decrementDrink = (index) => {
        const updated = [...participants];
        if (updated[index].drinks > 0) updated[index].drinks -= 1;
        setParticipants(updated);
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
                    <ul>
                        {participants.map((p, index) => (
                            <li key={index}>
                                <strong>{p.name}</strong> - Drinks: {p.drinks}
                                <button onClick={() => incrementDrink(index)}>+1</button>
                                <button onClick={() => decrementDrink(index)}>-1</button>
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