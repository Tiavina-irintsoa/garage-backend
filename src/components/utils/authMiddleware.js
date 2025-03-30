const jwt = require("jsonwebtoken");
const ResponseJson = require("./ResponseJson");

/**
 * @typedef {Object} UserRequest
 * @property {Object} user
 * @property {string} user.userId
 * @property {string} user.role
 */

/**
 * @type {import("express").RequestHandler}
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(ResponseJson.error("Token d'authentification manquant", 401));
    }

    const token = authHeader.split(" ")[1];
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(ResponseJson.error("Token invalide", 401));
  }
};

module.exports = authMiddleware;
