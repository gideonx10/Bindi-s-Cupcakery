import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    // ✅ Use NextRequest's cookies method
    console.log("1");
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: "No token found",
      });
    }

    // ✅ Decode the token properly
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    console.log(decoded.role);

    return NextResponse.json({
      authenticated: true,
      userId: decoded.userId,
      // phone: decoded.phone,
      // // role: decoded.role,
      // name: decoded.name,
      // email: decoded.email,
    });
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      message: "Invalid token",
    });
  }
}
