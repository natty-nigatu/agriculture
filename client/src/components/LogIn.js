import { useEffect, useRef, useState } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import host from "../host";
const axios = require("axios");

function LogIn({ org }) {
    const auth = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const usernameRef = useRef();
    const passwordRef = useRef();

    useEffect(() => {
        let loggedInUser;
        if (Object.keys(auth.get).length === 0) {
            try {
                const loggedString = localStorage.getItem("loggedInUser");
                if (loggedString.trim().length === 0) return;
                loggedInUser = JSON.parse(loggedString);
            } catch {
                return;
            }

            auth.set((prev) => loggedInUser);
            return navigate("/");
        }
    }, []);

    function executeLogin(e) {
        e.preventDefault();
        setError(null);

        //verify
        let user = {
            username: usernameRef.current.value.trim(),
            password: passwordRef.current.value.trim(),
            type: org ? "org" : "user",
        };

        for (const property in user) {
            if (!user[property])
                return setError(`Cannot log in, ${property} cannot be empty.`);
        }

        if (org) {
            if (user.username.length < 3)
                return setError("Username is too short.");

            if (user.password.length < 7)
                return setError("Password is too short.");
        } else {
            if (user.username.length < 5)
                return setError("Username is too short.");

            if (user.password.length < 8)
                return setError("Password is too short.");
        }
        axios
            .post(`${host}/login`, user)
            .then((res) => {
                if (res.data) {
                    if (res.data === "error")
                        return setError("Invalid username or password.");

                    delete user.password;
                    user.id = res.data.id;
                    user.token = res.data.token;

                    auth.set((prev) => user);
                    localStorage.setItem("loggedInUser", JSON.stringify(user));
                    return navigate("/");
                }
                setError("Cannot log in, an error occured");
            })
            .catch((error) => {
                return setError("Cannot log in, an error occured");
            });
    }

    return (
        <Container className="mt-5 pd-5" style={{ maxWidth: "500px", paddingTop: "5rem" }}>
            <Card className="shadow border-0">
                <Card.Body>
                    <h2 className="text-center mb-3 text-warning">
                        Log In {org && <span className="text-danger">Org</span>}
                    </h2>
                    <Form>
                        {error !== null && (
                            <Alert variant="danger">{error}</Alert>
                        )}

                        <Form.Group id="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="username"
                                ref={usernameRef}
                                required
                            />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                ref={passwordRef}
                                required
                            />
                        </Form.Group>

                        <Button
                            className="w-100 mt-3 mb-2"
                            type="submit"
                            variant="warning"
                            onClick={executeLogin}
                        >
                            Log In
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {!org && (
                <div className="w-100 text-center mt-5">
                    Don't have an account?{" "}
                    <Link to="/signup" className="btn btn-warning">
                        Sign Up
                    </Link>
                </div>
            )}
        </Container>
    );
}

export default LogIn;
