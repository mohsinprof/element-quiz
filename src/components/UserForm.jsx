import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";

export default function UserForm() {
    const { setName } = useContext(UserContext);
    const [localName, setLocalName] = useState("");
    const navigate = useNavigate();

    function onSubmit(e) {
        e.preventDefault();
        const trimmed = localName.trim();
        if (!trimmed) return;
        setName(trimmed);
        navigate("/quiz");
    }

    return (
        <form onSubmit={onSubmit}>
            <label>
                Enter your name:
                <input
                    type="text"
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    placeholder="Your name"
                />
            </label>
            <button type="submit">Start Quiz</button>
        </form>
    );
}