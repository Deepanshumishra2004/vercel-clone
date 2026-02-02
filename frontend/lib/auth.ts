const TOKEN_KEY = "token";
const TOKEN_COOKIE = "token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  console.log("token : ",token);
  if (typeof window === "undefined") return;
  console.log("_________11111_________ ");
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=604800`; // 7 days
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}