"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/superbase/client"
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Eye } from "lucide-react"

export default function ClientList() {
  const [clients, setClients] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const router = useRouter()

  const fetchClients = async () => {
    let query = supabase.from("clients").select("*, pets(id)")

    if (search) {
      // Búsqueda por nombre o teléfono
      query = query.or(
        `full_name.ilike.%${search}%,phone.ilike.%${search}%`
      )
    }

    const { data, error } = await query
    if (error) console.log(error)
    else setClients(data || [])
  }

  useEffect(() => {
    fetchClients()
  }, [search])

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Buscar por nombre o teléfono"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => router.push("/clientes/nuevo")}>
          Agregar Cliente
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Cant. Mascotas</TableCell>
            <TableCell>Fecha Registro</TableCell>
            <TableCell>Ver</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((c) => (
            <TableRow key={c.id} className="hover:bg-gray-100 transition-colors">
              <TableCell>{c.full_name}</TableCell>
              <TableCell>{c.phone}</TableCell>
              <TableCell>{c.pets?.length || 0}</TableCell>
              <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/clientes/${c.id}`)}
                >
                  <Eye className="w-5 h-5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}