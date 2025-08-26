import { useFetchData } from '@api/getData';
import type { AccountInfo } from '@api/types/user';

type Props = {
  loggedIn: boolean;
};

export function Homepage(props: Props) {
  // function authorize() {
  //   fetch(API_URL + '/api/auth/', {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //   })
  //     .then(async (response) => response.json())
  //     .then((json) => (window.location.href = json.url));
  // }

  const info = useFetchData<AccountInfo>('/api/accountInfo/');
  const email = info?.address;

  return (
    <div id="homepage">
      <h1>Email Automator</h1>

      <p className="subtitle">The hub for professionals</p>

      <p>
        Send emails to the masses, with just a click of a button. Including
        support for contacts, placeholders, scheduling, and much more.
      </p>

      {email ? <div className="card">{email}</div> : null}

      {!props.loggedIn ? (
        <div
          className="card"
          style={{
            width: 'fit-content',
            padding: '20px',
          }}
        >
          <button onClick={() => (window.location.href = '/login')}>
            Login
          </button>
          <br />
          <br />
          <button onClick={() => (window.location.href = '/signup')}>
            Sign Up
          </button>
        </div>
      ) : null}
    </div>
  );
}
