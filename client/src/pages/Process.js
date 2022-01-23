import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import host from "../../host";
import NotAuthorized from "../fragments/NotAuthorized";
import UserFirst from "../fragments/UserFirst";
import UserSecond from "../fragments/UserSecond";
import UserThird from "../fragments/UserThird";
import UserFourth from "../fragments/UserFourth";
import UserFifth from "../fragments/UserFifth";
import NBEProcess from "../fragments/NBEProcess";
import CCProcess from "../fragments/CCProcess";

function Process(a) {
    const auth = useAuth();
    const [currProcess, setCurProcess] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const params = useParams();

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

    function getData() {
        const token = auth.get.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const id = params.id;

        axios
            .post(`${host}/process`, { id: id })
            .then((res) => {
                if (res.data) {
                    setCurProcess(res.data[0]);
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function selectUser(step) {
        switch (step) {
            case 1:
                return <UserFirst id={params.id} />;
            case 2:
                return <UserSecond id={params.id} />;
            case 3:
                return <UserThird id={params.id} reupload={false} />;
            case 4:
                return <UserFourth id={params.id} />;
            case 5:
                return <UserFifth id={params.id} />;
        }
    }

    function selectComponent(user, step) {
        switch (user) {
            case "1": //nbe
                if (step === 2)
                    return <NBEProcess id={params.id} type={user} />;
                else return <NotAuthorized user="National Bank of Ethiopia" />;

            case "2": //cc
                if (step === 4) return <CCProcess id={params.id} type={user} />;
                else return <NotAuthorized user="Customes Commission" />;

            default:
                return selectUser(step);
                break;
        }
    }

    return isLoading ? (
        <div className="w-100 text-center mt-5">
            <Spinner animation="grow" variant="warning" />
        </div>
    ) : (
        <div>{selectComponent(auth.get.id, currProcess.step)}</div>
    );
}

export default Process;
