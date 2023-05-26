import React, { useCallback, useEffect, useState } from "react"
interface User {
    token: any;
    loggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    user: any;
    setUser: React.Dispatch<any>;
    setToken: React.Dispatch<any>
    login: (user: any, token: any) => void;
    logout: () => void;
    


}


const AuthContext = React.createContext<User>({
    loggedIn: false,
    logout: function (): void {
        throw new Error("Function not implemented.");
    },

    login: function (user: any, token: any): void {
        throw new Error("Function not implemented.");
    },
    setLoggedIn: function (value: React.SetStateAction<boolean>): void {
        throw new Error("Function not implemented.");
    },
    user: null,
    setUser: function (value: any): void {
        throw new Error("Function not implemented.");
    },
    token: null,
    setToken: function (value: any): void {
        throw new Error("Function not implemented.");
    }
})


export const AuthProvider = ({ children }: any) => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false)
    const [user, setUser] = useState<any>(null)
    const [token, setToken] = useState<any>(null)
    const login = useCallback((user: any, token: any) => {
        setLoggedIn(true)
        setToken(token)
        setUser(user)
        localStorage.setItem('userData', JSON.stringify({ user: user, token: token }))
        localStorage.setItem('loggedin', JSON.stringify(true))
    }, [])
    const logout = useCallback(() => {
        setLoggedIn(false)
        setToken(null)
        setUser(null)
        localStorage.removeItem('userData')
        localStorage.setItem('loggedin', JSON.stringify(false))
        localStorage.removeItem('myCartItems')
        

    }, [])
    useEffect(() => {
        const storedData = localStorage.getItem('userData')
        if (typeof storedData === 'string') {
            const parse = JSON.parse(storedData)
            if (parse && parse.token) {
                login(parse.user, parse.token)
            }
        }
        const loggedin = localStorage.getItem('loggedin')
        if (typeof loggedin === 'string') {
            const parse = JSON.parse(loggedin)
            if (parse) {
                setLoggedIn(parse)
            }
        }


    }, [login, loggedIn])
    const data = {
        loggedIn,
        setLoggedIn,
        user,
        setUser,
        token,
        setToken,
        login,
        logout
    }
    return (
        <AuthContext.Provider value={data} >
            {children}
        </AuthContext.Provider >
    )
}
export default AuthContext;