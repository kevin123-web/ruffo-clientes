"use client"
import { useState } from "react"
import { supabase } from "@/lib/superbase/client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function NewClientPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !phone) {
      setError("Nombre y teléfono son obligatorios")
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from("clients")
      .insert([{ full_name: fullName, phone, email, notes }])
      .select()
      .single()

    setLoading(false)

    if (error) {
      setError("Error al crear cliente")
      console.log(error)
      return
    }

    router.push(`/clientes/${data.id}`)
  }

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registrar Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Nombre completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              placeholder="Teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Textarea
              placeholder="Notas"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cliente"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}