# VirusAI - Advanced File Scanning Platform

VirusAI is a modern web application that provides comprehensive file scanning capabilities to detect malware, viruses, and potential security threats in various file types.

## Features

- **Real-time File Scanning**: Upload and scan files for viruses and malware using ClamAV
- **Code Security Analysis**: Specialized scanning for source code files to detect potentially malicious code
- **VirusTotal Integration**: Check file hashes against the VirusTotal database
- **File Hashing**: Calculate MD5, SHA-1, and SHA-256 hashes for all uploaded files
- **Persistence**: All scan results are saved and can be accessed later
- **User-friendly Dashboard**: View scan history, statistics, and security insights
- **Drag-and-Drop Interface**: Easy file uploading with drag-and-drop functionality
- **Responsive Design**: Works on all device sizes

## Prerequisites

- Node.js 18+ or Bun runtime
- ClamAV installed on your system or accessible via network
- VirusTotal API key (optional)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/virus-ai.git
   cd virus-ai
   ```

2. **Install dependencies**
   ```bash
   # With npm
   npm install
   
   # With Bun
   bun install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # ClamAV Configuration
   CLAMAV_HOST=127.0.0.1
   CLAMAV_PORT=3310
   # Optional: CLAMAV_SOCKET=/var/run/clamav/clamd.socket

   # VirusTotal Configuration (Optional)
   VIRUSTOTAL_API_KEY=your_api_key_here
   ```

4. **Install ClamAV**
   - On Windows: Download and install ClamAV from [clamav.net](https://www.clamav.net/downloads)
   - On macOS: `brew install clamav`
   - On Ubuntu/Debian: `sudo apt-get install clamav clamav-daemon`
   
   Ensure the ClamAV daemon (clamd) is running.

5. **Start the development server**
   ```bash
   # With npm
   npm run dev
   
   # With Bun
   bun dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload Files**: Drag and drop files or click to select files for scanning
2. **View Results**: After scanning, detailed results will show threat level, detected issues, and AI analysis
3. **Dashboard**: Access the dashboard to view scan history and statistics
4. **API Access**: Use the API endpoints for programmatic access to scanning capabilities

## API Endpoints

- `POST /api/scan`: Upload and scan a file
- `GET /api/scan/results/[id]`: Get results for a specific scan by ID
- `GET /api/scan/history`: Get scan history and statistics

## Security Considerations

- VirusAI only stores uploaded files temporarily for scanning purposes
- File hashes are calculated and stored for reference
- No personal data is collected during the scanning process
- All scan results are stored locally in the uploads directory

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- ClamAV for virus scanning capabilities
- VirusTotal for additional threat intelligence
- Next.js and React for the frontend framework
