import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    console.log("Attempting to find user with email:", email);
    const client = await clientPromise;
    const db = client.db();

    try {
      // Find user by email
      const user = await db
        .collection("users")
        .findOne({ email: email.trim() });
      console.log("User search result:", user ? "Found" : "Not found");

      if (!user) {
        return NextResponse.json(
          { error: "No account found with this email" },
          { status: 404 }
        );
      }

      // Hash the new password
      const hashedPassword = await hash(newPassword, 12);
      console.log("Password hashed successfully");

      // Update user's password
      const result = await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(user._id) },
          { $set: { password: hashedPassword } }
        );
      console.log("Update result:", result);

      if (result.modifiedCount === 0) {
        throw new Error("Failed to update password");
      }

      return NextResponse.json(
        { message: "Password updated successfully" },
        { status: 200 }
      );
    } finally {
      // Don't close the client as it's managed by the clientPromise
    }
  } catch (error) {
    console.error("Error in forgot password endpoint:", error);

    // Provide more specific error messages based on the error type
    if (error instanceof Error) {
      if (error.message.includes("MongoDB")) {
        return NextResponse.json(
          { error: "Database connection error. Please try again later." },
          { status: 503 }
        );
      }
      if (error.message.includes("password")) {
        return NextResponse.json(
          { error: "Failed to update password. Please try again." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
