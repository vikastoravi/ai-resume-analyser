import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe, setAuthToken } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (data?.token) {
                localStorage.setItem("token", data.token)
                setAuthToken(data.token)
            }
            setUser(data.user)
            return data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            if (data?.token) {
                localStorage.setItem("token", data.token)
                setAuthToken(data.token)
            }
            setUser(data.user)
            return data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
            localStorage.removeItem("token")
            setAuthToken(null)
            return data
        } catch (err) {
            throw err
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        if (storedToken) {
            setAuthToken(storedToken)
        }

        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) {
                localStorage.removeItem("token")
                setAuthToken(null)
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}