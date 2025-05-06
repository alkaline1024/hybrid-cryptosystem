# Hybrid Cryptosystem

This project implements a hybrid cryptosystem using RSA and AES encryption. The server generates an RSA key pair and provides the public key to the client. The client encrypts data using AES and sends the encrypted data along with the AES key (encrypted using RSA) to the server for decryption.

## Features
- RSA key pair generation on the server.
- AES encryption on the client.
- Secure transmission of encrypted data and AES key.
- Decryption of data on the server.

## Prerequisites
- Node.js (v16 or later)

## Installation
1. Clone the repository:
   ```bash
   git clone git@github.com:alkaline1024/hybrid-cryptosystem.git
   cd hybrid-cryptosystem
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage
1. Start the server:
   ```bash
   node server.js
   ```
2. Open `client.html` in a web browser or run with `python -m http.server 5500` then open `localhost:5500` in browser.
3. Enter data to encrypt and click the "Encrypt and Send" button.
