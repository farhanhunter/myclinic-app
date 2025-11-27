import { auth } from "./auth";

export default auth((req) => {
  // Middleware logic is handled by authConfig
  // You can add custom logic here if needed
});

export const config = {
  // Protect all routes except static files, api auth, and public assets
  matcher: [
    "/((?! api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
