import React from "react";
import { CheckCircleFill } from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import PropTypes from "prop-types";

function CheckMark({ color, tip }) {
    const renderTooltip = (tip, props) => (
        <Tooltip id="button-tooltip" {...props}>
            {tip}
        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 150, hide: 200 }}
            overlay={renderTooltip.bind(this, tip)}
        >
            <CheckCircleFill
                className="align-baseline me-1 mb-1"
                size={20}
                color={color}
                style={{ position: "relative", zIndex: "99", cursor: "help" }}
            />
        </OverlayTrigger>
    );
}

CheckMark.propTypes = {
    color: PropTypes.string.isRequired,
    tip: PropTypes.string.isRequired,
};

export default CheckMark;
