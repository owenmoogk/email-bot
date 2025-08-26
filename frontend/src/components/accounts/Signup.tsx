import type { FormEvent } from 'react';
import { useState } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import type { Signup } from '@api/types/user';
import { postData } from '@api/postData';

export function Signup() {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [, setToken] = useLocalStorage({
    key: 'token',
  });

  function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void postData<Signup>('/users/signup/', {
      username: username,
      password: password,
    }).then((json) => {
      if (json.token) {
        setToken(json.token);
        window.location.href = '/';
      } else {
        console.error('Error signing up: ', json);
      }
    });
  }

  return (
    <div className="loginPage">
      <form onSubmit={(e) => handleSignup(e)}>
        <h4>Sign Up</h4>
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
