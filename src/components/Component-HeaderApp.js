import React, { useContext, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"

import { AppContext } from "../contexts/AppContext"
// import HeaderNav from "./Component-HeaderNav";

const HeaderApp = () => {
    // const { appState } = useContext(AppContext)
    const location = useLocation()
    // console.log("location", location);

    useEffect(() => {
        window.scrollTo({ top: 0 })
    }, [location])

    return (
        <div className="header">
            <div className="header-content">
                <div className="left">
                    {/* <HeaderNav view="mobile" /> */}
                    <Link to={'/'} className="item">
                        {/* <img src={Logo} /> */} a
                    </Link>
                    {/* <HeaderNav view="desktop" /> */}
                </div>
            </div>
        </div>
    );
};

export default HeaderApp
