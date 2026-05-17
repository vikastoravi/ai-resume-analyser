import api from "../../../lib/api"

export async function getProfile() {
    const response = await api.get("/api/profile")
    return response.data
}

export async function updateProfile(profileData) {
    const response = await api.put("/api/profile", profileData)
    return response.data
}
