const API_URL = process.env.EXPO_PUBLIC_API_URL;
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export async function createPost(title: string, content: string, author: string): Promise<ApiResponse<LoginResponse>> {
  const role = await AsyncStorage.getItem("role");
  console.log(role);
  console.log(role);
  console.log(role);
  const response = await fetch(`${API_URL}/posts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "role": `${role}`,
    },
    body: JSON.stringify({
      title,
      content,
      author,
    }),
  });

  const data = await response.json();
  console.log(data);

  return {
    data,
    statusCode: response.status,
    role: data.role,
  };
}

export type PostModel = {
  id: string;
  title: string;
  content: string;
  author: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export async function getPosts(): Promise<PostModel[]> {
  const role = await AsyncStorage.getItem("role");

  const response = await fetch(`${API_URL}/posts`, {
    headers: {
      "Content-Type": "application/json",
      role: "admin",
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`GET /posts falhou (${response.status}): ${text}`);
  }

  return response.json();
}

export type PostDetailModel = PostModel & {
  comments: any[];
};

export async function getPostById(id: string): Promise<PostDetailModel> {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "role": "admin",
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`GET /posts/:id falhou (${response.status}): ${text}`);
  }

  return response.json();
}

export async function searchPosts(term: string): Promise<PostModel[]> {
  const role = await AsyncStorage.getItem("role");

  const response = await fetch(`${API_URL}/posts/search/${term}`, {
    headers: {
      "Content-Type": "application/json",
      role: "user",
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`GET /posts/search falhou (${response.status}): ${text}`);
  }

  return response.json();
}

export async function updatePost(id: string, title: string, content: string, author: string): Promise<ApiResponse<LoginResponse>> {
  const role = await AsyncStorage.getItem("role");
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "role": `${role}`,
    },
    body: JSON.stringify({
      title,
      content,
      author,
    }),
  });

  const data = await response.json();
  console.log(data);

  return {
    data,
    statusCode: response.status,
    role: data.role,
  };
}

export async function deletePost(id: string): Promise<ApiResponse<LoginResponse>> {
  const role = await AsyncStorage.getItem("role");
  console.log(role);
  console.log(role);
  console.log(role);
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "role": `${role}`,
    },
  });

  const data = await response.json();
  console.log(data);

  return {
    data,
    statusCode: response.status,
    role: data.role,
  };
}

