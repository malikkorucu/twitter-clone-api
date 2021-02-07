const CustomError = require("../../helpers/error/CustomError");
const jwt = require("jsonwebtoken");
const {
  isTokenIncluded,
  getAccessTokenFromHeader,
} = require("../../helpers/auth");

const getAccessToRoute = (req, res, next) => {
  const token = req.headers.authorization;
  const { SECRET_KEY } = process.env;

  if (!isTokenIncluded(req)) {
    return next(
      new CustomError(
        "Bu adrese ulaşmak için yetkiniz bulunmamaktadır ...",
        401
      )
    );
  }

  const access_token = getAccessTokenFromHeader(token);
  jwt.verify(access_token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(
        new CustomError(
          "Bu adrese ulaşmak için yetkiniz bulunmamaktadır ...",
          401
        )
      );
    } else {
      req.user = decoded
      next();
    }
  });
};

module.exports = {
  getAccessToRoute,
};