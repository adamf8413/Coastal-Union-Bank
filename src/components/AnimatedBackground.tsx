"use client"

import { useEffect, useState } from "react"
import { brand } from "@/lib/brand"

type Particle = {
  id: number
  x: number
  y: number
  size: number
  speed: number
  delay: number
  shape: "circle" | "diamond" | "star"
  opacity: number
}

export function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const items: Particle[] = []
    for (let i = 0; i < 20; i++) {
      items.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 3 + Math.random() * 8,
        speed: 20 + Math.random() * 40,
        delay: Math.random() * 10,
        shape: (["circle", "diamond", "star"] as const)[Math.floor(Math.random() * 3)],
        opacity: 0.03 + Math.random() * 0.08,
      })
    }
    setParticles(items)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Mesh gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 20% 50%, var(--brand-hero-gradient-from, #1e1b4b) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 30%, var(--brand-hero-gradient-via, #312e81) 0%, transparent 50%),
                      radial-gradient(ellipse at 50% 80%, var(--brand-hero-gradient-to, #0a0a0f) 0%, transparent 50%)`,
        }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `float-particle ${p.speed}s ease-in-out ${p.delay}s infinite alternate`,
            background: p.shape === "circle"
              ? "var(--brand-hero-particle, #a5b4fc)"
              : "transparent",
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "diamond" ? "2px" : "50%",
            border: p.shape !== "circle" ? `1px solid var(--brand-hero-particle, #a5b4fc)` : "none",
            transform: p.shape === "diamond" ? "rotate(45deg)" : "none",
          }}
        />
      ))}

      {/* Glow orbs */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "40vw",
          height: "40vw",
          left: "-10%",
          top: "-10%",
          background: "var(--brand-hero-glow, #818cf8)",
          opacity: 0.04,
          animation: "pulse-glow 8s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "30vw",
          height: "30vw",
          right: "-5%",
          bottom: "-5%",
          background: "var(--brand-accent, #34d399)",
          opacity: 0.03,
          animation: "pulse-glow 10s ease-in-out 2s infinite alternate",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(var(--brand-foreground, #e2e8f0) 1px, transparent 1px),
                            linear-gradient(90deg, var(--brand-foreground, #e2e8f0) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  )
}
