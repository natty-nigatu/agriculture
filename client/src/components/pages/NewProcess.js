import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Container, Card, Form, Alert, Button } from "react-bootstrap";
import host from "../../host";
import axios from "axios";

function NewProcess() {
    const auth = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState(null);

    const nameRef = useRef();

    useEffect(() => {
        let loggedInUser;
        if (Object.keys(auth.get).length === 0) {
            try {
                const loggedString = localStorage.getItem("loggedInUser");
                if (loggedString.trim().length === 0) return navigate("/login");
                loggedInUser = JSON.parse(loggedString);
            } catch {
                return navigate("/login");
            }

            if (loggedInUser.type !== "user") return navigate("/login");

            auth.set((prev) => loggedInUser);
        } else {
            if (auth.get.type !== "user") navigate("/");
        }
    }, [auth]);

    function executeLogin(e) {
        e.preventDefault();
        setError(null);

        const name = nameRef.current.value.trim();

        if (name.length < 3) return setError("Process name is too short.");

        axios
            .put(`${host}/process`, { user: auth.get.id, name })
            .then((res) => {
                if (res.data.id) return navigate(`/process/${res.data.id}`);

                setError("Cannot add process, an error occured");
            })
            .catch((error) => {
                console.log(error);
                setError("Cannot add process, an error occured");
            });
    }

    return (
        <Container className=" pt-5  px-5" style={{ maxWidth: "1000px" }}>
            <h1 className="display-6 my-4 text-center text-md-start">
                Add a new process
            </h1>
            <Card className="shadow border-0">
                <Card.Body>
                    <Form>
                        {error !== null && (
                            <Alert variant="danger">{error}</Alert>
                        )}

                        <Form.Group id="name">
                            <Form.Label className="display-6 fs-3">
                                Process Name
                            </Form.Label>
                            <Form.Control type="text" ref={nameRef} required />
                        </Form.Group>
                        <Button
                            className="w-100 mt-3 mb-2"
                            type="submit"
                            variant="warning"
                            onClick={executeLogin}
                        >
                            Add Process
                        </Button>
                        <Link to="/" className="btn btn-secondary w-100">
                            Back
                        </Link>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default NewProcess;
