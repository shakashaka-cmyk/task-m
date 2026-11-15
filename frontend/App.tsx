import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import MainScreen from "./components/MainScreen";

type AuthView = "login" | "register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("token") !== null
  );
  const [authView, setAuthView] = useState<AuthView>("login");

  if (isLoggedIn) {
    return <MainScreen />;
  }

  if (authView === "register") {
    return <RegisterForm onBack={() => setAuthView("login")} />;
  }

  return (
    <LoginForm
      onRegisterClick={() => setAuthView("register")}
      onLoginSuccess={() => setIsLoggedIn(true)}
    />
  );
}

export default App;