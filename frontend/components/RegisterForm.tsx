import { useState } from "react";
import type { SubmitEvent } from "react";
import { register } from "../api";

type Props = {
  onBack: () => void;
};

function RegisterForm({ onBack }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      alert("ユーザー名とパスワードを入力してください");
      return;
    }

    try {
      await register(username, password);
      alert("登録成功。ログインしてください");
      onBack();
    } catch {
      alert("登録失敗");
    }
  };

  return (
    <div id="register-display">
      <form id="register-form" onSubmit={handleSubmit}>
        ユーザー名を入力
        <input
          id="register-username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        パスワードを入力
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button id="register-button" type="submit">
          新規登録
        </button>
        <button id="register-back-button" type="button" onClick={onBack}>
          ログイン画面に戻る
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;