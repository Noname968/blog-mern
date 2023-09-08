import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Homepage from "./pages/Homepage";
import Login from "./components/Login";
import Register from "./components/Register";
import Createpost from "./pages/Createpost";
import Singlepost from "./pages/Singlepost";
import Editpage from "./pages/Editpost";
import Navbar from "./components/Navbar";
import Searchposts from "./components/Searchposts";
import Stories from "./pages/Stories";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import Forgotpass from "./components/Forgotpass";
import ResetPassword from "./components/Resetpass";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the PrivateRoute component
import PostUserProfile from "./pages/PostUserProfile";

function App() {

  return (
    <BrowserRouter>
      <AnimatePresence>
        <div className="app">
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Homepage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpass" element={<Forgotpass />} />
            <Route path="/resetpass/:token/:_id" element={<ResetPassword />} />
            <Route path="/post/:postId" element={<Singlepost />} />
            <Route path="/search-results" element={<Searchposts />} />
            <Route path="/profile/:userId" element={<PostUserProfile />} />
            <Route path="/create-post" element={<ProtectedRoute> <Createpost/> </ProtectedRoute> } />
            <Route path="/edit/:postId" element={<ProtectedRoute> <Editpage/> </ProtectedRoute>} />
            <Route path="/stories" element={<ProtectedRoute> <Stories/> </ProtectedRoute>} />
            <Route path="/library" element={<ProtectedRoute> <Library/> </ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute> <Profile/> </ProtectedRoute>} />
          </Routes>
        </div>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
