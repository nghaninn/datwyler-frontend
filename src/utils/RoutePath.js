import React from "react"
import { Route, Switch } from "react-router-dom"

import Error404 from "../components/Page-Error-404"
import Home from "../components/Page-Home"
import Login from "../components/Page-Login"
import { PrivateRoute } from "./PrivateRoute"

const RoutePath = () => {
    return (
        <Switch>
            <Route path={"/login"} component={Login} />
            <PrivateRoute path={'/'} component={Home} />
            <Route component={Error404} />
        </Switch>
    )
}

export default RoutePath