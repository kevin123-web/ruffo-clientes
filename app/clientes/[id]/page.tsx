"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/superbase/client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Pet {
  id: string
  name: string
  species: string
  breed?: string
  behavior_notes?: string
  created_at: string
}

interface Client {
  id: string
  full_name: string
  phone: string
  email?: string
  notes?: string
  created_at: string
  pets?: Pet[]
}

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params?.id) return

    const fetchClient = async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*, pets(*)")
        .eq("id", params.id)
        .single()

      if (error) {
        console.log(error)
        setClient(null)
      } else {
        setClient(data as Client)
      }
      setLoading(false)
    }

    fetchClient()
  }, [params?.id])

  if (loading) return <p className="p-4 text-center">Cargando cliente...</p>
  if (!client) return <p className="p-4 text-center text-red-500">Cliente no encontrado</p>

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl">{client.full_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p><strong>Teléfono:</strong> {client.phone}</p>
          {client.email && <p><strong>Email:</strong> {client.email}</p>}
          {client.notes && <p><strong>Notas:</strong> {client.notes}</p>}

          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Mascotas</h2>
            {client.pets && client.pets.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {client.pets.map((pet) => (
                  <li key={pet.id}>
                    <strong>{pet.name}</strong> ({pet.species})
                    {pet.breed && ` - ${pet.breed}`}
                    {pet.behavior_notes && ` - ${pet.behavior_notes}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay mascotas registradas</p>
            )}
          </div>

          {/* Botón Agregar Mascota */}
          <Button 
            className="mt-4 w-full"
            onClick={() => router.push(`/clientes/${client.id}/nueva-mascota`)}
          >
            Agregar Mascota
          </Button>

          {/* Botón Volver, mismo color */}
          <Button 
            className="mt-4 w-full"
            onClick={() => router.push("/clientes")}
          >
            ← Volver a Clientes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}