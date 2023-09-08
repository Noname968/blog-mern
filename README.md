# MERN Blog Website

Welcome to the MERN Blog website! This repository contains the source code for a full-stack blog website built using the MERN (MongoDB, Express.js, React, Node.js) stack. This README will guide you through the installation process and provide an overview of the website's features.

## Installation

Follow these steps to set up the MERN Blog website on your local machine:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/mern-blog-website.git
   ```

2. **Navigate to the project folder:**

   ```bash
   cd mern-blog-website
   ```

3. **Install server dependencies:**

   ```bash
   cd server
   npm install
   ```

4. **Install client dependencies:**

   ```bash
   cd ../client
   npm install
   ```

5. **Set up environment variables:**

   Create a `.env` file in the `server` folder and specify the following variables:

   ```
   MONGODB_URI=<your-mongodb-connection-uri>
   SECRET_KEY=<your-secret-key-for-jwt>
   ```

6. **Start the server:**

   In the `server` folder, run:

   ```bash
   npm start
   ```

7. **Start the client:**

   In the `client` folder, run:

   ```bash
   npm start
   ```

8. **Access the website:**

   Open your browser and go to `http://localhost:3000` to view the MERN Blog website.

## Features

### User Authentication

- Users can sign up, log in, and log out securely.
- Passwords are hashed for security.
- JWT (JSON Web Tokens) are used for user authentication.

### Creating Stories

- Registered users can create and publish their own stories/posts.
- Stories can include text, images, and other media.
- Markdown support for formatting content.

### User Profiles

- Users have their own profiles displaying their stories, follower count, and other details.
- Users can update their profile information and profile picture.

### Library and Favorites

- Users can save posts to their library for later reading.
- They can mark posts as favorites for quick access.

### Following and Liking Posts

- Users can follow other users to see their posts in their feed.
- Users can like posts and see the total number of likes on a post.

### Author Profiles

- Each author has a dedicated profile page displaying their bio and posts.

### Comment CRUD

- Users can comment on posts.
- They can edit and delete their own comments.

### Password Reset

- Users can request a password reset link via email if they forget their password.
- A secure link is sent to their registered email for password reset.

### Post CRUD

- Users can edit and delete their own posts.
- Admin users may have additional privileges to manage all posts.

## Contributing

We welcome contributions to improve and enhance this MERN Blog website. Please fork this repository, make your changes, and submit a pull request.
