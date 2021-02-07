const bcrypt = require("bcryptjs");

const comparePasswords = (pass1, pass2) => {
  return bcrypt.compareSync(pass1, pass2);
};

const sendTokenToClient = (user) => {
  const { EXPIRES_IN } = process.env;
  let token = user.generateJwtToken();

  const expireDate = new Date(Date.now() + parseInt(EXPIRES_IN)).toGMTString();

  return { access_token: token, expireDate, expiresIn: EXPIRES_IN };
};

const isTokenIncluded = req => { 
  return (
    req.headers.authorization && req.headers.authorization.startsWith('Bearer:')
  )
}


const getAccessTokenFromHeader = (token) => { 
  return token.split(" ")[1];
}
  

module.exports = {
  comparePasswords,
  sendTokenToClient,
  isTokenIncluded,
  getAccessTokenFromHeader,
};
