import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuestionDetail from "./pages/QuestionDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import AddQuestion from "./pages/AddQuestion";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
