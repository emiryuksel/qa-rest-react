import { useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Header from "./Header";
import Footer from "./Footer";
import Home from "../pages/Home";
import QuestionDetail from "../pages/QuestionDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AddQuestion from "../pages/AddQuestion";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Profile from "../pages/Profile";
import "../App.css";

function AppLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      <main className="min-h-[calc(100vh-120px)] transition-colors">
        <SwitchTransition>
          <CSSTransition
            key={location.pathname}
            classNames="fade"
            timeout={400}
            nodeRef={nodeRef}
            unmountOnExit
          >
            <div ref={nodeRef}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/questions/:id" element={<QuestionDetail />} />
                <Route
                  path="/login"
                  element={<Login setIsAuthenticated={setIsAuthenticated} />}
                />
                <Route path="/register" element={<Register />} />
                <Route path="/add-question" element={<AddQuestion />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </main>

      <Footer />
    </>
  );
}

export default AppLayout;
