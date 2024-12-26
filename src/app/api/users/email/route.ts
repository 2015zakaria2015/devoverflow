import User from "@/database/user.model";
import handleError from "@/src/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/src/lib/http-errors";
import { UserSchema } from "@/src/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    const validatedData = UserSchema.partial().safeParse({ email });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User");
    return NextResponse.json({
        success: true,
        data : user

    } , {status: 200});
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
