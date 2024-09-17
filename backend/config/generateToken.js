const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

module.exports = generateToken;

//jwt-authorize the use who try to login,only after authorized user can use 
//jwt secert are like digital sign...when the authorization is over it 
//sends back the payload with digital sign
//expiration date of token-expiresIn: "10d"