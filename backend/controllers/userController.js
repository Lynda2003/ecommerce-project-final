const User = require('../models/userModel');

// GET /api/users/profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, address: user.address });
  } else {
    res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
};

// PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) user.password = req.body.password;
    if (req.body.address) user.address = req.body.address;
    const updated = await user.save();
    res.json({ _id: updated._id, name: updated.name, email: updated.email });
  } else {
    res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
};

// GET /api/users (Admin)
const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

// DELETE /api/users/:id (Admin)
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: 'Utilisateur supprimé' });
  } else {
    res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
};

module.exports = { getUserProfile, updateUserProfile, getAllUsers, deleteUser };