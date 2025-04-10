import { type NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { hash } from "bcryptjs";
import { getMongoClient } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    try {
      const decoded = verify(token, JWT_SECRET) as {
        id: string;
        email: string;
      };
      const hashedPassword = await hash(password, 10);
      const client = await getMongoClient();
      const db = client.db();

      const result = await db
        .collection("users")
        .updateOne(
          { _id: decoded.id, email: decoded.email },
          { $set: { password: hashedPassword } }
        );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: "Invalid or expired reset link" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        message: "Password has been reset successfully",
      });
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
