"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const schema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof schema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
          callbackURL: "/",
        },
        {
          onSuccess() {
            toast.success("Signup successfully.");
            window.location.href = "/";
          },
          onError(context) {
            console.log(context);
            if (context?.error?.code === "PASSWORD_COMPROMISED") {
              setError("password", {
                type: "manual",
                message:
                  "Password is found in data breaches. Please choose a different password.",
              });
              return;
            } else if (
              context?.error?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
            ) {
              setError("email", {
                type: "manual",
                message: context.error.message,
              });
              return;
            } else {
              toast.error(context.error.message);
            }
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>
        
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            {...register("name")}
            placeholder="John Doe"
            required
          />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="m@example.com"
            required
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              {...register("password")}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <FieldError>{errors.password?.message}</FieldError>
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="********"
              {...register("confirmPassword")}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 hover:text-foreground"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <FieldError>{errors.confirmPassword?.message}</FieldError>
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <div className="flex gap-2">
            <Button
              variant="outline"
              type="button"
              className="flex-1"
              onClick={async () => {
                try {
                  await authClient.signIn.social({
                    provider: "google",
                    callbackURL: "/",
                  });
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to login with Google");
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
            </Button>

            <Button
              variant="outline"
              type="button"
              className="flex-1"
              onClick={async () => {
                try {
                  await authClient.signIn.social({
                    provider: "spotify",
                    callbackURL: "/",
                  });
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to login with Spotify");
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.2-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                  fill="currentColor"
                />
              </svg>
            </Button>
          </div>
          <FieldDescription className="px-6 text-center">
            Already have an account? <Link href="/login">Log in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
