# Mark Ward Design - AI Roadmap Generator

A modern React application for generating project roadmaps using Google's Gemini AI.

## Features

- 🎨 **Modern UI** - Built with React and styled with Tailwind CSS
- 🤖 **AI-Powered** - Generates detailed project roadmaps using Google Gemini AI
- 📝 **Smart Forms** - Form validation and handling with Formik
- 🎯 **Beautiful Icons** - Lucide React icons for a polished look
- ⚡ **Fast Development** - Powered by Vite for lightning-fast HMR

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Formik** - Form management and validation
- **Lucide React** - Beautiful icon library
- **Google Gemini AI** - AI model for roadmap generation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/markwarddesign/markwarddesign.com.git
cd markwarddesign.com
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Usage

1. Enter your Google Gemini API key in the form
2. Describe your project in detail
3. Select the project duration
4. Optionally add project goals
5. Click "Generate Roadmap" to get your AI-generated project roadmap

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
markwarddesign.com/
├── src/
│   ├── components/
│   │   └── RoadmapGenerator.jsx  # Main roadmap generator component
│   ├── App.jsx                    # Root application component
│   ├── main.jsx                   # Application entry point
│   └── index.css                  # Global styles with Tailwind
├── public/                        # Static assets
├── index.html                     # HTML template
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
└── package.json                   # Dependencies and scripts
```

## License

Private - All rights reserved

## Contact

Mark Ward Design - Business Site for Mark Ward Design
