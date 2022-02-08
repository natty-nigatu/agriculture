import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Container, Spinner, Alert, Form } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import ProcessCard from "../fragments/ProcessCard";
import axios from "axios";
import * as jsSearch from "js-search";
import host from "../../host";
import HomeSidebar from "../fragments/HomeSidebar";

function UserHome() {
    const [processes, setProcesses] = useState([]);
    const [counter, setCounter] = useState({});
    const [searchKey, setSearchKey] = useState("");
    const [searchEngine, setSearchEngine] = useState(() => {
        const search = new jsSearch.Search("id");
        search.addIndex("name");
        return search;
    });
    const [unfiltered, setUnfiltered] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const auth = useAuth();
    const navigate = useNavigate();

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

            auth.set((prev) => loggedInUser);
        } else getData();
    }, [auth]);

    useEffect(() => {
        if (searchKey.trim().length === 0) setProcesses(unfiltered);
        else setProcesses(searchEngine.search(searchKey));
    }, [searchKey]);

    function processDeleted() {
        getData();
    }

    function getData() {
        const token = auth.get.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const data = {};

        if (auth.get.type === "user") {
            data.user = auth.get.id;
        } else if (auth.get.type === "org") {
            if (auth.get.id === "1") data.step = 2;
            else data.step = 4;
        }

        axios
            .post(`${host}/process`, data)
            .then((res) => {
                if (res.data) {
                    setUnfiltered(res.data);
                    setProcesses(res.data);

                    const search = searchEngine;
                    search.addDocuments(res.data);

                    if (auth.get.type !== "user") {
                        search.addIndex("ownername");
                        search.addIndex("TIN");
                    }

                    setSearchEngine(search);

                    let counted = res.data.reduce(
                        (total, curr) => {
                            if (curr.status === 1)
                                return { ...total, active: total.active + 1 };
                            else if (curr.status === 0)
                                return { ...total, closed: total.closed + 1 };
                            else
                                return {
                                    ...total,
                                    rejected: total.rejected + 1,
                                };
                        },

                        { active: 0, rejected: 0, closed: 0 }
                    );

                    setCounter({ ...counted, total: res.data.length });

                    setIsLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return isLoading ? (
        <div className="w-100 text-center mt-5">
            <Spinner animation="grow" variant="warning" />
        </div>
    ) : (
        <div className="row">
            <div className="col-3">
                <HomeSidebar counter={counter} />
            </div>

            <div className="col-9">
                <Container className="px-5 pt-3" style={{ maxWidth: "1100px" }}>
                    <div className="d-flex justify-content-center mt-3 mx-auto">
                        <Form.Control
                            className="text-center border-0 shadow rounded-pill py-2"
                            type="text"
                            placeholder="Search"
                            value={searchKey}
                            onChange={(e) => setSearchKey(e.target.value)}
                            style={{ maxWidth: "500px" }}
                        />
                    </div>

                    <h1 className="display-6 my-4 text-center text-md-start">
                        Ongoing Processes
                        {auth.get.type === "user" && (
                            <Link
                                to="/process/new"
                                className="float-end btn btn-warning"
                            >
                                {" "}
                                <Plus size={25} /> Add New
                            </Link>
                        )}
                    </h1>

                    {auth.get.type !== "user" &&
                        (processes.filter((p) => p.status === 1).length ===
                        0 ? (
                            <Alert
                                className="display-6 text-center fs-3"
                                variant="warning"
                            >
                                {" "}
                                No Ongoing processes to show.
                            </Alert>
                        ) : (
                            processes.map((process) => {
                                if (process.status === 1)
                                    return (
                                        <ProcessCard
                                            key={process.id}
                                            process={process}
                                            processDeleted={processDeleted}
                                        />
                                    );
                            })
                        ))}

                    {auth.get.type === "user" &&
                        (processes.filter((p) => p.status !== 0).length ===
                        0 ? (
                            <Alert
                                className="display-6 text-center fs-3"
                                variant="warning"
                            >
                                {" "}
                                No Ongoing processes to show.
                            </Alert>
                        ) : (
                            processes.map((process) => {
                                if (process.status !== 0)
                                    return (
                                        <ProcessCard
                                            key={process.id}
                                            process={process}
                                            processDeleted={processDeleted}
                                        />
                                    );
                            })
                        ))}

                    {auth.get.type === "user" && (
                        <>
                            <h1 className="display-6 my-4 mt-5 text-center text-md-start">
                                Closed Processes
                            </h1>
                            {processes.filter((p) => p.status === 0).length ===
                            0 ? (
                                <Alert
                                    className="display-6 text-center fs-3"
                                    variant="warning"
                                >
                                    No Completed processes to show.
                                </Alert>
                            ) : (
                                processes.map((process) => {
                                    if (process.status === 0)
                                        return (
                                            <ProcessCard
                                                key={process.id}
                                                process={process}
                                                processDeleted={processDeleted}
                                            />
                                        );
                                })
                            )}
                        </>
                    )}
                </Container>
            </div>
        </div>
    );
}

export default UserHome;
