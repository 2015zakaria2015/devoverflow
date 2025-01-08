import ROUTES from "@/constants/routes";
import { IAccount } from "@/database/account.model";
import { IUser } from "@/database/user.model";

import { fetchHandler } from "./handlers/fetch";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const api = {
  auth: {
    oAuthSignIn: ({
      user,
      provider,
      providerAccountId,
    }: SignInWithOAuthParams) =>
      fetchHandler(`${API_BASE_URL}/auth/${ROUTES.SIGN_IN_WITH_OAUTH}`, {
        method: "POST",
        body: JSON.stringify({ user, provider, providerAccountId }),
      }),
  },
  users: {
    getAll: () => fetchHandler(`${API_BASE_URL}/users`),
    getById: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`),
    getByEmail: (email: string) =>
      fetchHandler(`${API_BASE_URL}/users/email`, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    create: (userData: Partial<IUser>) =>
      fetchHandler(`${API_BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    update: (id: string, userData: Partial<IUser>) =>
      fetchHandler(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      }),
    delete: (id: string) =>
      fetchHandler(`${API_BASE_URL}/users/${id}`, { method: "DELETE" }),
  },
  accounts: {
    getAll: () => fetchHandler(`${API_BASE_URL}/accounts`),
    getById: (id: string) => fetchHandler(`${API_BASE_URL}/accounts/${id}`),
    getByProvider: (providerAccountId: string) =>
      fetchHandler(`${API_BASE_URL}/accounts/provider`, {
        method: "POST",
        body: JSON.stringify({ providerAccountId }),
      }),
    create: (accountData: Partial<IAccount>) =>
      fetchHandler(`${API_BASE_URL}/accounts`, {
        method: "POST",
        body: JSON.stringify(accountData),
      }),
    update: (id: string, accountData: Partial<IAccount>) =>
      fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
        method: "PUT",
        body: JSON.stringify(accountData),
      }),
    delete: (id: string) =>
      fetchHandler(`${API_BASE_URL}/accounts/${id}`, { method: "DELETE" }),
  },
};

import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import slugify from 'slugify';

import Account from '@/database/account.model';
import User, { IUser } from '@/database/user.model';
import dbConnect from '@/src/lib/mongoose';
import handleError from '@/src/lib/handlers/error';
import { APIErrorResponse } from '@/types/global';
import { SignInWithOAuthSchema } from '@/src/lib/validation';
import { ValidationError } from '@/src/lib/http-errors';


interface IUserData {
  name: string;
  username: string;
  email: string;
  image?: string;
}

interface IValidatedData {
  provider: string;
  providerAccountId: string;
  user: IUserData;
}

export async function POST(request: Request) {
  const { provider, providerAccountId, user } = await request.json();

  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validatedData = validateRequestData({ provider, providerAccountId, user });
    const { user: userData } = validatedData;

    const existingUser = await findOrCreateUser(userData, session);
    await findOrCreateAccount(existingUser._id, provider, providerAccountId, userData, session);

    await session.commitTransaction(); // Finalizes and saves all changes made within the transaction.
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    await session.abortTransaction(); // Reverts any changes if something goes wrong, maintaining data consistency.
    return handleError(error, 'api') as APIErrorResponse;
  } finally {
    session.endSession();
  }
}

const validateRequestData = (data: IValidatedData): IValidatedData => {
  const validatedData = SignInWithOAuthSchema.safeParse(data);

  if (!validatedData.success) {
    throw new ValidationError(validatedData.error.flatten().fieldErrors);
  }

  return validatedData.data;
};

const findOrCreateUser = async (userData: IUserData, session: mongoose.ClientSession) => {
  const { name, username, email, image } = userData;

  const normalizedUsername = slugify(username, { lower: true, strict: true, trim: true });

  let existingUser = await User.findOne({ email }).session(session);

  if (!existingUser) {
    [existingUser] = await User.create([{ name, username: normalizedUsername, email, image }], { session });
  } else {
    await updateUserIfNecessary(existingUser, userData, session);
  }

  return existingUser;
};

const updateUserIfNecessary = async (existingUser: IUser, userData: IUserData, session: mongoose.ClientSession) => {
  const { name, image } = userData;
  const updatedData: { name?: string; image?: string } = {};

  if (existingUser.name !== name) updatedData.name = name;
  if (existingUser.image !== image) updatedData.image = image;
  if (Object.keys(updatedData).length > 0) {
    await User.updateOne({ _id: existingUser._id }, { $set: updatedData }).session(session);
  }
};

const findOrCreateAccount = async (
  userId: mongoose.Types.ObjectId,
  provider: string,
  providerAccountId: string,
  userData: IUserData,
  session: mongoose.ClientSession
) => {
  const { name, image } = userData;

  const existingAccount = await Account.findOne({ userId, provider, providerAccountId }).session(session);

  if (existingAccount) {
    return existingAccount;
  }

  const newAccount = await Account.create(
    [
      {
        userId,
        name,
        image,
        provider,
        providerAccountId,
      },
    ],
    { session }
  );

  return newAccount;
};

"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import React from "react";

import ROUTES from "@/constants/routes";


import { Button } from "../ui/button";
import { toast } from "@/src/hooks/use-toast";

const SocialAuthForm = () => {
  const buttonClass =
    "background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1 rounded-2 px-4 py-3.5";

  const handleSignIn = async (provider: "github" | "google") => {
    try {
      await signIn(provider, {
        callbackUrl: ROUTES.HOME,
        redirect: false,
      });
    } catch (error) {
      console.log(error);

      toast({
        title: "Sign-in Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occured during sign-in",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button className={buttonClass} onClick={() => handleSignIn("github")}>
        <Image
          src="/icons/github.svg"
          alt="Github Logo"
          width={20}
          height={20}
          className="invert-colors mr-2.5 object-contain"
        />
        <span>Log in with GitHub</span>
      </Button>

      <Button className={buttonClass} onClick={() => handleSignIn("google")}>
        <Image
          src="/icons/google.svg"
          alt="Google Logo"
          width={20}
          height={20}
          className="mr-2.5 object-contain"
        />
        <span>Log in with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;

import { ActionResponse } from "@/types/global";
import { RequestError } from "../http-errors";
import logger from "../logger";
import handleError from "./error";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {}
): Promise<ActionResponse<T>> {
  const {
    timeout = 5000,
    headers: customHeaders = {},
    ...restOptions
  } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };
  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);

    clearTimeout(id);

    if (!response.ok) {
      throw new RequestError(response.status, `HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    const error = isError(err) ? err : new Error("Unknown error");

    if (error.name === "AbortError") {
      logger.warn(`Request to ${url} timed out`);
    } else {
      logger.error(`Error fetching ${url}: ${error.message}`);
    }

    return handleError(error) as ActionResponse<T>;
  }
}

import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { RequestError, ValidationError } from "../http-errors";
import logger from "../logger";

export type ResponseType = "api" | "server";

const formatResponse = (
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };

  return responseType === "api"
    ? NextResponse.json(responseContent, { status })
    : { status, ...responseContent };
};

const handleError = (error: unknown, responseType: ResponseType = "server") => {
  if (error instanceof RequestError) {
    logger.error(
      { err: error },
      `${responseType.toUpperCase()} Error: ${error.message}`
    );

    return formatResponse(
      responseType,
      error.statusCode,
      error.message,
      error.errors
    );
  }

  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      error.flatten().fieldErrors as Record<string, string[]>
    );

    logger.error(
      { err: error },
      `Validation Error: ${validationError.message}`
    );

    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors
    );
  }

  if (error instanceof Error) {
    logger.error(error.message);

    return formatResponse(responseType, 500, error.message);
  }

  logger.error({ err: error }, "An unexpected error occurred");
  return formatResponse(responseType, 500, "An unexpected error occurred");
};

export default handleError;