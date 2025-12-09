import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/landing";
import Register from "./pages/register";
import Login from "./pages/login";
import CreateStory from "./pages/createstory";
import DisplayCreatorWorks from "./pages/displayCreatorWorks";
import StoryPage from "./pages/storyPage";
import StoryPageForAuthor from "./pages/storyPage_forAuthor";
import EditStoryDetails from "./pages/edit_story_details";
import Library from "./pages/library";
import CreateNewChapter from "./pages/create_new_chapter";
import EditChapterDetails from "./pages/edit_chapter_details";
import ChapterPage from "./pages/chapter_page";

// import Navbar from "./components/navbar";

function App() {
  return (

    
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-story" element={<CreateStory />} />
      <Route path="/creator-works/:username" element={<DisplayCreatorWorks />} />
      <Route path="/stories/:id" element={<StoryPage />} />
      <Route path="/stories/author-view/:id" element={<StoryPageForAuthor />} />
      <Route path="/stories/edit/:id" element={<EditStoryDetails />} />
      <Route path="/library" element={<Library />} />
      <Route path="/stories/:id/chapters/new" element={<CreateNewChapter />} />
      <Route path="/chapters/edit/:chapterId" element={<EditChapterDetails />} />
      <Route path="/chapters/:chapterId" element={<ChapterPage />} />
    </Routes>
    
  );
}

export default App;


// // Just for testing deployment
// function App() {
//   return (
//     <div>
//       <h1>StoryLooms Deployment Test</h1>
//       <p>If you can see this, the deployment is successful!</p>
//     </div>
//   );
// }


// export default App;
