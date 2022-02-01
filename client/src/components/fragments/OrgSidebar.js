import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircleFill } from "react-bootstrap-icons";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import host from "../../host";
import { Card } from "react-bootstrap";

function OrgSidebar() {
    const auth = useAuth();

    const [processes, setProcesses] = useState([]);

    useEffect(() => {
        const token = auth.get.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const data = {};

        if (auth.get.id === "1") data.step = 2;
        else data.step = 4;

        axios
            .post(`${host}/process`, data)
            .then((res) => {
                if (res.data) {
                    setProcesses(res.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    function getCheck(color) {
        return <CheckCircleFill className="me-1" size={30} color={color} />;
    }

    return (
        <div className="bg-dark text-light h-100 col-3 position-fixed pt-4 px-3">
            
            <div className="display-6 mb-3 ms-1 fs-4">Ongoing Processes:</div>

            <div className="overflow-auto h-75">
                {processes.map((process) => {
                    if(process.status === 1)
                    return (
                            <Card key={process.id} className="bg-dark mb-2 border py-1 px-2" >
                                <h1 className="display-6 fs-4 mb-1">
                                    {process.ownername}
                                </h1>
                                <h1 className="display-6 fs-6 mb-0">
                                    {process.TIN}
                                </h1>
                                <h1 className="display-6 fs-6 ">
                                 {process.name}
                                </h1>
                                <a
                                    href={`/process/${process.id}`}
                                    className="stretched-link"
                                />
                            </Card>
                    );
                })}
            </div>

            <Link to="/" className="btn btn-warning w-100 my-3">
                Back to Home
            </Link>

        </div>
    );
}

export default OrgSidebar;
