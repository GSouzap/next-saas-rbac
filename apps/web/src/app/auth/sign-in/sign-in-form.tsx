"use client"

import { AlertTriangle, Loader2 } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { signInWithEmailAndPassword } from "./actions"
import { useFormState } from "@/hooks/use-form-state"
import { Separator } from "@/components/ui/separator"
import githubIcon from "@/assets/github-icon.svg"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function SignInForm() {
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(signInWithEmailAndPassword)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sign in failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />

        {errors?.email && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />

        <Link href="/auth/forgot-password" className="text-xs font-medium text-foreground hover:underline">
          Forgot your password?
        </Link>

        {errors?.password && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.password[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : 
          'Sign in with e-mail'
        }
      </Button>

      <Button variant="link" className="w-full" size="sm" asChild>
        <Link href="/auth/sign-up">
          Create new account
        </Link>
      </Button>

      <Separator />

      <Button type="submit" variant="outline" className="w-full">
        <Image src={githubIcon} alt="" className="size-4 mr-2 dark:invert" />
        Sign in with Github
      </Button>
    </form>
  )
}