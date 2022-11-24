'use strict';
const pool = require("../database/db");
const promisePool = pool.promise();

const getAllUsers = async (res) => {
  try {
    const sql = "SELECT user_id, username, email, created_at FROM users";
    const [rows] = await promisePool.query(sql);
    return rows;
  } catch (e) {
    console.error('error getting all users:', e.message);
    res.status(500).send(e.message);
  }
};

const getUserById = async (res, userId) => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM users WHERE user_id = ?", [userId]);
    return rows[0];
  } catch (e) {
    console.error("error getting a user with ID:", e.message);
    res.status(500).send(e.message);
  }
};

const addUser = async (user, res) => {
  try {
    const sql = "INSERT INTO users VALUES (NULL, ?, ?, ?, ?)";
    const values = [user.name, user.email, user.password, user.created_at];
    const [result] = await promisePool.query(sql, values);
    console.log(result);
    return result.insertId;
  } catch (e) {
    console.error("error adding a new user:", e.message);
    res.status(500).send(e.message);
  }
};

const updateUserById = async (user, res) => {
  try {
    console.log('Modified user: ', user);
    const sql = "UPDATE users SET username = ?, email = ?, password = ?, created_at = ? " +
                "WHERE user_id = ?";
    const values = [user.name, user.email, user.password, user.created_at, user.id];
    const [rows] = await promisePool.query(sql, values);
    return rows;
  } catch (e) {
    console.error("error while updating a specific user:", e.message);
    res.status(500).json({"error": e.message});
  }
};

const deleteUserById = async (userId, res) => {
  try {
    const [rows] = await promisePool.query("DELETE FROM users WHERE user_id = ?", [userId]);
    return rows;
  } catch (e) {
    console.error("error while deleting a specific user:", e.message);
    res.status(500).send(e.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUserById,
  deleteUserById
};