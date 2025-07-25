// api/hello.js - Using CommonJS syntax
module.exports = function handler(req, res) {
  res.status(200).json({ message: 'Hello, this API route is working!' });
};
