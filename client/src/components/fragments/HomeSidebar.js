import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../contexts/AuthContext";

function HomeSidebar({ counter }) {
    const auth = useAuth();
    return (
        <div className="bg-dark text-light h-100 col-3 position-fixed pt-4 px-5">
            <div className="display-6 fs-3 my-3">Status Report</div>
            <div className="row">
                <div className="display-6 fs-5 col-6 mt-2">
                    Active Processes
                </div>
                <div className="display-5 text-warning text-end col-4">
                    {counter.active}
                </div>
            </div>

            <div className="row mt-4">
                <div className="display-6 fs-5 col-6 mt-2">
                    Rejected Processes
                </div>
                <div className="display-5 text-warning text-end col-4">
                    {counter.rejected}
                </div>
            </div>

            {auth.get.type == "user" && (
                <div className="row mt-4">
                    <div className="display-6 fs-5 col-6 mt-2">
                        Closed Processes
                    </div>
                    <div className="display-5 text-warning text-end col-4">
                        {counter.closed}
                    </div>
                </div>
            )}

            <div className="row mt-4">
                <div className="display-6 fs-5 col-6 mt-3">Total Processes</div>
                <div className="display-5 text-warning text-end col-4">
                    {counter.total}
                </div>
            </div>
        </div>
    );
}

HomeSidebar.propTypes = {
    counter: PropTypes.object.isRequired,
};

export default HomeSidebar;
