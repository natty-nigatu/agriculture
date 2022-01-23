import React from "react";
import PropTypes from "prop-types";
import { Card, Form } from "react-bootstrap";

function UploadCard({ title, description, refFile }) {
    return (
        <div className="pb-4">
            <h1 className="display-6 fs-2 mt-4">{title}</h1>
            <p className="fs-6 mb-3">{description}</p>

            <Form.Control
                className="border-0 shadow "
                type="file"
                ref={refFile}
            />
        </div>
    );
}

UploadCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    refFile: PropTypes.object.isRequired,
};

export default UploadCard;
