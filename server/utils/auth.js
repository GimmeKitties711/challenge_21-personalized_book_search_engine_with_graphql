const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // authentication function
  authMiddleware: function ({ req, res }) {
    // allows token to be sent via req.(body/query/headers)
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
      // split the token into an array of substrings separated by spaces, remove the last element from the array, and trim whitespace from both ends of the element
      /*
      source for the split() method: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
      source for the pop() method: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop
      source for the trim() method: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
      */
    }

    if (!token) {
      console.log('You have no token.');
    }

    // verify the token and extract user data from it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token.');
    }

    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration }); // you can only stay logged in for 2 hours before being logged out
  },
};
