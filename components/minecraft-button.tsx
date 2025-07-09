"use client"

import type React from "react"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface MinecraftButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: "stone" | "wood" | "diamond"
  className?: string
}

export default function MinecraftButton({
  children,
  href,
  onClick,
  variant = "stone",
  className,
}: MinecraftButtonProps) {
  const variantStyles = {
    stone:
      "bg-[#7D7D7D] hover:bg-[#8E8E8E] border-t-[#A5A5A5] border-l-[#A5A5A5] border-r-[#555555] border-b-[#555555]",
    wood: "bg-[#8B4513] hover:bg-[#9C5624] border-t-[#A86A3D] border-l-[#A86A3D] border-r-[#6A320E] border-b-[#6A320E]",
    diamond:
      "bg-[#4C9ED9] hover:bg-[#5DAEEA] border-t-[#7DBEF2] border-l-[#7DBEF2] border-r-[#3A7BA7] border-b-[#3A7BA7]",
  }

  const buttonClasses = cn(
    "minecraft-button inline-block py-2 px-4 text-white font-bold border-4 transition-transform active:translate-y-1",
    variantStyles[variant],
    className,
  )

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={buttonClasses}>
      {children}
    </button>
  )
}
