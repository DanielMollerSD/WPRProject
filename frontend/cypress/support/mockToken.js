const jwt = require('jsonwebtoken');

// Secret key for signing the token (in production, use a more secure and private key)
const secretKey = 'a2L6kVm6dGe9PjLp3Fs4RwGfA9tXYb2z0v4ZtIoOm50IqE5Zt7H3Vv3Ve9FcAe2d'; // Make sure to keep this safe

// Example payload (this could be any data you want to encode into the token)
const payload = {
  Id: 1,              // User's unique identifier
  Role: 'Backoffice',       // Role of the user (for role-based access)
  Email: 'user@example.com' // User's email
};

// Create the token with an expiration time (e.g., 1 hour)
const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

console.log('JWT Token:', token);
