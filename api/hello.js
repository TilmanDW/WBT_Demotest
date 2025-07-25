// api/hello.js - Using ESM syntax
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello, this API route is working!' });
}
