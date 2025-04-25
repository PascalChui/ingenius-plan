"use client"

import type React from "react"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface CreateTeamModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateTeamModal({ isOpen, onClose }: CreateTeamModalProps) {
  const [teamName, setTeamName] = useState("")
  const [teamDescription, setTeamDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would create the team in the backend
    console.log("Creating team:", { teamName, teamDescription })

    // Reset form and close modal
    setTeamName("")
    setTeamDescription("")
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Team">
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="team-name">
            Team Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="team-name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="team-description">Description</Label>
          <Textarea
            id="team-description"
            value={teamDescription}
            onChange={(e) => setTeamDescription(e.target.value)}
            placeholder="Enter team description"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-black text-white hover:bg-gray-800">
            Create Team
          </Button>
        </div>
      </form>
    </Modal>
  )
}
