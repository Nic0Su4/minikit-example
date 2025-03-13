import { hasCookie, getCookie, setCookie } from "cookies-next";

export const getCookieCart = (): { [id: string]: number } => {
  if (hasCookie("cart")) {
    const cookieCart = JSON.parse((getCookie("cart") as string) ?? "{}");
    return cookieCart;
  }

  return {};
};

export const addProductTocart = (id: string, quantity?: number) => {
  const cookieCart = getCookieCart();

  if (cookieCart[id]) {
    cookieCart[id] += quantity ?? 1;
  } else {
    cookieCart[id] = quantity ?? 1;
  }

  setCookie("cart", JSON.stringify(cookieCart));
};
