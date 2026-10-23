# Google sign-in app

## Configure Firebase

1. Create or select a project in the [Firebase console](https://console.firebase.google.com/).
2. Register a Web app in **Project settings** and copy its web app configuration.
3. In **Authentication > Sign-in method**, enable **Google** and choose a support email.
4. In **Authentication > Settings > Authorized domains**, add the domain where the app runs. For local development, make sure `localhost` is listed.
5. Copy `.env.example` to `.env` in the project root and set the values from your Firebase web app configuration:

   ```text
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

   These are Firebase web-app configuration values, not service-account credentials. Never put a Firebase Admin SDK private key in a Vite environment variable.

6. Restart the Vite server after editing `.env`:

   ```powershell
   npm.cmd run dev
   ```

The app shows a setup message until all required Firebase values are present. Authentication state is restored automatically when the page reloads.

## Commands

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
```
