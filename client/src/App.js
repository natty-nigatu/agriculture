import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./components/Signup";
import ContextProviders from "./contexts/ContextProviders";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LogIn from "./components/LogIn";
import UserHome from "./components/pages/Home";
import Process from "./components/pages/Process";
import Logout from "./components/Logout";
import NewProcess from "./components/pages/NewProcess";
import Account from "./components/pages/Account";
import Footer from "./components/Footer";

function App() {
    return (
        <ContextProviders>
            <Router>
                <Header />
                <div className="mt-5">
                    <Routes>
                        <Route path="/" element={<UserHome />} />
                        <Route path="/org" element={<LogIn org={true} />} />
                        <Route path="/login" element={<LogIn />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/process/new" element={<NewProcess />} />
                        <Route path="/process/:id" element={<Process />} />
                    </Routes>
                </div>
                <Footer />
            </Router>
        </ContextProviders>
    );
}

export default App;
