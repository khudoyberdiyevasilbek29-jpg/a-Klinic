import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

const COOKIE_NAME = "aklinic_token";

type DecodedToken = {
  sub: number;
  role: Role;
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedRoutes: Array<{
    prefix: string;
    roles: Role[];
  }> = [
    { prefix: "/reception", roles: [Role.RECEPTION, Role.ADMIN] },
    { prefix: "/doctor", roles: [Role.DOCTOR] },
    { prefix: "/admin", roles: [Role.ADMIN] }
  ];

  const matched = protectedRoutes.find((r) =>
    pathname.startsWith(r.prefix)
  );

  if (!matched) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !process.env.JWT_SECRET) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as DecodedToken;

    if (!matched.roles.includes(decoded.role)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/reception/:path*", "/doctor/:path*", "/admin/:path*"]
};

