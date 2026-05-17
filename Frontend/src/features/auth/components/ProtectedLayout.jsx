import { useState } from "react"
import { Link, Outlet, useNavigate } from "react-router"
import { useAuth } from "../hooks/useAuth"
import "./ProtectedLayout.scss"

const ProtectedLayout = () => {
    const { user, loading, handleLogout } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate()

    const onLogout = async () => {
        try {
            await handleLogout()
            navigate("/login")
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) {
        return (
            <main className="loading-screen">
                <h1>Loading your dashboard...</h1>
            </main>
        )
    }

    return (
        <div className="app-shell">
            <header className="app-shell__header">
                <div className="app-shell__brand">Resume AI Builder</div>

                <nav className="app-shell__nav">
                    <Link to="/" className="app-shell__link">Resume History</Link>
                    <Link to="/profile" className="app-shell__link">Profile</Link>
                </nav>

                <div className="app-shell__actions">
                    <button
                        className="app-shell__avatar"
                        type="button"
                        onClick={() => setMenuOpen(open => !open)}
                    >
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Profile" />
                        ) : (
                            <span>{user?.name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || "U"}</span>
                        )}
                    </button>
                    <div className={`app-shell__menu ${menuOpen ? "app-shell__menu--open" : ""}`}>
                        <Link to="/profile" className="app-shell__menu-item" onClick={() => setMenuOpen(false)}>
                            Profile
                        </Link>
                        <Link to="/" className="app-shell__menu-item" onClick={() => setMenuOpen(false)}>
                            Resume History
                        </Link>
                        <button className="app-shell__menu-item app-shell__logout" onClick={onLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>
            <main className="app-shell__content">
                <Outlet />
            </main>
        </div>
    )
}

export default ProtectedLayout
