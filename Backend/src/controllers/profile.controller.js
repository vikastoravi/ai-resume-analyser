const userModel = require("../models/user.model")

function computeProfileCompletion(user) {
    let score = 0
    if (user.name) score += 20
    if (user.bio) score += 20
    if (user.avatar) score += 20
    if (Array.isArray(user.skills) && user.skills.length > 0) score += 20
    if (Array.isArray(user.interests) && user.interests.length > 0) score += 20
    return Math.min(score, 100)
}

async function getProfileController(req, res) {
    const user = await userModel.findById(req.user.id)

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({
        message: "Profile fetched successfully",
        profile: {
            id: user._id,
            username: user.username,
            email: user.email,
            name: user.name || "",
            avatar: user.avatar || "",
            bio: user.bio || "",
            skills: user.skills || [],
            interests: user.interests || [],
            profileCompletion: computeProfileCompletion(user),
            profileUpdatedAt: user.profileUpdatedAt || user.updatedAt,
            createdAt: user.createdAt
        }
    })
}

async function updateProfileController(req, res) {
    const { name, avatar, bio, skills, interests } = req.body

    const user = await userModel.findById(req.user.id)

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    if (name !== undefined) user.name = name
    if (avatar !== undefined) user.avatar = avatar
    if (bio !== undefined) user.bio = bio
    if (Array.isArray(skills)) user.skills = skills.filter(skill => typeof skill === "string" && skill.trim())
    if (Array.isArray(interests)) user.interests = interests.filter(interest => typeof interest === "string" && interest.trim())

    user.profileUpdatedAt = new Date()
    await user.save()

    res.status(200).json({
        message: "Profile updated successfully",
        profile: {
            id: user._id,
            username: user.username,
            email: user.email,
            name: user.name || "",
            avatar: user.avatar || "",
            bio: user.bio || "",
            skills: user.skills || [],
            interests: user.interests || [],
            profileCompletion: computeProfileCompletion(user),
            profileUpdatedAt: user.profileUpdatedAt,
            createdAt: user.createdAt
        }
    })
}

module.exports = {
    getProfileController,
    updateProfileController
}
