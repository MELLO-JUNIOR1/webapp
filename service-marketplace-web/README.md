# Service Marketplace Web Application

This is the web version of the Service Marketplace application, built with Next.js and Firebase.

## Features

- User authentication (sign up, sign in, sign out)
- Role-based access (Customer/Worker)
- Service request management
- Real-time messaging
- Push notifications
- Rating system

## Tech Stack

- Next.js 14
- TypeScript
- Firebase (Auth, Firestore, Cloud Messaging)
- Tailwind CSS
- Material UI components

## Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Firebase project (same as Android app)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd service-marketplace-web
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=firstandroidapp-92b07
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=firstandroidapp-92b07.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
service-marketplace-web/
├── src/
│   ├── app/                    # Next.js app router
│   ├── components/             # Reusable UI components
│   ├── features/              # Feature-specific components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions and Firebase setup
│   ├── models/                # TypeScript interfaces
│   ├── services/              # API and Firebase services
│   └── store/                 # Global state management
├── public/                    # Static assets
├── firebase/                  # Firebase Functions
└── package.json              # Dependencies
```

## Development Guidelines

1. Follow TypeScript best practices
2. Use functional components with hooks
3. Implement proper error handling
4. Write meaningful commit messages
5. Keep components small and focused
6. Use proper TypeScript types and interfaces
7. Follow the established folder structure

## Firebase Setup

1. Use the same Firebase project as the Android app
2. Enable Web App in Firebase Console
3. Configure Authentication methods
4. Set up Firestore rules
5. Configure Firebase Cloud Messaging for web push notifications

## Deployment

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Deploy to your preferred hosting platform (e.g., Vercel, Firebase Hosting)

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details 