import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./components/Signup";
import ContextProviders from "./contexts/ContextProviders";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LogIn from "./components/LogIn";
import UserHome from "./components/user/UserHome";

function App() {
    return (
        <ContextProviders>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<UserHome />} />
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </Router>
        </ContextProviders>
    );
}

export default App;
