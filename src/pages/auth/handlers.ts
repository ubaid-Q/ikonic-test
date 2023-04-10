import { api } from "../../config/axoisConfig";

export const registerUser = (event: React.FormEvent<HTMLFormElement>) => {
  const formData = new FormData(event.currentTarget);
  const data = Object.fromEntries((formData as any).entries());
  return api.post("/api/auth/register", JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};



export const signInUser = (event: React.FormEvent<HTMLFormElement>) => {
  const formData = new FormData(event.currentTarget);
  const data = Object.fromEntries((formData as any).entries());
  return api.post("/api/auth/login", JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};