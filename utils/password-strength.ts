// Password strength calculation utility

/**
 * Calculate password strength score (0-100)
 * @param password The password to evaluate
 * @returns A score from 0-100 and feedback
 */
export function calculatePasswordStrength(password: string): {
  score: number
  feedback: string
  requirements: { text: string; met: boolean }[]
} {
  if (!password) {
    return {
      score: 0,
      feedback: "Password is required",
      requirements: getRequirements(""),
    }
  }

  // Define base requirements
  const requirements = getRequirements(password)
  const metRequirementsCount = requirements.filter((req) => req.met).length

  // Calculate initial score based on requirements met
  let score = (metRequirementsCount / requirements.length) * 60

  // Add bonus points for length beyond minimum
  if (password.length > 8) {
    score += Math.min((password.length - 8) * 2, 15)
  }

  // Add bonus for character variety
  const varietyScore = calculateVarietyScore(password)
  score += varietyScore

  // Penalize for common patterns
  score -= detectCommonPatterns(password)

  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, Math.round(score)))

  // Generate feedback based on score
  const feedback = getFeedback(score, requirements)

  return {
    score,
    feedback,
    requirements,
  }
}

/**
 * Get list of password requirements and whether they're met
 */
function getRequirements(password: string): { text: string; met: boolean }[] {
  return [
    {
      text: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      text: "Contains uppercase letters (A-Z)",
      met: /[A-Z]/.test(password),
    },
    {
      text: "Contains lowercase letters (a-z)",
      met: /[a-z]/.test(password),
    },
    {
      text: "Contains numbers (0-9)",
      met: /[0-9]/.test(password),
    },
    {
      text: "Contains special characters (!@#$%^&*)",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ]
}

/**
 * Calculate score bonus based on character variety
 */
function calculateVarietyScore(password: string): number {
  let score = 0

  // Check for good distribution of character types
  const charTypes = {
    uppercase: 0,
    lowercase: 0,
    numbers: 0,
    special: 0,
  }

  for (const char of password) {
    if (/[A-Z]/.test(char)) charTypes.uppercase++
    else if (/[a-z]/.test(char)) charTypes.lowercase++
    else if (/[0-9]/.test(char)) charTypes.numbers++
    else charTypes.special++
  }

  // Calculate distribution score
  const totalChars = password.length
  const typeCount = Object.values(charTypes).filter((count) => count > 0).length

  // Bonus for using multiple character types
  score += typeCount * 5

  // Bonus for good distribution
  if (
    typeCount >= 3 &&
    charTypes.uppercase / totalChars > 0.1 &&
    charTypes.lowercase / totalChars > 0.1 &&
    (charTypes.numbers / totalChars > 0.1 || charTypes.special / totalChars > 0.1)
  ) {
    score += 10
  }

  return score
}

/**
 * Detect common patterns that weaken passwords
 * @returns Penalty score to subtract
 */
function detectCommonPatterns(password: string): number {
  let penalty = 0
  const lowerPass = password.toLowerCase()

  // Check for sequential characters
  const sequences = ["abcdefghijklmnopqrstuvwxyz", "01234567890", "qwertyuiop", "asdfghjkl", "zxcvbnm"]
  for (const seq of sequences) {
    for (let i = 0; i < seq.length - 2; i++) {
      const pattern = seq.substring(i, i + 3)
      if (lowerPass.includes(pattern)) {
        penalty += 5
        break
      }
    }
  }

  // Check for repeated characters
  const repeatedChars = /(.)\1{2,}/
  if (repeatedChars.test(password)) {
    penalty += 5
  }

  // Check for only numbers or only letters
  if (/^[0-9]+$/.test(password) || /^[a-zA-Z]+$/.test(password)) {
    penalty += 10
  }

  return penalty
}

/**
 * Get feedback message based on score
 */
function getFeedback(score: number, requirements: { text: string; met: boolean }[]): string {
  const unmetRequirements = requirements.filter((req) => !req.met)

  if (unmetRequirements.length > 0) {
    return `Meet all requirements for a stronger password`
  }

  if (score < 40) {
    return "Weak password - too easy to guess"
  } else if (score < 60) {
    return "Fair password - consider adding more variety"
  } else if (score < 80) {
    return "Good password - meets security standards"
  } else {
    return "Strong password - excellent security"
  }
}

/**
 * Get color based on password strength score
 */
export function getStrengthColor(score: number): string {
  if (score < 40) return "bg-destructive"
  if (score < 60) return "bg-orange-500"
  if (score < 80) return "bg-yellow-500"
  return "bg-green-500"
}

/**
 * Get label based on password strength score
 */
export function getStrengthLabel(score: number): string {
  if (score < 40) return "Weak"
  if (score < 60) return "Fair"
  if (score < 80) return "Good"
  return "Strong"
}
