"use client"

import { useActionState } from "react"
import { addUser } from "../action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AddUserForm() {
  const [state, action, isPending] = useActionState(addUser)

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" required className="mt-1 block w-full" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" required className="mt-1 block w-full" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" required className="mt-1 block w-full" />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Adding..." : "Add User"}
      </Button>
      {state && (
        <div className={`mt-4 text-center ${state.success ? "text-green-600" : "text-red-600"}`}>{state.message}</div>
      )}
    </form>
  )
}
