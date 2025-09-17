
import jwt from 'jsonwebtoken';
import { env } from '../config/envConfig';

/**
 * Check if a JWT token is expired
 * @param {string} token - The JWT token to check
 * @returns {boolean} - Returns true if the token is expired, false otherwise
 */
export default function isTokenExpired(token: string): boolean {
  try {
	const decoded = jwt.decode(token) as { exp?: number } | null;
	if (!decoded || typeof decoded.exp !== 'number') {
	  return true; // If token can't be decoded or has no exp, treat as expired
	}
	const currentTime = Math.floor(Date.now() / 1000);
	return decoded.exp < currentTime;
  } catch (error) {
	return true; // On error, treat as expired
  }
}
