import { NextResponse } from "next/server";

import Account from "@/database/account.model";
import dbConnect from "@/src/lib/mongoose";
import { AccountSchema } from "@/src/lib/validation";
import { NotFoundError, ValidationError } from "@/src/lib/http-errors";
import handleError from "@/src/lib/handlers/error";


export async function POST(request: Request) {
  const { providerAccountId } = await request.json();

  try {
    await dbConnect();

    const validatedData = AccountSchema.partial().safeParse({
      providerAccountId,
    });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const account = await Account.findOne({ providerAccountId });
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}