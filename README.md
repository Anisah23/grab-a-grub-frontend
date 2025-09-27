# Grab a Grub

This is my Phase 4 project - a recipe sharing app where people can post their recipes and interact with others. I built it because I love cooking and wanted to create something that brings food lovers together.

## What it does

- You can create, edit, and delete your recipes
- Browse through other people's recipes
- Like and comment on recipes you enjoy
- Save recipes to your favorites
- Get notifications when people interact with your stuff
- Works on mobile and desktop

## Tech I used

**Frontend:**
- React with Vite (way faster than Create React App)
- React Router for navigation
- Formik and Yup for forms and validation
- Axios for API calls
- Just regular CSS (no frameworks needed)

**Backend:**
- Flask with Python
- SQLAlchemy for the database
- PostgreSQL

## How to run it




git clone 
cd grab-a-grub-frontend
npm install
npm run dev


Then go to http://localhost:5173

Make sure your backend is running on port 5000, or change the proxy in vite.config.js if it's different.

## How to use it

Sign up with a username, email, and password. Then you can:
- Browse recipes on the dashboard
- Search for specific ingredients or recipe names
- Like and comment on recipes
- Create your own recipes with ingredients and instructions
- Save recipes to favorites
- Check out other users' profiles

The main pages are:
- `/` - Home page
- `/dashboard` - All recipes with search
- `/my-recipes` - Your recipes
- `/favorites` - Saved recipes
- `/profile` - Your profile settings


## What I learned

This was my first time building a full-stack app with user authentication and real-time features. I learned a lot about:
- Managing state with React Context
- Form validation with Formik and Yup
- Building responsive layouts with CSS Grid and Flexbox
- Handling user sessions and authentication
- Creating a good user experience with loading states and error handling

## Challenges I faced

The notification system was tricky to get right. I had to figure out how to update the notification count in real-time and handle different types of notifications (likes, comments, etc.).

Also spent way too much time on the CSS animations, but I think they make the app feel more polished.


## License

MIT License 