import User from "@/database/user.model";
import handleError from "@/src/lib/handlers/error";
import { ValidationError } from "@/src/lib/http-errors";
import dbConnect from "@/src/lib/mongoose";
import { UserSchema } from "@/src/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find();

    return NextResponse.json(
      {
        success: true,
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = UserSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { email, username } = validatedData.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already exists");
    const existingUsername = await User.findOne({ username });
    if (existingUsername) throw new Error("Username already exists");
    const newUser = await User.create(validatedData.data);

    return NextResponse.json(
      {
        success: true,
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
