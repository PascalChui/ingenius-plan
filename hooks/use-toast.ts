"use client"

// Create a simple toast function that doesn't rely on hooks
export const toast = {
  // Basic toast function
  toast: (props: any) => {
    // This is a simple implementation that will work outside of components
    // In a real app with a proper toast system, this would be more sophisticated
    if (typeof window !== "undefined") {
      // Create a simple event to trigger toast
      const event = new CustomEvent("show-toast", { detail: props })
      window.dispatchEvent(event)
    }
    return { id: Math.random().toString(), dismiss: () => {}, update: () => {} }
  },
}

// Export a hook version for use in components
export function useToast() {
  return toast
}
