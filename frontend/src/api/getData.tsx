import { API_URL } from '@global/global';
import { readLocalStorageValue } from '@mantine/hooks';
import { useEffect, useState } from 'react';

export async function fetchJson<T>(apiPath: string) {
  const token = readLocalStorageValue<string>({ key: 'token' });
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(API_URL + apiPath, {
    headers: headers,
  });
  const json = (await res.json()) as T;
  return json;
}

export function useFetchData<T>(
  apiPath: string,
  dependencies?: unknown[]
): T | undefined {
  const [data, setData] = useState<T>();

  useEffect(() => {
    fetchJson<T>(apiPath)
      .then((response) => {
        setData(response);
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.error(error.message);
        }
      });
  }, [apiPath, dependencies]);

  return data;
}
