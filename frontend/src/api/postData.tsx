import { getCookie } from '@components/CSRF';
import { API_URL } from '@global/global';
import { readLocalStorageValue } from '@mantine/hooks';

export async function postData<T>(apiPath: string, body: object) {
  const token = readLocalStorageValue<string>({ key: 'token' });
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken') ?? '', // TODO: Necessary?
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(API_URL + apiPath, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as T;
  return json;
}
