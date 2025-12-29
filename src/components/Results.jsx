import React, { useContext } from "react";
import { UserContext } from "./UserContext.jsx";

export default function Results({ element, artwork }) {
    const { name } = useContext(UserContext);

    return (
        <div>
            <p>
                <strong>{name || "Friend"}</strong>, your element is: {element || "—"}
            </p>
            {artwork && artwork.primaryImage ? (
                <div className="artwork">
                    <h2>{artwork.title || "Untitled"}</h2>
                    <img src={artwork.primaryImage} alt={artwork.title || "Artwork"} />
                    {artwork.artistDisplayName && <p>{artwork.artistDisplayName}</p>}
                    {artwork.objectDate && <p>{artwork.objectDate}</p>}
                </div>
            ) : (
                <p>No artwork found.</p>
            )}
        </div>
    );
}