import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

type AuthView = "login" | "register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("token") !== null
  );
  const [authView, setAuthView] = useState<AuthView>("login");

  if (isLoggedIn) {
    return <p>ログイン中（ここにメイン画面が入る）</p>;
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