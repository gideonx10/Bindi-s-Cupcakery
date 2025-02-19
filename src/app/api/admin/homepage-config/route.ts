import connectDB from "@/lib/connectDB";
import HomePageConfig from "@/models/HomePageConfig";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    // Admin authentication check
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    jwt.verify(token, process.env.JWT_SECRET!);
    
    // Get existing homepage configuration if available
    let config = await HomePageConfig.findOne();
    if (!config) {
      // Create a default config if not present
      config = await HomePageConfig.create({
        topCategories: [],
        topBestsellers: [],
      });
    }
    return NextResponse.json(config);
  } catch (error: any) {
    console.error("Error fetching homepage config:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    // Admin authentication check
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    jwt.verify(token, process.env.JWT_SECRET!);

    const body = await req.json();
    const { topCategories, topBestsellers } = body; // expect arrays of 4 IDs each

    // Validate the input lengths if required (only 4 elements expected)
    if (
      !Array.isArray(topCategories) ||
      !Array.isArray(topBestsellers) ||
      topCategories.length > 4 ||
      topBestsellers.length > 4
    ) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    let config = await HomePageConfig.findOne();
    if (!config) {
      config = await HomePageConfig.create({ topCategories, topBestsellers });
    } else {
      config.topCategories = topCategories;
      config.topBestsellers = topBestsellers;
      await config.save();
    }

    return NextResponse.json(config);
  } catch (error: any) {
    console.error("Error updating homepage config:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}