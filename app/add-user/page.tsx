import AddUserForm from "@/components/add-user-form"
import { Layout } from "@/components/layout"

export default function AddUserPage() {
  return (
    <Layout>
      <div className="container px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Add User</h1>
        <AddUserForm />
      </div>
    </Layout>
  )
}
