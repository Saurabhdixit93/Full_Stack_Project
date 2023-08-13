import jsCookies from "js-cookie";

export function getTokenCookie() {
  return jsCookies.get("token");
}
