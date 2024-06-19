import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "../Login";
import Register from "../Register";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
function MainRouter() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default MainRouter;
