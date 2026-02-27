"use client"
import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/superbase/client" 
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Eye, LogOut, Loader2, Plus } from "lucide-react"

export default function ClientList() {
  const [clients, setClients] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  // 1. Función para obtener clientes (solo si hay usuario)
  const fetchClients = useCallback(async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*, pets(id)")
      .or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`)

    if (error) {
      console.error("Error al cargar clientes:", error.message)
    } else {
      setClients(data || [])
    }
  }, [search])

  // 2. Verificación de Seguridad (getUser es la opción más segura)
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      
      if (error || !authUser) {
        // Si no hay usuario o hay error, mandamos al login de inmediato
        router.replace("/login")
      } else {
        setUser(authUser)
        await fetchClients()
        setLoading(false)
      }
    }
    checkAuth()
  }, [router, fetchClients])

  // 3. Escuchar cambios en la búsqueda
  useEffect(() => {
    if (user) fetchClients()
  }, [search, user, fetchClients])

  // 4. Función de Cerrar Sesión
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut() // Remueve el token del navegador
      router.replace("/login")
    } catch (error) {
      console.error("Error al cerrar sesión", error)
    }
  }

  // Pantalla de carga mientras se valida la sesión
  if (loading || !user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-gray-500">Verificando sesión segura...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Encabezado Principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h1>
          <p className="text-gray-500">Bienvenido, {user.email}</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex gap-2 border-red-200 text-red-600 hover:bg-red-50">
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </Button>
      </div>

      {/* Controles de Búsqueda y Acción */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Input
          placeholder="Buscar por nombre o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md shadow-sm"
        />
        <Button onClick={() => router.push("/clientes/nuevo")} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Agregar Cliente
        </Button>
      </div>

      {/* Tabla de Resultados */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableCell className="font-semibold text-gray-700">Nombre Completo</TableCell>
              <TableCell className="font-semibold text-gray-700">Teléfono</TableCell>
              <TableCell className="font-semibold text-gray-700 text-center">N° Mascotas</TableCell>
              <TableCell className="font-semibold text-gray-700">Registro</TableCell>
              <TableCell className="font-semibold text-gray-700 text-right">Detalles</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length > 0 ? (
              clients.map((c) => (
                <TableRow key={c.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">{c.full_name}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {c.pets?.length || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {new Date(c.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/clientes/${c.id}`)}
                      className="hover:text-blue-600"
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-400 italic">
                  No se encontraron clientes con ese criterio de búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
