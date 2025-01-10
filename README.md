# Middleware Crossroad

Application for middleware customer and documentation management.

## Project Structure

```
middleware-crossroad/
├── src/                    # Source files
│   ├── data/              # JSON data
│   ├── App.js             # Main component
│   └── index.js           # Entry point
├── public/                # Static files
├── Dockerfile             # Docker configuration
└── README.md             # Documentation
```

## Features

- Customer and contact management
- Important links management
- Important announcements
- OpenShift section with contacts
- Global search functionality

## Installation and Running

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start
```

### Docker

```bash
# Build Docker image
docker build -t middleware-crossroad .

# Run container
docker run -p 3000:3000 middleware-crossroad
```

## Technologies

- React
- Styled Components
- JavaScript
- Docker

## Requirements

- Node.js 18+
- npm or yarn
- Docker (optional)

![image](https://github.com/user-attachments/assets/0f12eabc-4173-4255-be65-1ca33cafd0c7)
