import { useState ,useEffect } from 'react'
import {Route ,Routes} from "react-router-dom";
import './App.css'
import Question from './components/Question.jsx';
import Results from './components/Results.jsx';
import Header from "./components/Header.jsx";
import UserForm from "./components/UserForm.jsx";
import {UserContext} from "./components/UserContext.jsx";


function App () {
    const[currentQuestionIndex , setCurrentQuestionIndex] = useState (0);
    const [answers, setAnswers] = useState([]);
    const [element, setElement] = useState("");
    const [artwork, setArtwork] = useState(null);
    const [userName , setUserName] = useState("");

    const questions = [
        {
            question: "What's your favorite color?",
            options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
        },
        {
            question: "Which season do you prefer?",
            options: ["Summer ☀️", "Winter ❄️", "Spring 🌸", "Autumn 🍂"],
        },
        {
            question: "Where would you rather go on vacation?",
            options: ["Mountain ⛰️", "Beach 🏖️", "City 🏙️", "Campfire 🔥"],
        },
    ];
    function handleAnswer(answer){
        setAnswers(prev => [...prev, answer]);
        setCurrentQuestionIndex(prev => prev + 1);
    }

    async function fetchArtwork(keyword) {
        try {
            // 1) search for object IDs that have images
            const searchRes = await fetch(
                `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(keyword)}&hasImages=true`
            );
            const searchData = await searchRes.json();

            const ids = searchData.objectIDs || [];
            if (ids.length === 0) {
                setArtwork(null);
                return;
            }

            // 2) try a few IDs to find one with a non-empty primaryImage
            for (let i = 0; i < Math.min(ids.length, 5); i++) {
                const id = ids[i];
                const objRes = await fetch(
                    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
                );
                const obj = await objRes.json();

                if (obj && obj.primaryImage) {
                    setArtwork(obj);
                    return;
                }
            }

            // fallback if none had an image
            setArtwork(null);
        } catch (err) {
            console.error('MET API error:', err);
            setArtwork(null);
        }
    }
    useEffect(() => {
        if (currentQuestionIndex === questions.length) {
            const selectedElement = determineElement(answers);
            setElement(selectedElement);

            const kw = keywords[selectedElement];
            if (kw) {
                fetchArtwork(kw);
            } else {
                setArtwork(null);
            }
        }
    }, [currentQuestionIndex]);
    function determineElement(ans) {
        const counts = {};
        ans.forEach(a => {
            const el = elements[a];
            if (!el) return;
            counts[el] = (counts[el] || 0) + 1;
        });

        const keys = Object.keys(counts);
        if (keys.length === 0) return ""; // guard for empty/no matches

        return keys.reduce((a, b) => (counts[a] > counts[b] ? a : b));
    }

    const keywords ={
        Fire:"fire",
        Water:"water",
        Earth:"earth",
        Air:"air",};
    const elements = {
        // Color → Element
        "Red 🔴": "Fire",
        "Blue 🔵": "Water",
        "Green 🟢": "Earth",
        "Yellow 🟡": "Air",

        // Season → Element
        "Summer ☀️": "Fire",
        "Winter ❄️": "Water",
        "Spring 🌸": "Earth",
        "Autumn 🍂": "Air",

        // Vacation → Element
        "Mountain ⛰️": "Earth",
        "Beach 🏖️": "Water",
        "City 🏙️": "Air",
        "Campfire 🔥": "Fire",
    };
    return ( <UserContext.Provider value={{ name: userName, setName: setUserName }}>
            <Header />
            <Routes>
                <Route path="/" element={<UserForm />} />
                <Route
                    path="/quiz"
                    element={
                        currentQuestionIndex < questions.length ? (
                            <Question
                                question={questions[currentQuestionIndex].question}
                                options={questions[currentQuestionIndex].options}
                                onAnswer={handleAnswer}
                            />
                        ) : (
                            <Results element={element} artwork={artwork} />
                        )
                    }
                />
            </Routes>
        </UserContext.Provider>
    );
}
export default App;
