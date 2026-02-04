const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL não definida");
}

export type LoginResponse = {
  id: string;
  name: string;
  email: string;
  age: number | null;
  created_at: string;
  updated_at: string;
  password: string;
  role: string;
  username: string;
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Falha no login");
  }

  return response.json();
}
