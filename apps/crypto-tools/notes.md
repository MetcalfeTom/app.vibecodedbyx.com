# Crypto Tools Notes

## Log
- Initial creation: Built comprehensive crypto/encoding tools suite
- Update: Added bcrypt, PBKDF2, HMAC, SHA-1, Base32
- Features (16 total tools):
  - **Encoders**: Base64, Base58, Base32, Hex, URL, HTML entities
  - **Hash Functions**: SHA-256, SHA-512, SHA-1, MD5
  - **Password Hashing**: Bcrypt (adaptive, with configurable rounds), PBKDF2
  - **Encryption**: AES symmetric encryption/decryption
  - **MAC**: HMAC (SHA-256/512/1)
  - **Utilities**: JWT token decoder
- Uses CryptoJS library for most crypto operations
- Uses bcrypt.js library for bcrypt hashing
- Responsive grid layout with individual tool cards
- Error handling for invalid inputs
- Security warnings for deprecated algorithms (MD5, SHA-1)

## Issues
- JWT decoder does not verify signatures (by design - this is a decoder only)
- Base58 and Base32 implementations are custom (not using external libraries)
- MD5 and SHA-1 included but marked as deprecated for security
- Bcrypt hashing can be slow on high rounds (intentional security feature)

## Todos
- Could add RSA key generation/encryption
- Could add scrypt password hashing
- Could add Base85 encoding
- Could add QR code generation for encrypted data
- Could add file encryption/decryption
- Could add signature verification for JWT
- Could add password strength checker
- Could add random password/salt generator

## Additional Notes
- All operations run client-side - no data sent to server
- AES encryption uses CryptoJS default settings (AES-256-CBC)
- Base58 alphabet matches Bitcoin implementation
- Tool is defensive security focused - educational and utility purposes
- Mobile-friendly responsive design
