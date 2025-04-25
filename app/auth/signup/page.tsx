import type { Metadata } from "next"
import Link from "next/link"
import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Inscription | InGeniusPlan",
  description: "Créez un compte InGeniusPlan",
}

export default function SignUpPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Créer un compte</h1>
          <p className="text-sm text-muted-foreground">Entrez vos informations pour créer un compte</p>
        </div>
        <SignUpForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link href="/auth/signin" className="hover:text-brand underline underline-offset-4">
            Déjà un compte? Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
