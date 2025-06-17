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
};

export async function registerUser(user: CreateUserDto) {
  const response = await jsonFetch(API_URL + "/users", {
    method: "POST",
    payload: user,
  });

  const data = await response.json();

  if (response.status !== 201) {
    throw Error(Array.isArray(data.message) ? data.message.join(", ") : data.message);
  }

  return data;
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
