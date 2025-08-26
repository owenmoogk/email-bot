import { Routes, Route } from 'react-router-dom';
import { Homepage } from './HomePage';
import { Login } from './accounts/Login';
import { Signup } from './accounts/Signup';
import { Compose } from './Compose';
import { Contacts } from './contacts/Contacts';
import { Nav } from './Nav';
import '../index.css';
import { useLocalStorage } from '@mantine/hooks';
import type { CurrentUser } from '@api/types/user';
import { useFetchData } from '@api/getData';
import { NewContact } from './contacts/NewContact';
import { EditContact } from './contacts/EditContact';
import { NewTemplate } from './templates/NewTemplate';
import { EditTemplate } from './templates/EditTemplate';
import { Templates } from './templates/Templates';

export function App() {
  const [token, , removeToken] = useLocalStorage({ key: 'token' });
  const loggedIn = !!token;

  function handleLogout() {
    removeToken();
    window.location.href = '/';
  }

  const user = useFetchData<CurrentUser>('/users/current_user');
  const username = user?.username;

  return (
    <div>
      <Nav
        loggedIn={loggedIn}
        handleLogout={handleLogout}
        username={username}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {loggedIn && (
          <>
            <Route path="/compose" element={<Compose />} />
            <Route path="/templates">
              <Route index element={<Templates />} />
              <Route path="add" element={<NewTemplate />} />
              <Route path=":id" element={<EditTemplate />} />
            </Route>
            <Route path="/contacts">
              <Route index element={<Contacts />} />
              <Route path="add" element={<NewContact />} />
              <Route path=":id" element={<EditContact />} />
            </Route>
          </>
        )}
        <Route path="" element={<Homepage loggedIn={loggedIn} />} />
      </Routes>
    </div>
  );
}
