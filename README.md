# Kai - Leadership Coach

Kai is an AI-powered leadership coaching assistant that lives primarily as a Chrome extension, with a minimal, elegant web app for reflection. It provides thoughtful guidance and coaching in real-world leadership scenarios.

## Features

- 🎯 Real-time leadership coaching through a beautiful Chrome extension
- 💬 Elegant chat interface with smooth animations
- 📧 Context-aware coaching during email composition
- 🔄 Draggable floating bubble for easy access
- 📱 Responsive design that works across different screen sizes
- 🔒 Secure authentication with Google OAuth
- 📊 Minimal web app for reflection and history

## Tech Stack

- Chrome Extension API with React
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations
- Firebase for authentication and data storage
- OpenAI API for AI coaching

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kai-leadership-coach.git
   cd kai-leadership-coach
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` directory

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Project Structure

```
src/
  ├── components/     # React components
  ├── hooks/         # Custom React hooks
  ├── services/      # API and external services
  ├── utils/         # Utility functions
  ├── types/         # TypeScript type definitions
  ├── popup.tsx      # Extension popup entry point
  ├── background.ts  # Background service worker
  └── content.ts     # Content script
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 