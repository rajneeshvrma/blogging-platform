import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatar: user.avatar,
      coverPhoto: user.coverPhoto,
      twitter: user.twitter,
      linkedin: user.linkedin,
      followers: user.followers,
      following: user.following,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.location = req.body.location !== undefined ? req.body.location : user.location;
    user.website = req.body.website !== undefined ? req.body.website : user.website;
    user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;
    user.coverPhoto = req.body.coverPhoto !== undefined ? req.body.coverPhoto : user.coverPhoto;
    user.twitter = req.body.twitter !== undefined ? req.body.twitter : user.twitter;
    user.linkedin = req.body.linkedin !== undefined ? req.body.linkedin : user.linkedin;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      bio: updatedUser.bio,
      location: updatedUser.location,
      website: updatedUser.website,
      avatar: updatedUser.avatar,
      coverPhoto: updatedUser.coverPhoto,
      twitter: updatedUser.twitter, 
      linkedin: updatedUser.linkedin,
      followers: updatedUser.followers,
      following: updatedUser.following,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export const getUserById = asyncHandler(async (req, res) => {
   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404);
      throw new Error('User not found (Invalid ID)');
   }
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatar: user.avatar,
      coverPhoto: user.coverPhoto,
      twitter: user.twitter,
      linkedin: user.linkedin,
      followers: user.followers,
      following: user.following,
      createdAt: user.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

export const toggleFollowUser = asyncHandler(async (req, res) => {
    const userIdToFollow = req.params.id; 
    const currentUserId = req.user._id; 

    if (!mongoose.Types.ObjectId.isValid(userIdToFollow)) {
        res.status(404);
        throw new Error('User not found (Invalid ID)');
    }

    if (userIdToFollow.toString() === currentUserId.toString()) {
        res.status(400);
        throw new Error("You cannot follow/unfollow yourself");
    }

    const userToFollow = await User.findById(userIdToFollow);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
        res.status(404);
        throw new Error('User not found');
    }

    const isFollowingIndex = currentUser.following.findIndex(
        (id) => id.toString() === userIdToFollow.toString()
    );

    if (isFollowingIndex > -1) {
        currentUser.following.splice(isFollowingIndex, 1);
        const followerIndex = userToFollow.followers.findIndex(
            (id) => id.toString() === currentUserId.toString()
        );
        if (followerIndex > -1) {
            userToFollow.followers.splice(followerIndex, 1);
        }
        console.log(`[userController] User ${currentUserId} unfollowed ${userIdToFollow}`);
    } else {
        currentUser.following.push(userIdToFollow);
        userToFollow.followers.push(currentUserId);
        console.log(`[userController] User ${currentUserId} followed ${userIdToFollow}`);
    }

    await currentUser.save();
    await userToFollow.save();

     const updatedCurrentUser = await User.findById(currentUserId).select('following');
     res.json({ following: updatedCurrentUser.following });
});