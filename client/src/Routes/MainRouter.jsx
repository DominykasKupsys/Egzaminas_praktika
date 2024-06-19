import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "../Login";
import Register from "../Register";
import IndexPage from "../IndexPage";
import AdminPanel from "../AdminPanel";
import CreatePage from "../CreatePage";
import EditPage from "../EditPage";
import Profile from "../Profile";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
function MainRouter() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<IndexPage />} />
          <Route path="/adminpanel" element={<AdminPanel />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/edit/:id" element={<EditPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default MainRouter;
