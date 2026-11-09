import { useState } from "react";
import type { SubmitEvent } from "react";
import { login } from "../api";

type Props = {
  onRegisterClick: () => void;
  onLoginSuccess: () => void;
};

function LoginForm ({ onRegisterClick, onLoginSuccess }: Props) {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!username || !password) {
          alert("ユーザー名とパスワードを入力してください");
          return;
        }
    
        try {
            const token = await login(username, password);
            localStorage.setItem("token", token);
            localStorage.setItem("username", username);
            onLoginSuccess();
        } catch {
            alert("ログイン失敗");
        }
    };
    

    return (
        <form id="login-form" onSubmit={handleSubmit}>
        ユーザー名を入力
        <input
          id="login-username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        パスワードを入力
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button id="login-button" type="submit">
          ログイン
        </button>
        <button id="register-display-button" type="button" onClick={ onRegisterClick }>
          新規登録画面へ
        </button>
      </form>
    )
}

export default LoginForm;