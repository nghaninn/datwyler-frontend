import React, { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"

import han from "../media/han.png"

const HeaderApp = () => {
    const location = useLocation()

    useEffect(() => {
        window.scrollTo({ top: 0 })
    }, [location])

    return (
        <div className="header">
            <div className="header-content">
                <div className="left">
                    <Link to={{ pathname: 'https://me.nghaninn.com' }} target="_blank" className="item">
                        <img src={han} width={50} alt="me" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HeaderApp
