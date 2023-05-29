import "./App.css";
import SignIn from "./components/SignIn";
import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./page/Main";
import SignUp from "./components/SignUp";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/main" element={<Main />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
