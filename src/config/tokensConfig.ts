
const revokedTokens = new Set();

/**
 * Revoke a token 
 * @param jti jwt id
 * @param ttl time to live of a token
 */
export function revokeToken(jti: string, ttl: number) {
    revokedTokens.add(jti);
    setTimeout(() => revokedTokens.delete(jti), ttl);
}

/**
 * 
 * @param jti jwt id
 * @returns true if revoked else false
 */
export function isTokenRevoked(jti: string): boolean {
    return revokedTokens.has(jti);
}