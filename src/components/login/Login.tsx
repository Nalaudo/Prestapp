"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
  const [stage, setStage] = useState(1);
  const [error, setError] = useState(false);
  const [errorIndex, setErrorIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  console.log(errorIndex, error);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const usernameForm = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (stage == 1) {
      const response = await signIn("credentials", {
        username: usernameForm,
        password: password,
        redirect: false,
      });

      if (response?.ok) {
        router.push("/");
      } else {
        setErrorIndex(1);
        setError(true);
        setUsername("");
        setPassword("");
      }
    }
  };

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleForgotPassword = () => {
    setStage(2);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <p>Username</p>
        <input
          onChange={handleChangeUsername}
          name="username"
          type="text"
          value={username}
        ></input>
      </div>
      <div>
        <p>Password</p>
        <div>
          <input
            onChange={handleChangePassword}
            name="password"
            type={hidePassword ? "password" : "text"}
            value={password}
          ></input>
          <button type="button" onClick={() => setHidePassword(!hidePassword)}>
            {hidePassword ? "a" : "b"}
          </button>
        </div>
        <button type="button" onClick={handleForgotPassword}>
          Forgot your password?
        </button>
      </div>
      <button type="submit">Sign in</button>
    </form>
  );
};

export default Login;
