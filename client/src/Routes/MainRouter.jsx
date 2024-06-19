import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "../Login";
import Register from "../Register";
import IndexPage from "../IndexPage";
import AdminPanel from "../AdminPanel";
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
        </Routes>
      </div>
    </Router>
  );
}

export default MainRouter;
