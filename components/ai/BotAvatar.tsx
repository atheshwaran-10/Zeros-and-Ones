"use client"

import React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface BotAvatarProps {
  props: string | undefined
}

export const BotAvatar: React.FC<BotAvatarProps> = ({ props }) => {
  return (
    <Avatar className="h-10 w-10 cursor-pointer items-center justify-center">
      <AvatarImage
        src={
          props
            ? props
            : "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yZHRrUFp4dzlieVYySU1rd2tIZkFpNk1hclQifQ?width=80"
        }
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
