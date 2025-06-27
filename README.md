# EchoHQ - Voice Social Media App

EchoHQ is a modern voice-first social media application built with React Native and Expo. It allows users to share short audio "echoes," discover trending content, connect with friends, and manage their saved and downloaded posts. The app emphasizes a clean, intuitive user interface and a seamless audio experience.

## Table of Contents

- [Features](#features)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Styling](#styling)
- [Fonts](#fonts)
- [API Routes](#api-routes)
- [Platform Compatibility](#platform-compatibility)
- [Navigation Architecture](#navigation-architecture)
- [Error Handling](#error-handling)
- [Dependencies](#dependencies)
- [Camera Usage](#camera-usage)
- [Payments (RevenueCat)](#payments-revenuecat)
- [Contributing](#contributing)
- [License](#license)

## Features

EchoHQ offers a rich set of features designed for a compelling voice social media experience:

*   **Feed**:
    *   **For You**: Personalized feed of echoes.
    *   **Friends**: Echoes from connected users.
*   **Discover**:
    *   **Trending**: Explore popular echoes and tags.
    *   **Creators**: Find and follow rising voice creators.
    *   **Tags**: Browse content by hashtags.
    *   **Search**: Comprehensive search for tags, creators, and topics.
*   **Post Creation**:
    *   **Voice Recording**: Record and share audio echoes (up to 60 seconds).
    *   **Text-to-Speech**: Convert text into voice echoes using various styles.
    *   **AI-Powered Tag Generation**: Automatically generate relevant hashtags for posts (with OpenAI integration and local fallback).
*   **Saved & Downloads**:
    *   **Commute Queue**: Temporarily download echoes for offline listening.
    *   **Saved Posts**: Permanently save favorite echoes.
    *   **Download Management**: Remove downloaded content and clear the queue.
*   **User Profile**:
    *   **Profile Header**: Displays user information (display name, username, masked email, join date, location, website).
    *   **Expandable Bio**: Detailed bio section with expand/collapse functionality.
    *   **Verified Badge**: Visual indicator for verified accounts.
    *   **Activity Tabs**: Organize user content and interactions:
        *   **Saved Echoes**: View permanently saved posts (grid and list views).
        *   **Liked Echoes**: Chronological list of liked posts.
        *   **Downloads**: Table view of downloaded content with format, size, and expiration details.
        *   **Your Echoes**: All posts created by the user (grid and list views, with private indicators).
        *   **Friends**: List of connected friends with online status and mutual connections.
*   **Audio Playback**: Seamless playback controls for echoes with progress indication.
*   **Engagement**: Like, comment (simulated replies), share, save, and download echoes.
*   **Responsive Design**: Mobile-first approach ensuring optimal experience across various screen sizes.
*   **Accessibility**: Designed with WCAG 2.1 guidelines in mind.

## Technical Stack

*   **Framework**: React Native (Expo SDK 52.0.30)
*   **Navigation**: Expo Router (4.0.17)
*   **Language**: TypeScript
*   **UI Components**: React Native core components
*   **Styling**: `StyleSheet.create` with a comprehensive global styling system
*   **Icons**: `lucide-react-native`
*   **Audio**: `expo-av`
*   **Animations**: `react-native-reanimated`
*   **Gestures**: `react-native-gesture-handler`
*   **Gradients**: `expo-linear-gradient`
*   **Local Storage**: `@react-native-async-storage/async-storage`
*   **API Integration**: OpenAI API for tag generation (with local fallback)
*   **Data Management**: React Context API for global state (Like, Play, Save)
*   **Mock Data**: Local mock databases for posts, user profiles, and activity.
*   **Image Assets**: Pexels for placeholder images (linked directly).

## Project Structure

The project follows a clear and organized directory structure:

```
├── app/                      # Expo Router routes and API routes
│   ├── (tabs)/               # Primary tab navigation layout and screens
│   │   ├── _layout.tsx
│   │   ├── discover.tsx
│   │   ├── index.tsx
│   │   ├── post.tsx
│   │   ├── profile.tsx
│   │   └── saved.tsx
│   ├── _layout.tsx           # Root layout for the app
│   ├── +not-found.tsx        # Not found screen
│   └── api/                  # Server-side API routes
│       └── generate-tags+api.ts
├── assets/                   # Static assets like images and fonts
├── components/               # Reusable UI components
│   └── UserProfile/          # Components specific to the user profile
│       └── tabs/             # Tab content components for user profile
├── contexts/                 # React Contexts for global state management
├── data/                     # Mock data and local "databases"
├── hooks/                    # Custom React Hooks
├── styles/                   # Global styling definitions (colors, spacing, typography)
├── types/                    # TypeScript type definitions
├── .env.example              # Example environment variables
├── .npmrc                    # npm configuration
├── .prettierrc               # Prettier configuration
├── app.json                  # Expo application configuration
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project README file
```

## Installation

To set up and run the EchoHQ project locally, follow these steps:

1.  **Prerequisites**:
    *   Node.js (LTS version recommended)
    *   npm or Yarn
    *   Expo CLI (`npm install -g expo-cli`)

2.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd echohq
    ```
    *(Note: This is a placeholder step as direct repository access is not provided.)*

3.  **Install Dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

4.  **Set up Environment Variables**:
    Create a `.env` file in the root of your project based on `.env.example` and populate it with your OpenAI API key if you wish to use the external tag generation. Otherwise, a local fallback will be used.

    ```
    # .env
    OPENAI_API_KEY=your_openai_api_key_here
    ```

5.  **Run the Application**:
    ```bash
    npm run dev
    # or
    expo start
    ```
    This will start the Expo development server. You can then open the app on your mobile device using the Expo Go app or in a web browser.

## Environment Variables

EchoHQ uses Expo's environment variable system.
The primary environment variable is `OPENAI_API_KEY`, used for AI-powered tag generation.

*   **`OPENAI_API_KEY`**: Your API key for OpenAI services. If not provided or set to a placeholder, the app will use a local fallback for tag generation.

**Setup**:
1.  Create a `.env` file in the root directory.
2.  Add your environment variables to this file (e.g., `OPENAI_API_KEY=your_api_key`).
3.  Ensure your `types/env.d.ts` file correctly declares these variables for TypeScript.

## Styling

All styling in EchoHQ is managed using `StyleSheet.create` from `react-native`. A comprehensive global styling system is defined in `styles/globalStyles.ts`, which includes:

*   **`colors`**: A consistent color palette for the entire application.
*   **`spacing`**: A standardized spacing scale.
*   **`borderRadius`**: Defined border radius values for consistent UI elements.
*   **`typography`**: A responsive typography scale with defined font families, sizes, and line heights.
*   **`shadows`**: Predefined shadow styles for elevation and depth.
*   **`gradients`**: Reusable linear gradient presets.
*   **`globalStyles`**: A collection of common styles applied across various components (e.g., containers, headers, buttons, post cards).

This approach ensures design consistency, maintainability, and easy theming.

## Fonts

EchoHQ integrates fonts using `@expo-google-fonts` packages to ensure proper loading and usage across platforms.

*   **Loading**: Fonts are loaded at the root level (`app/_layout.tsx`) using the `useFonts` hook from `@expo-google-fonts/inter`. This ensures that all components throughout the application have access to the defined fonts.
*   **Usage**: Fonts are referenced by their mapped names (e.g., `'Inter-Regular'`, `'Inter-Bold'`) within `StyleSheet.create` definitions, primarily through the `typography` object in `styles/globalStyles.ts`.
*   **Splash Screen**: The splash screen is prevented from auto-hiding until fonts are fully loaded, providing a smooth user experience.

## API Routes

EchoHQ utilizes Expo Router's API Routes feature for server-side logic, specifically for generating tags for user posts.

*   **Location**: API routes are defined in the `app/api/` directory with the `+api.ts` extension (e.g., `app/api/generate-tags+api.ts`).
*   **Functionality**: The `generate-tags+api.ts` route handles `POST` requests to generate relevant hashtags for voice or text content. It integrates with the OpenAI API for this purpose, with a robust local fallback mechanism if the API key is missing or the external API call fails.
*   **Security**: This approach allows sensitive operations, like using an OpenAI API key, to be handled securely on the server side, preventing exposure in client-side code.
*   **Deployment**: For production, these server features require deployment to a custom server or a platform like EAS.

## Platform Compatibility

This project is primarily developed for **Web** using Expo. Key considerations for platform compatibility include:

*   **Web-First Development**: The application is optimized for web browsers.
*   **Native API Restrictions**: Native-only APIs (e.g., Haptics, Local Authentication, certain Sensors) are not available on the web. Where such functionality might be desired, `Platform.select()` should be used to implement platform-specific code or web-compatible alternatives.
*   **Expo Managed Workflow**: The project strictly adheres to the Expo managed workflow. There are no `ios` or `android` directories, and no native code files are included directly in the project.

## Navigation Architecture

EchoHQ employs a clear and consistent navigation strategy:

### Primary Navigation: Tabs

The main sections of the app are accessible via a tab-based navigation structure implemented using Expo Router's built-in tab support.

*   **Root Layout (`app/_layout.tsx`)**: Sets up a `Stack` navigator that points to the tab layout.
*   **Tab Layout (`app/(tabs)/_layout.tsx`)**: Configures the tab bar appearance and defines each primary tab screen.
*   **Tab Screens (`app/(tabs)/index.tsx`, `app/(tabs)/discover.tsx`, etc.)**: Individual screens corresponding to each tab.

### Secondary Navigation

Within tab screens, additional navigation patterns can be implemented:

*   **Stack Navigation**: For hierarchical flows (e.g., navigating from a list of posts to a detailed post view).
*   **Modal Navigation**: For overlay screens (e.g., the "Text Post" modal in the `Post` screen, or the "Edit Profile" modal).

## Error Handling

EchoHQ prioritizes a user-friendly approach to error handling:

*   **In-UI Display**: Errors are displayed directly within the user interface using dedicated error states and messages, rather than relying on disruptive `Alert` pop-ups.
*   **Fallback UI**: Components are designed with fallback UI for empty states (e.g., "No posts found," "No downloads yet") to provide clear feedback to the user.
*   **Retry Mechanisms**: While not fully implemented for all mock data scenarios, the architecture supports retry mechanisms for failed data loads (e.g., in `UserProfileInterface`).

## Dependencies

All existing dependencies listed in `package.json` are maintained and are critical for the application's functionality. No pre-configured dependencies should be removed.

## Camera Usage

While not extensively used in the current visible code, `expo-camera` is included in the project dependencies, indicating potential future use for features like profile picture uploads or direct video/audio recording. Any implementation of camera features would follow Expo's best practices, including permission checks and platform-specific handling.

## Payments (RevenueCat)

For implementing subscriptions or in-app purchases, **RevenueCat** is the preferred solution. It handles billing, entitlements, analytics, and receipt validation across mobile platforms (Apple App Store, Google Play Store).

**Important Note for Development**:
RevenueCat requires native code and will not function in Bolt's in-browser preview. To integrate and test RevenueCat, you will need to:

1.  **Export your project**: Download your project files.
2.  **Open locally**: Use a local IDE (e.g., Cursor, VS Code).
3.  **Install RevenueCat SDK**: Follow the official RevenueCat installation guide for Expo: [https://www.revenuecat.com/docs/getting-started/installation/expo](https://www.revenuecat.com/docs/getting-started/installation/expo)
4.  **Create a development build**: Use the Expo Dev Client to build and test your application on a physical device or emulator.

**Stripe is NOT used for mobile platform subscriptions** as it does not directly support Apple or Google billing mechanisms required for in-app purchases on iOS and Android.

## Contributing

Contributions are welcome! Please follow standard GitHub flow: fork the repository, create a feature branch, and submit a pull request.

## License

[Specify your project's license here, e.g., MIT, Apache 2.0, etc.]

