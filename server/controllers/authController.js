import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
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
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
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
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(200).json({ message: 'Email sent' });
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

  const message = `
    You have requested a password reset.
    Please click on this link: \n\n ${resetUrl} \n\n
    If you have not made this request, then ignore it.
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request - GlassBlog',
      message,
    });

    res.status(200).json({ message: 'Email sent' });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({ message: 'Email could not be sent' });
  }
});


export const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
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
});