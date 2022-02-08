import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { CheckCircleFill } from "react-bootstrap-icons";

function ProcessSidebar({ step, status, name }) {
    const [color, setColor] = useState({});

    useEffect(() => {
        let tempColor = {
            first: "lightgray",
            second: "lightgray",
            third: "lightgray",
            fourth: "lightgray",
        };

        step > 1 && (tempColor.first = "green");
        step > 3 && (tempColor.third = "green");

        if (step > 2) tempColor.second = "green";
        else if (step === 2 && status === -1) tempColor.second = "red";

        if (step > 4) tempColor.fourth = "green";
        else if (step === 4 && status === -1) tempColor.fourth = "red";

        setColor(tempColor);
    }, []);

    function getCheck(color) {
        return <CheckCircleFill className="me-1" size={30} color={color} />;
    }

    return (
        <div className="bg-dark text-light h-100 col-3 position-fixed pt-4 px-3">
            <div className="display-6 ms-1 mt-3 fs-5">Current Process:</div>
            <div className="display-6 mb-3 ms-3 fs-2">{name}</div>
            <br />
            <div className="display-6 mb-3 ms-1 fs-4">Process Status:</div>
            <div className="mb-3">
                {getCheck(color.first)} Upload files to get permit
            </div>
            <div className="mb-3">
                {getCheck(color.second)} Get permit to procced to shipping
            </div>
            <div className="mb-3">
                {getCheck(color.third)} Upload declaration for inspection
            </div>
            <div className="mb-3">{getCheck(color.fourth)} Process cleared</div>

            <Link to="/" className="btn btn-warning w-100 mt-5">
                Back to Home
            </Link>
        </div>
    );
}

ProcessSidebar.propTypes = {
    step: PropTypes.number.isRequired,
    status: PropTypes.number.isRequired,
    name: PropTypes.number.isRequired,
};

export default ProcessSidebar;
