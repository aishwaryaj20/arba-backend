const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = 'SecretKey';
const tokenBlacklist = new Set();

exports.register = async (req, res) => {
  try {
    const { fullName, username, email, avatar, password } = req.body; // Changed from userName to username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] }); // Changed from userName to username
    if (existingUser) {
      return res.status(400).json({ error: 'Email or Username already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      avatar,
      username,
      password: hashedPassword,
    });
    await user.save();
    console.log(user);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });
    console.log(token);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logoutUser = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    tokenBlacklist.add(token);
    res.status(200).json({ message: "Logout successful" });
  } else {
    res.status(400).json({ message: "Invalid token" });
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token && !tokenBlacklist.has(token)) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: "Invalid token" });
  }
};

const generateOtp = () =>
  Math.floor(1000 + Math.random() * 9000)
    .toString()
    .slice(0, 4);

    exports.forgotPassword = async (req, res) => {
      try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        let Otp = 1234
        // Implement your forgot password logic here (e.g., send reset email)
        const resetToken = //jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });
        await User.findByIdAndUpdate(user._id, { $set: { Otp } }, { new: true });
        // Send the reset token via email or any other method
        res.status(200).json({ message: "Password reset email sent successfully", resetToken });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };

    exports.updateProfile = async (req, res) => {
      try {
        const { fullName, avatar, newPassword } = req.body;
        const userId = req.user.email; // Assuming user is authenticated and email is stored in the token
    
       
        let user = await User.findOne({ email: userId });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        if (fullName) user.fullName = fullName;
        if (avatar) user.avatar = avatar;
        if (newPassword) {
          const { currentPassword } = req.body;
          const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
          if (!isPasswordValid) {
            return res.status(401).json({ message: "Current password is incorrect" });
          }
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          user.password = hashedPassword;
        }
  
        await user.save();
        res.status(200).json({ message: "Profile updated successfully" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };



