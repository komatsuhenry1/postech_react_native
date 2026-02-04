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

export type ApiResponse<T> = {
  data: T;
  statusCode: number;
  role: string;
};

export async function login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
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

  const data = await response.json();

  return {
    data,
    statusCode: response.status,
    role: data.role,
  };
}

export async function register(name: string, email: string, username: string, password: string): Promise<ApiResponse<LoginResponse>> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      username,
      password,
    }),
  });

  const data = await response.json();

  return {
    data,
    statusCode: response.status,
    role: data.role,
  };
}
