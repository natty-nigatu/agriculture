import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Button } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import host from "../../host";
import CheckMark from "./CheckMark";
import DeleteProcess from "./DeleteProcess";
import { Folder2Open } from "react-bootstrap-icons";

function ProcessCard({ process, processDeleted }) {
    const auth = useAuth();
    const [user, setUser] = useState({});
    const [color, setColor] = useState({
        first: "lightgray",
        second: "lightgray",
        third: "lightgray",
        fourth: "lightgray",
    });

    useEffect(() => {
        axios.post(`${host}/user`, { id: process.user }).then((res) => {
            if (typeof res.data[0] === "object") {
                setUser(res.data[0]);
            }
        });

        let tempColor = color;
        process.step > 1 && (tempColor.first = "green");
        process.step > 3 && (tempColor.third = "green");

        if (process.step > 2) tempColor.second = "green";
        else if (process.step == 2 && process.status === -1)
            tempColor.second = "red";

        if (process.step > 4) tempColor.fourth = "green";
        else if (process.step == 4 && process.status === -1)
            tempColor.fourth = "red";

        setColor(tempColor);
    }, []);

    return (
        <Card className="mb-3 shadow border-0 display-6 fs-3 text-black text-decoration-none ">
            <Card.Body>
                {auth.get.id === "1" || auth.get.id === "2" ? (
                    <div>
                        <span className="d-inline-flex flex-column m-0">
                            <span className="fs-4">{user.name}</span>
                            <span className="fs-5">{process.name}</span>
                        </span>

                        <Link
                            className="stretched-link btn btn-warning float-end my-auto"
                            to={`/process/${process.id}`}
                        >
                            <Folder2Open size={20} className="me-2" />
                            Open
                        </Link>

                        <span className="float-end mx-5 align-bottom">TIN: {user.TIN}</span>
                    </div>
                ) : (
                    <>
                        <Link
                            className="stretched-link text-decoration-none text-black"
                            to={`/process/${process.id}`}
                        >
                            {process.name}
                        </Link>

                        <DeleteProcess
                            id={process.id}
                            callback={processDeleted}
                        />

                        <span className="float-end">
                            <CheckMark
                                color={color.first}
                                tip="Upload files to get permit"
                            />
                            <CheckMark
                                color={color.second}
                                tip="Get permit to proceed to shipping"
                            />
                            <CheckMark
                                color={color.third}
                                tip="Upload Declaration for inspection"
                            />
                            <CheckMark
                                color={color.fourth}
                                tip="Process Cleared"
                            />
                        </span>
                    </>
                )}
            </Card.Body>
        </Card>
    );
}

ProcessCard.propTypes = {
    process: PropTypes.object.isRequired,
    processDeleted: PropTypes.func.isRequired,
};

export default ProcessCard;
