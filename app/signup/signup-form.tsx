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
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
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
          <Input
            id="password"
            type="password"
            {...register("password")}
            required
          />
          <FieldError>{errors.password?.message}</FieldError>
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            {...register("confirmPassword")}
            required
          />
          <FieldError>{errors.confirmPassword?.message}</FieldError>
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit">Create Account</Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Sign up with GitHub
          </Button>
          <FieldDescription className="px-6 text-center">
            Already have an account? <Link href="/login">Log in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
