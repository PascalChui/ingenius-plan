import { isPasswordPreviouslyUsed, addPasswordToHistory } from "@/data/teams"

// Configuration
const PASSWORD_HISTORY_SIZE = 5
const PASSWORD_MIN_AGE_DAYS = 1 // Minimum days before allowing password reuse

/**
 * Validates a new password against history
 * @param userId User ID
 * @param newPassword New password to validate
 * @returns Validation result with success flag and message
 */
export function validatePasswordHistory(userId: string, newPassword: string): { valid: boolean; message: string } {
  // Check if password has been used before
  if (isPasswordPreviouslyUsed(userId, newPassword)) {
    return {
      valid: false,
      message: `Cannot reuse any of your last ${PASSWORD_HISTORY_SIZE} passwords.`,
    }
  }

  return {
    valid: true,
    message: "Password accepted.",
  }
}

/**
 * Updates password history when a password is changed
 * @param userId User ID
 * @param newPassword New password
 */
export function updatePasswordHistory(userId: string, newPassword: string): void {
  addPasswordToHistory(userId, newPassword, PASSWORD_HISTORY_SIZE)
}

/**
 * Gets password policy information
 * @returns Password policy details
 */
export function getPasswordPolicy(): {
  historySize: number
  minAgeDays: number
  description: string
} {
  return {
    historySize: PASSWORD_HISTORY_SIZE,
    minAgeDays: PASSWORD_MIN_AGE_DAYS,
    description: `For security reasons, you cannot reuse any of your last ${PASSWORD_HISTORY_SIZE} passwords.`,
  }
}
