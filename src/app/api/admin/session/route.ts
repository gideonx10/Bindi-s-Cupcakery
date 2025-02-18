import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    // Retrieve the token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: "No token found",
      });
    }

    // Decode the token to get user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userId = decoded.userId;
    console.log("Decoded UserId:", userId);

    // Fetch user details from the backend API using the userId
    const res = await fetch(
      `http://localhost:3000/api/user/details?userId=${userId}`
    );
    const userData = await res.json();
    console.log(userData);

    if (!userData || !userData.user.role || userData.user.role !== "admin") {
      return NextResponse.redirect("/admin/login");
    }

    // Return the user data along with session info if the role is admin
    return NextResponse.json({
      authenticated: true,
      userId: decoded.userId,
      role: userData.user.role, // Ensure the role fetched from the backend is included
    });
  } catch (error) {
    console.error("Error during token verification:", error);
    return NextResponse.json(
      {
        authenticated: false,
        message: "Invalid token or server error",
      },
      { status: 500 }
    );
  }
}
