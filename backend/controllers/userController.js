'use strict';
const userModel = require('../models/userModel');

const getUsers = async (req, res) => {
  const users = await userModel.getAllUsers(res);
  res.json(users);
};

const getUser = async (req, res) => {
  const user = await userModel.getUserById(res, req.params.userId);
  console.log('user ID:', req.params.userId, user);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({'message': 'user with the given id does not exist'});
  }
};

const createUser = async (req, res) => {
    const user = req.body;
    console.log("creating a user", user);
    const userId = await userModel.addUser(user, res);
    if (user) {
      res.status(201).json({message: "succesfully created a new user with the id:", userId});
    } else {
      res.status(400).json({message: "user creation failed"});
    }
};

const modifyUser = async (req, res) => {
  const user = req.body;
  //console.log("req body modifyuser: ", user);
  //console.log("req params modifyuser: ", req.params);
  if (req.params.userId) {
    user.id = req.params.userId;
  }
  const result = await userModel.updateUserById(user, res);
  if (result.affectedRows > 0) {
    res.json({message: "user updated: " + user.id});
  } else {
    res.status(404).json({message: 'nothing was changed'});
  }
};

const deleteUser = async (req, res) => {
  console.log('deleteUser req...:', req.params);
  const result = await userModel.deleteUserById(req.params.userId, res);
  console.log("user delted", result);
  if (result.affectedRows > 0) {
    res.json({message: "user deleted"});
  } else {
    res.status(401).json({message: 'user deletion failed'});
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  modifyUser,
  deleteUser
};