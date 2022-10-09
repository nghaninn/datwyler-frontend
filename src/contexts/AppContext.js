import React, { createContext, useEffect, useReducer } from "react"

export const AppContext = createContext()

const initialState = {
    isLoggedIn: false,
    user: {},
}

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_LOGIN":
            return {
                ...state,
                isLoggedIn: action.payload,
            }
        case "SET_USER":
            return {
                ...state,
                user: action.payload,
            }
        default:
    }
}

const AppContextProvider = (props) => {
    const [appState, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (localStorage.getItem("account")) {
            getFromLocalStorage()
        }
    }, [])


    const getFromLocalStorage = async () => {
        const user = JSON.parse(localStorage.getItem("account"))
        if (user) {
            // console.log('getFromLocalStorage', user);
            actionLogin(user)
        }
    }

    // Actions
    const actionLogin = (user) => {
        localStorage.removeItem("account")
        localStorage.setItem("account", JSON.stringify(user))
        dispatch({ type: "SET_LOGIN", payload: true })
        dispatch({ type: "SET_USER", payload: user })
    }

    return (
        <AppContext.Provider value={{ appState, actionLogin }}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider