import React from "react";
import PropTypes from "prop-types";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function UserWait({ step }) {
    return (
        <Container className="d-flex align-items-center flex-column">
            <h1
                className="display-5 text-center mt-5"
                style={{ maxWidth: "800px" }}
            >
                Process needs {step} to be granted to continue.
            </h1>
            <Link to="/" className="btn btn-warning mt-5 w-100">
                Go Back to Home
            </Link>
        </Container>
    );
}

UserWait.propTypes = {
    step: PropTypes.string.isRequired,
};

export default UserWait;
