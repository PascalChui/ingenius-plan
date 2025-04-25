"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { updateUserSettings } from "@/actions/user-actions"
import { useSession } from "next-auth/react"

const formSchema = z.object({
  theme: z.string(),
  language: z.string(),
  notificationsEnabled: z.boolean(),
  pomodoroDuration: z.coerce.number().min(1).max(60),
  shortBreakDuration: z.coerce.number().min(1).max(30),
  longBreakDuration: z.coerce.number().min(5).max(60),
  pomodorosUntilLongBreak: z.coerce.number().min(1).max(10),
})

interface SettingsFormProps {
  settings: any
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: settings.theme || "light",
      language: settings.language || "fr",
      notificationsEnabled: settings.notificationsEnabled || true,
      pomodoroDuration: settings.pomodoroDuration || 25,
      shortBreakDuration: settings.shortBreakDuration || 5,
      longBreakDuration: settings.longBreakDuration || 15,
      pomodorosUntilLongBreak: settings.pomodorosUntilLongBreak || 4,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user?.id) return

    setIsLoading(true)

    try {
      const result = await updateUserSettings(session.user.id, values)

      if (result.success) {
        toast({
          title: "Paramètres mis à jour",
          description: "Vos paramètres ont été enregistrés avec succès.",
        })
      } else {
        throw new Error("Failed to update settings")
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos paramètres.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Paramètres généraux</CardTitle>
            <CardDescription>Personnalisez votre expérience InGeniusPlan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thème</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un thème" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">Clair</SelectItem>
                        <SelectItem value="dark">Sombre</SelectItem>
                        <SelectItem value="system">Système</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Choisissez le thème de l'interface</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Langue</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une langue" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Choisissez la langue de l'application</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notificationsEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Notifications</FormLabel>
                    <FormDescription>Activer les notifications pour les rappels et les mises à jour</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div>
              <h3 className="text-lg font-medium mb-4">Paramètres Pomodoro</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="pomodoroDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée de travail (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>Durée d'une session de travail Pomodoro</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortBreakDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pause courte (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>Durée d'une pause courte entre les sessions</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longBreakDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pause longue (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>Durée d'une pause longue après plusieurs sessions</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pomodorosUntilLongBreak"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sessions avant pause longue</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>Nombre de sessions avant une pause longue</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
