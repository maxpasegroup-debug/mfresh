import jwt from 'jsonwebtoken';

function getSecret(name) {
  const secret = process.env[name];

  if (!secret) {
    throw new Error(`${name} is required`);
  }

  return secret;
}

export function generateAccessToken(payload) {
  return jwt.sign(payload, getSecret('JWT_SECRET'), {
    expiresIn: '7d',
  });
}

export function generateRefreshToken(payload) {
  return jwt.sign(payload, getSecret('JWT_REFRESH_SECRET'), {
    expiresIn: '30d',
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, getSecret('JWT_SECRET'));
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, getSecret('JWT_REFRESH_SECRET'));
}
