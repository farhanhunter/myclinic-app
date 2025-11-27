import { auth } from "./auth";

export default auth((req) => {
  // Your custom middleware logic here
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$). *)"],
};
