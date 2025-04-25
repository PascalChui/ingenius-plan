import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileDetails } from "@/components/profile/profile-details"
import { ProfileActivity } from "@/components/profile/profile-activity"
import { ProfileSettings } from "@/components/profile/profile-settings"
import { ProfileStatistics } from "@/components/profile/profile-statistics"
import { SecuritySettings } from "@/components/profile/security-settings"
import { getUserById } from "@/data/teams"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile | IngeniusPlan",
  description: "Manage your profile and account settings",
}

export default function ProfilePage() {
  // In a real app, this would come from authentication
  const currentUser = getUserById("user-1")

  if (!currentUser) {
    return (
      <div className="container mx-auto py-10">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center">
          <h2 className="text-xl font-semibold text-destructive">User not found</h2>
          <p className="mt-2 text-muted-foreground">The requested user profile could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <ProfileHeader user={currentUser} />

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-5">
          <TabsTrigger value="details">Profile Details</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <ProfileDetails user={currentUser} />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ProfileActivity userId={currentUser.id} />
        </TabsContent>

        <TabsContent value="statistics" className="mt-6">
          <ProfileStatistics userId={currentUser.id} />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecuritySettings user={currentUser} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <ProfileSettings user={currentUser} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
