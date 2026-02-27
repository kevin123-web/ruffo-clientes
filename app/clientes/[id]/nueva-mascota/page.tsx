"use client"
import { useState, useEffect } from "react" // 1. Agregamos useEffect
import { useRouter, useParams } from "next/navigation"
// Ojo: revisa si es 'superbase' o 'supabase' en tu carpeta real, 
// normalmente es 'supabase'
import { supabase } from "@/lib/superbase/client" 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewPetPage() {
  const params = useParams()
  const router = useRouter()
  
  // ESTADO PARA EVITAR EL ERROR DE REMOVECHILD
  const [mounted, setMounted] = useState(false)
  
  const [name, setName] = useState("")
  const [species, setSpecies] = useState("")
  const [breed, setBreed] = useState("")
  const [behaviorNotes, setBehaviorNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 2. Solo marcamos como montado cuando el navegador esté listo
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !species) {
      setError("Nombre y especie son obligatorios")
      return
    }

    setLoading(true)
    const { error: dbError } = await supabase
      .from("pets")
      .insert([{ 
        client_id: params.id, 
        name, 
        species, 
        breed, 
        behavior_notes: behaviorNotes 
      }])
    
    if (dbError) {
      setError("Error al crear la mascota")
      console.error(dbError)
      setLoading(false)
      return
    }

    router.push(`/clientes/${params.id}`)
  }

  // 3. Si no ha montado, no renderizamos el Select para evitar el crash
  if (!mounted) return null 

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

            {/* El Select suele causar el error si se renderiza en el servidor */}
            <Select onValueChange={setSpecies} value={species}>
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

            <Button 
              type="button" // IMPORTANTE: pon type="button" para que no dispare el formulario
              variant="outline"
              className="mt-2 w-full"
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