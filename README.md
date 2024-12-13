# NativeQuiz - React Native Mobile Application

A React Native quiz application built with Expo, featuring authentication, camera integration, and notifications.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Yarn](https://yarnpkg.com/) package manager
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- For iOS development: macOS with Xcode installed
- For Android development: Android Studio with an Android emulator

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ArKZbeb/r-native.git nativequiz
cd nativequiz
```

2. Install dependencies:
```bash
yarn install
```

## Running the Application

You can run the application in different environments:

- Start the development server:
```bash
yarn start
```

- Run on iOS simulator:
```bash
yarn ios
```

- Run on Android emulator:
```bash
yarn android
```

- Run on web:
```bash
yarn web
```

## Features

- Authentication system
- Camera integration
- Push notifications
- Cross-platform support (iOS, Android, Web)
- Tab-based navigation
- Game history tracking
- Profile management

## Required Permissions

The application requires the following permissions:

### iOS
- Camera access
- Notification permissions

### Android
- Camera access
- Notification permissions

## Project Structure

```
src/
├── app/                 # Application screens and navigation
├── assets/             # Images, fonts, and other static files
├── components/         # Reusable React components
├── context/           # React Context providers
├── models/            # Data models
├── types/             # TypeScript type definitions
└── utils/             # Utility functions and helpers
```

## Development Scripts

- `yarn start`: Start the Expo development server
- `yarn test`: Run tests with Jest
- `yarn lint`: Run ESLint for code quality
- `yarn reset-project`: Reset the project (useful for clearing cache)

## Technical Stack

- React Native
- Expo
- TypeScript
- Expo Router
- AsyncStorage
- Expo Camera
- Expo Notifications

## Environment Setup Notes

- The application uses Expo's managed workflow
- Uses the new React Native architecture
- Implements typed routes for better navigation type safety
