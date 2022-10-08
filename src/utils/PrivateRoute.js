import React, { useContext } from "react"
import { Route, Redirect } from "react-router-dom"

import { AppContext } from '../contexts/AppContext'

export const PrivateRoute = ({ component: Component, ...rest }) => {
    const { appState } = useContext(AppContext)

    return (
        <Route
            {...rest}
            render={(props) =>
                appState.isLoggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{
                        pathname: '/login',
                        state: { from: props.location }
                    }} />
                )
            }
        />
    )
}