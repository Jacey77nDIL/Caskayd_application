// utils/auth.ts (No libraries needed)
export const storeToken = (token: string) => {
  if (typeof window !== "undefined") {
    // Expires in 7 days
    const days = 7;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "; expires=" + date.toUTCString();
    
    document.cookie = `jwt=${token}${expires}; path=/; Secure; SameSite=Strict`;
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    const nameEQ = "jwt=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    document.cookie = "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }
};