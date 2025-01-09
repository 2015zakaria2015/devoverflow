"use client";

import AuthForm from "@/src/components/forms/AuthForm";
import { signInWithCredentials } from "@/src/lib/actions/auth.action";
import { SignInSchema } from "@/src/lib/validation";
import React from "react";



const SignIn = () => {
  return (
    <AuthForm
      formType="SIGN_IN"
      schema={SignInSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={signInWithCredentials}
    />
  );
};

export default SignIn;