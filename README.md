# React Firebase Blog

A simple business landing page and blog CMS built with React and Firebase.

## Installation

1. Create a Firebase project.

2. Subscribe to Cloudflare Images.

3. Clone this repo.

4. Add `.env` file with the following enviornment variables to the root of this project.

```env
REACT_APP_USE_EMULATORS=false

REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_APP_NAME=...
# NOTE: Requires https://stackoverflow.com/questions/40856179/custom-authdomain-in-firebase
REACT_APP_FIREBASE_AUTH_DOMAIN=[YOUR DOMAIN]
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_STORAGE_URL=...
REACT_APP_FIREBASE_LOCATION=...
REACT_APP_FIREBASE_MESSAGE_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...

REACT_APP_CLOUDFLARE_IMAGES_API_URL=...

REACT_APP_TITLE=[TITLE OF YOUR APP FOR TITLE TAGS]
REACT_APP_DESCRIPTION=[DESCRIPTION OF YOUR APP FOR META TAGS]
```

## Deployment

```shell
npm run deploy
```
