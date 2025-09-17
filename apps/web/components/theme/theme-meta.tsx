"use client"

import { useEffect } from "react"
import { useTheme } from "@/context/theme-context"

export function DynamicThemeColor() {
  const { theme } = useTheme()

  useEffect(() => {
    const color = theme === "dark" ? "#020817" : "#ffffff"
    let meta = document.querySelector("meta[name='theme-color']")
    if (!meta) {
      meta = document.createElement("meta")
      meta.setAttribute("name", "theme-color")
      document.head.appendChild(meta)
    }
    meta.setAttribute("content", color)
  }, [theme])

  return null
}
