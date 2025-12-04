# Crypto Tools Notes

## Log
- Initial creation: Built comprehensive crypto/encoding tools suite
- Features:
  - Base64 encoder/decoder (RFC 4648 standard)
  - Base58 encoder/decoder (Bitcoin-style, no ambiguous chars)
  - Hexadecimal converter
  - URL percent-encoding
  - SHA-256 and SHA-512 hashing
  - MD5 hashing (with security warning)
  - AES symmetric encryption/decryption
  - JWT token decoder
  - HTML entities encoder/decoder
- Uses CryptoJS library for cryptographic operations
- Responsive grid layout with individual tool cards
- Error handling for invalid inputs

## Issues
- JWT decoder does not verify signatures (by design - this is a decoder only)
- Base58 implementation is custom (not using a library)
- MD5 is included but marked as deprecated for security

## Todos
- Could add RSA key generation/encryption
- Could add HMAC generation
- Could add bcrypt/scrypt password hashing
- Could add more encoding formats (Base32, Base85)
- Could add QR code generation for encrypted data
- Could add file encryption/decryption
- Could add signature verification for JWT

## Additional Notes
- All operations run client-side - no data sent to server
- AES encryption uses CryptoJS default settings (AES-256-CBC)
- Base58 alphabet matches Bitcoin implementation
- Tool is defensive security focused - educational and utility purposes
- Mobile-friendly responsive design
