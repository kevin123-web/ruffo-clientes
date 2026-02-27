"use client"
import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/superbase/client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewPetPage() {
  const params = useParams()
  const router = useRouter()
  const [name, setName] = useState("")
  const [species, setSpecies] = useState("")
  const [breed, setBreed] = useState("")
  const [behaviorNotes, setBehaviorNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !species) {
      setError("Nombre y especie son obligatorios")
      return
    }

    setLoading(true)
    const { data, error } = await supabase
      .from("pets")
      .insert([{ 
        client_id: params.id, 
        name, 
        species, 
        breed, 
        behavior_notes: behaviorNotes 
      }])
      .select()
      .single()
    setLoading(false)

    if (error) {
      setError("Error al crear la mascota")
      console.log(error)
      return
    }

    router.push(`/clientes/${params.id}`)
  }

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registrar Mascota</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Select onValueChange={(val) => setSpecies(val)} value={species}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona especie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="canino">Canino</SelectItem>
                <SelectItem value="felino">Felino</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Raza (opcional)"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            />

            <Textarea
              placeholder="Notas de comportamiento (opcional)"
              value={behaviorNotes}
              onChange={(e) => setBehaviorNotes(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Mascota"}
            </Button>

            {/* Botón Volver al detalle del cliente */}
            <Button 
              className="mt-4 w-full"
              onClick={() => router.push(`/clientes/${params.id}`)}
            >
              ← Volver al detalle
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}