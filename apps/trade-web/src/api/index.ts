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

export async function searchCards(query: string) {
  const response = await fetch(
    `${API_URL}/cards/search?q=${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new Error('Failed to search cards');
  }

  return await response.json();
}

export interface CardWithEditions {
  editions: any[];
  [key: string]: any;
}

/**
 * Fetch a single card from the backend along with all available editions.
 * The returned object matches the Scryfall card schema and adds an
 * `editions` array containing the different printings.
 */
export async function getCard(id: string): Promise<CardWithEditions> {
  const response = await fetch(`${API_URL}/cards/${encodeURIComponent(id)}`);

  if (!response.ok) {
    throw new Error('Failed to fetch card');
  }

  return (await response.json()) as CardWithEditions;
}

export async function findSellers(
  data: {
    cardId: string;
    cardName: string;
    imageUrl?: string;
    language?: string;
    quantity?: number;
    addToWishlist: boolean;
  },
  token: string,
) {
  const response = await jsonFetch(API_URL + "/sales/find-sellers", {
    method: "POST",
    payload: data,
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to find sellers");
  }

  return await response.json();
}

export async function getSellers(cardId: string, token: string) {
  const response = await fetch(`${API_URL}/sales/card/${encodeURIComponent(cardId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sellers');
  }

  return await response.json();
}

export async function getWishlist(token: string) {
  const response = await fetch(API_URL + "/wishlist", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch wishlist');
  }

  return await response.json();
}

export async function getSales(token: string) {
  const response = await fetch(API_URL + "/sales", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch sales');
  }

  return await response.json();
}

export async function createSaleItem(
  data: {
    cardId: string;
    cardName: string;
    imageUrl?: string;
    quantity: number;
    foil?: boolean;
    signed?: boolean;
    comment?: string;
  },
  token: string,
) {
  const response = await jsonFetch(API_URL + "/sales", {
    method: 'POST',
    payload: data,
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(
      Array.isArray(result.message) ? result.message.join(', ') : result.message,
    );
  }

  return await response.json();
}

export async function deleteSaleItem(id: string, token: string) {
  const response = await fetch(`${API_URL}/sales/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to delete sale item');
  }
}

export async function deleteWishlistItem(id: string, token: string) {
  const response = await fetch(`${API_URL}/wishlist/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to delete wishlist item');
  }
}

export async function getConversations(token: string) {
  const response = await fetch(`${API_URL}/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }

  return await response.json();
}

export async function getMessages(id: string, token: string) {
  const response = await fetch(
    `${API_URL}/conversations/${encodeURIComponent(id)}/messages`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }

  return await response.json();
}

export async function sendMessage(id: string, content: string, token: string) {
  const response = await jsonFetch(
    `${API_URL}/conversations/${encodeURIComponent(id)}/messages`,
    {
      method: 'POST',
      payload: { content },
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return await response.json();
}

export async function createConversation(userId: string, token: string) {
  const response = await jsonFetch(`${API_URL}/conversations`, {
    method: 'POST',
    payload: { userId },
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to create conversation');
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
