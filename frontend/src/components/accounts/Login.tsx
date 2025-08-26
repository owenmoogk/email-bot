import { postData } from '@api/postData';
import type { Token } from '@api/types/user';
import { useLocalStorage } from '@mantine/hooks';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Navigate } from 'react-router';

export function Login() {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [redirect, setRedirect] = useState<boolean>();
  const [, setToken] = useLocalStorage({ key: 'token' });

  function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void postData<Token>('/token/', {
      username: username,
      password: password,
    }).then((json) => {
      if (json.access) {
        setToken(json.access);
        setRedirect(true);
      } else {
        console.error('Token Auth failed: ', json);
      }
    });
  }

  return (
    <div className="loginPage">
      {redirect ? <Navigate to="/" /> : null}
      <form onSubmit={(e) => handleLogin(e)}>
        <h4>Log In</h4>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" />
      </form>
    </div>
  );
}
