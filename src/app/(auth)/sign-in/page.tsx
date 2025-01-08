"use client";

import AuthForm from "@/src/components/forms/AuthForm";
import { SignInSchema } from "@/src/lib/validation";
import React from "react";



const SignIn = () => {
  return (
    <AuthForm
      formType="SIGN_IN"
      schema={SignInSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={(data) => Promise.resolve({ success: true, data })}
    />
  );
};

export default SignIn;