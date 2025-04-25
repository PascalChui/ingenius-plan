import type { Metadata } from "next"
import Link from "next/link"
import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
  title: "Connexion | InGeniusPlan",
  description: "Connectez-vous à votre compte InGeniusPlan",
}

export default function SignInPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Bienvenue</h1>
          <p className="text-sm text-muted-foreground">Entrez votre email et mot de passe pour vous connecter</p>
        </div>
        <SignInForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link href="/auth/signup" className="hover:text-brand underline underline-offset-4">
            Pas encore de compte? S'inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}
