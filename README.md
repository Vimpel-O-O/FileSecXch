Hello!

This is a secure file exchange platform where users can upload any files (Max 50MB). Data will be encrypted locally and stored in a database, and an encryption key will be provided for temporary download.

Deployed app - https://file-sec-xch.vercel.app/

<a href="https://file-sec-xch.vercel.app/" target="_blank" rel="noopener noreferrer">
  <img src="https://github.com/user-attachments/assets/45e3ac5e-ef46-4439-96cd-348674808cde" alt="Demo GIF" />
</a>

### Key Features

- **Client-Side Encryption**: Files are encrypted in your browser using AES-GCM encryption before upload
- **Zero-Knowledge Architecture**: The server never sees your actual file or encryption key
- **Temporary Storage**: Stored files automatically deleted after 24 hours
- **Simple Sharing**: Share files using a single encryption key
- **No Account Required**: Upload and download anonymously

### System Architecture Diagram

<img width="601" height="526" alt="SecFileXch drawio" src="https://github.com/user-attachments/assets/01a48f09-9e39-4956-89f6-a886771e11cd" />

## How It Works

### Upload Process

1. Select a file (max 50MB)
2. File is encrypted locally using AES-256-GCM
3. System derives the file lookup ID from the key using HMAC-SHA256
4. Encrypted data is uploaded to AWS S3 with lookup ID as title
5. You receive a unique encryption key (shown only once)
6. Share the key with intended recipients

### Download Process

1. Enter the encryption key
2. System derives the file lookup ID from the key using HMAC-SHA256
3. Encrypted file is retrieved from storage
4. File is decrypted in your browser
5. Download begins automatically

### Security Architecture

- AES-256-GCM with randomly generated keys
- HMAC-SHA256 creates deterministic file ID from key
- Server only stores encrypted data, never the actual file or key
- Files are automatically deleted after 24 hours
