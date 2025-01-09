"use client";

import AuthForm from "@/src/components/forms/AuthForm";
import { signUpWithCredentials } from "@/src/lib/actions/auth.action";
import { SignUpSchema } from "@/src/lib/validation";
import React from "react";



const SignUp = () => {
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{ email: "", password: "", name: "", username: "" }}
      onSubmit={signUpWithCredentials}
    />
  );
};

export default SignUp;