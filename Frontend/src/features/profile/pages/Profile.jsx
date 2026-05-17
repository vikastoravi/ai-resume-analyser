import React, { useEffect, useMemo, useState } from "react"
import { getProfile, updateProfile } from "../services/profile.api"
import { useAuth } from "../../auth/hooks/useAuth"
import "../style/profile.scss"

const defaultAvatar = "https://via.placeholder.com/128?text=Avatar"

const Profile = () => {
    const { user } = useAuth()
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        avatar: "",
        bio: "",
        skills: [],
        interests: [],
        profileCompletion: 0,
        profileUpdatedAt: null
    })
    const [skillInput, setSkillInput] = useState("")
    const [interestInput, setInterestInput] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState({ type: "", message: "" })

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await getProfile()
                setProfile(response.profile)
            } catch (err) {
                setToast({ type: "error", message: "Unable to load profile. Please try again." })
            } finally {
                setLoading(false)
            }
        }
        loadProfile()
    }, [])

    const addSkill = () => {
        const skill = skillInput.trim()
        if (!skill) return
        if (profile.skills.includes(skill)) {
            setToast({ type: "error", message: "Skill already added." })
            return
        }
        setProfile(prev => ({ ...prev, skills: [ ...prev.skills, skill ] }))
        setSkillInput("")
    }

    const removeSkill = (skill) => {
        setProfile(prev => ({ ...prev, skills: prev.skills.filter(item => item !== skill) }))
    }

    const addInterest = () => {
        const interest = interestInput.trim()
        if (!interest) return
        if (profile.interests.includes(interest)) {
            setToast({ type: "error", message: "Interest already added." })
            return
        }
        setProfile(prev => ({ ...prev, interests: [ ...prev.interests, interest ] }))
        setInterestInput("")
    }

    const removeInterest = (interest) => {
        setProfile(prev => ({ ...prev, interests: prev.interests.filter(item => item !== interest) }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSaving(true)
        try {
            const body = {
                name: profile.name,
                avatar: profile.avatar,
                bio: profile.bio,
                skills: profile.skills,
                interests: profile.interests
            }
            const response = await updateProfile(body)
            setProfile(response.profile)
            setToast({ type: "success", message: "Profile saved successfully." })
        } catch (err) {
            setToast({ type: "error", message: "Unable to update profile. Please try again." })
        } finally {
            setSaving(false)
            setTimeout(() => setToast({ type: "", message: "" }), 3000)
        }
    }

    const completionText = useMemo(() => {
        return `${profile.profileCompletion || 0}% Complete`
    }, [profile.profileCompletion])

    if (loading) {
        return (
            <main className="profile-page loading-screen">
                <h1>Loading profile...</h1>
            </main>
        )
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-avatar-card">
                    <img
                        src={profile.avatar || defaultAvatar}
                        alt="Profile avatar"
                        className="profile-avatar"
                    />
                    <div className="profile-avatar-label">Profile Image URL</div>
                </div>
                <div className="profile-meta">
                    <h1>{profile.name || user?.username || "Your Profile"}</h1>
                    <p className="profile-email">{profile.email || user?.email}</p>
                    <span className="profile-completion">{completionText}</span>
                    <p className="profile-updated">Last updated: {profile.profileUpdatedAt ? new Date(profile.profileUpdatedAt).toLocaleString() : "Not updated yet"}</p>
                </div>
            </div>

            <form className="profile-form" onSubmit={handleSubmit}>
                <div className="profile-section">
                    <div className="section-heading">
                        <h2>About</h2>
                        <p>Keep your bio and interests current so AI suggestions stay relevant.</p>
                    </div>
                    <div className="field-grid">
                        <label>
                            Name
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Full name"
                            />
                        </label>
                        <label>
                            Profile picture URL
                            <input
                                type="url"
                                value={profile.avatar}
                                onChange={(e) => setProfile(prev => ({ ...prev, avatar: e.target.value }))}
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </label>
                    </div>
                    <label className="full-width">
                        Bio / About
                        <textarea
                            rows={5}
                            value={profile.bio}
                            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell us more about your career focus, strengths, and goals..."
                        />
                    </label>
                </div>

                <div className="profile-section">
                    <div className="section-heading">
                        <h2>Skills</h2>
                        <p>Add skills to make your profile more relevant.</p>
                    </div>
                    <div className="tag-input-row">
                        <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            placeholder="Add a skill and press Enter"
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                        />
                        <button type="button" className="button secondary-button" onClick={addSkill}>Add Skill</button>
                    </div>
                    <div className="chips-row">
                        {profile.skills.map(skill => (
                            <button key={skill} type="button" className="tag-chip" onClick={() => removeSkill(skill)}>
                                {skill} <span>×</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="profile-section">
                    <div className="section-heading">
                        <h2>Interests</h2>
                        <p>Capture hobbies or career interests in one place.</p>
                    </div>
                    <div className="tag-input-row">
                        <input
                            type="text"
                            value={interestInput}
                            onChange={(e) => setInterestInput(e.target.value)}
                            placeholder="Add an interest and press Enter"
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                        />
                        <button type="button" className="button secondary-button" onClick={addInterest}>Add Interest</button>
                    </div>
                    <div className="chips-row">
                        {profile.interests.map(interest => (
                            <button key={interest} type="button" className="tag-chip" onClick={() => removeInterest(interest)}>
                                {interest} <span>×</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="button primary-button" disabled={saving}>
                        {saving ? "Saving profile..." : "Save Profile"}
                    </button>
                </div>
            </form>

            {toast.message && (
                <div className={`toast ${toast.type === "error" ? "toast--error" : "toast--success"}`}>
                    {toast.message}
                </div>
            )}
        </div>
    )
}

export default Profile
