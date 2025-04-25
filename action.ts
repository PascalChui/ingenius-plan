"use server"

export async function addUser(formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const name = formData.get("name")
  const email = formData.get("email")
  const password = formData.get("password")

  // TODO: Add user to database
  console.log("Adding user to database", { name, email, password })

  return {
    success: true,
    message: `User ${name} added successfully!`,
  }
}
