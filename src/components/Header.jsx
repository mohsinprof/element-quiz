import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";

export default function Header() {
    const { name } = useContext(UserContext);

    return (
        <header>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/quiz">Quiz</Link>
            </nav>
            <p>Welcome{ name ? `, ${name}` : "" }!</p>
        </header>
    );
}