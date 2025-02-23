import {asyncHandler} from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import mongoose from "mongoose"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        "Something went wrong while generating refresh and access token! "
      );
    }
  };



const registerUser = asyncHandler(async (req, res) => {

  
    const { firstName, lastName, email, username, password, collegeName } = req.body;
    if(!firstName || !lastName || !email || !username || !password || !collegeName){
      throw new ApiError(400, "All fields are required! ");}
    if (
      [firstName, lastName, email, username, password, collegeName].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required! ");
    }
  console.log(`Details Received! `);
  
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existedUser) {
      throw new ApiError(409, "User with Email or Username already exists");
    }
  console.log(`No Existing User Found! `);
  
 
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      collegeName,
      username: username?.toLowerCase(),
    });
    console.log(`User Created! `);
    
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user! "
      );
    }
    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered succesfully"));
  });
  
const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body;
    console.log(`Username: ${username} Email: ${email} Password: ${password}`);
    
    if (!username && !email) {
      throw new ApiError(400, "Username or email is Required");
    }
    console.log(`Details received from Login Frontend`)
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
  
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }
  console.log(`User Found! `);
  
    const isPasswordValid = await user.isPasswordCorrect(password);
  console.log(`Password Validated! `);
  
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid User Credentials");
    }
  
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );
  
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
  
    const options = {
  
      httpOnly: true, 
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User Logged in Successfully"
        )
      );
  });
  
  const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
      req.user_id,
      {
        $set: {
          refeshToken: undefined,
        },
      },
      {
        new: true,
      }
    );
  
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User Logged Out"));
  });
  
  const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized Request! ");
    }
  
    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
  
      const user = await User.findById(decodedToken?._id);
      if (!user) {
        throw new ApiError(401, "Invalid refresh token! ");
      }
  
      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh Token is Expired or Used");
      }
  
      const options = {
        httpOnly: true,
        secure: true,
      };
      const { accessToken, newRefeshToken } =
        await generateAccessAndRefreshTokens(user._id);
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefeshToken, options)
        .json(
          new ApiResponse(
            200,
            { accessToken, refreshToken: newRefeshToken },
            "Access Token Refreshed! "
          )
        );
    } catch (error) {
      throw new ApiError(401, error?.messsage || "Invalid Refresh Token");
    }
  });
  
  const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?.id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid Old Password");
    }
    user.password = newPassword;
    await user, save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password Changed Successfully"));
  });
  
  const getCurrentUser = asyncHandler(async (req, res) => {
    return res
      .status(200)
      .json(new ApiResponse(200, req.user, "User fetched successfully! "));
  });
  
  const updateAccountDetails = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, collegeName } = req.body;
    if (!firstName || !email || !lastName || !collegeName) {
      throw new ApiError(400, "All fields are required! ");
    }
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          firstName,
          lastName,
          email: email,
          collegeName
        },
      },
      { new: true }
    ).select("-password");
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Account details updated succesfully"));
  });

  export {
    registerUser,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
   
  };
  