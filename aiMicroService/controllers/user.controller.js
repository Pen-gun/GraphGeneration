import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import apiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/ApiResponse.js';

const generateRefreshAndAccessToken = async (userid) => {
    try {
        const user = await User.findById(userid);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (err) {
        throw new apiError(500, "unable to generate tokens!");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body
    if (
        [fullName, username, email, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new apiError(400, "all field are required!");
    }
    const existed = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existed) {
        throw new apiError(409, "already existed user!")
    }
    const user = await User.create({
        fullName,
        email,
        username: username.toLowerCase(),
        password
    })
    const createdUser = await User.findById(user._id).select('-password -refreshToken');
    if (!createdUser) {
        throw new apiError(500, 'unable to create user')
    }
    return res.status(201).json(
        new apiResponse(200, createdUser, 'user created successfully')
    )

});

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username && !email) {
        throw new apiError(400, "username or email is required to login!");
    }
    if (!password) {
        throw new apiError(400, "password is required to login!");
    }
    const user = await User.findOne(
        {
            $or: [
                {
                    email: email,
                },
                {
                    username: username.toLowerCase(),
                }
            ]
        });
    if (!user) {
        throw new apiError(404, "user not found!");
    }
    const isPasswordMatched = await user.isPasswordCorrect(password);
    if (!isPasswordMatched) {
        throw new apiError(401, "invalid credentials!");
    }
    const {refreshToken, accessToken} = await generateRefreshAndAccessToken(user._id);
    const userData = await User.findById(user._id).select('-password -refreshToken');
    const isHttps = process.env.FRONTEND_URL?.startsWith('https://');
    const options = {
        httpOnly: true,
        secure: !!isHttps,
        sameSite: isHttps ? 'none' : 'lax',
        path: '/',
    };

    return res.status(200)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(
        new apiResponse(200, { user: userData, accessToken }, "login successful!")
    );
});

const logOutUser = asyncHandler(async (req, res) => {
    //fetch refresh token from cookies
    //validate refresh token
    //clear refresh token from db
    //clear cookies
    if(!req.user){
        throw new apiError(401, "user not logged in!");
    }
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: null
            }

        },
        {
            new: true
        }
    )
    const isHttps = process.env.FRONTEND_URL?.startsWith('https://');
    const options = {
        httpOnly: true,
        secure: !!isHttps,
        sameSite: isHttps ? 'none' : 'lax',
        path: '/',
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new apiResponse(200, null, "user logged out successfully")
        );

});
const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
        throw new apiError(400, "new password and confirm password do not match");
    }
    if (!oldPassword || !newPassword) {
        throw new apiError(400, "old password and new password are required");
    }
    const user = await User.findById(req.user._id);
    const isPasswordMathched = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordMathched) {
        throw new apiError(401, "old password is incorrect");
    }
    user.password = newPassword;
    user.refreshToken = null; // Invalidate existing refresh tokens
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(
        new apiResponse(200, null, "password changed successfully")
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new apiResponse(200, req.user, "current user fetched successfully")
    );
});

const updateAccount = asyncHandler(async (req, res) => {
    let { fullName, username, email } = req.body;

    // Trim inputs
    fullName = fullName?.trim();
    username = username?.trim();
    email = email?.trim()?.toLowerCase();

    if (!fullName && !username && !email) {
        throw new apiError(400, "At least one field is required to update!");
    }

    const userId = req.user._id;

    // Only check uniqueness if username or email is provided
    if (username || email) {
        const existed = await User.findOne({
            _id: { $ne: userId },
            $or: [
                username && { username },
                email && { email }
            ].filter(Boolean)
        });

        if (existed) {
            throw new apiError(409, "Username or email already in use!");
        }
    }

    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    return res.status(200).json(
        new apiResponse(200, updatedUser, "Account updated successfully")
    );
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incommingrefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!incommingrefreshToken) {
        throw new apiError(400, "refresh token is required!");
    }
    const decoded = jwt.verify(incommingrefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded?.userId);
    if(!user){
        throw new apiError(404, "user not found!");
    }
    if(incommingrefreshToken !== user.refreshToken){
        throw new apiError(401, "invalid refresh token!");
    }
    const isHttps = process.env.FRONTEND_URL?.startsWith('https://');
    const options = {
        httpOnly: true,
        secure: !!isHttps,
        sameSite: isHttps ? 'none' : 'lax',
        path: '/',
    };
    try {
        const {accessToken, refreshToken} = await generateRefreshAndAccessToken(user._id);
        return res.status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new apiResponse(200, { accessToken, refreshToken }, "access token refreshed successfully!")
        );
    } catch (error) {
        throw new apiError(500, "unable to refresh access token!");
    }
});

export { registerUser, loginUser, logOutUser, changePassword, getCurrentUser, updateAccount, refreshAccessToken };