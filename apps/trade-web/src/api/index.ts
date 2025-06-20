const API_URL = "http://localhost:3000";


function jsonFetch( input: string | URL | globalThis.Request, init?: RequestInit & {payload: Object},) {
    return fetch(input, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...init?.headers
        },
        body: init?.payload ? JSON.stringify(init.payload) : init?.body
    })

}

export async function getProfile(token: string) {
  const response = await fetch(API_URL + "/me/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return await response.json();
}
export async function login(email: string, password: string) {
  const response = await jsonFetch(API_URL + "/auth/login", {
    method: "POST",
    payload: {email, password}
  });

  const data = await response.json();

  if (response.status != 201) {
    throw Error(data.message.join(", "))
  }

  return data

}

export type CreateUserDto = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
};

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}) {
  const response = await jsonFetch(API_URL + "/users", {
    method: "POST",
    payload: data,
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(
      Array.isArray(result.message) ? result.message.join(", ") : result.message
    );
  }

  return await response.json();
}

export async function searchCards(query: string, lang = 'es') {
  const url = new URL(`${API_URL}/cards/search`);
  const searchQuery = lang && lang !== 'en' ? `${lang}:${query}` : query;
  url.searchParams.set('q', searchQuery);
  if (lang) {
    url.searchParams.set('lang', lang);
  }
  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Failed to search cards');
  }

  return await response.json();
}

export function authApi(token: string) {
  return {
    async me(token: string) {
      const response = await fetch(API_URL + "/auth/login", {
        headers: {
          Auth: "bearer: " + token,
          'Content-Type': 'application/json'
        },
      });

      return await response.json();
    },
  };
}
