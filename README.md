
# Ruffo App - Mini Módulo Clientes y Mascotas
=============================================

Mini módulo funcional para registro y gestión de clientes y mascotas, desarrollado como prueba técnica.

---

## 🔹 Tecnologías utilizadas
----------------------------

- **Next.js 14+** (App Router)  
- **TypeScript**  
- **Supabase** (Auth + Base de datos)  
- **shadcn/ui** (Table, Card, Input, Button, Textarea)  
- **React Hooks** (`useState`, `useEffect`)  

---

## 🔹 Funcionalidades implementadas
-----------------------------------

### RF-01: Autenticación
- Login con email y contraseña usando **Supabase Auth**.  
- Redirección al login si el usuario no está autenticado.  
- Botón de cerrar sesión.  
- Se creó un **usuario de prueba** directamente en Supabase.  

### RF-02: Listado de Clientes
- Tabla con columnas: Nombre, Teléfono, Cantidad de mascotas, Fecha de registro.  
- Buscador por nombre o teléfono.  
- Botón “Agregar Cliente”.  

### RF-03: Registro de Cliente
- Formulario con campos:
  - Nombre completo (requerido)
  - Teléfono (requerido)
  - Email (opcional)
  - Notas (opcional)
- Validación de campos obligatorios.  
- Al guardar, redirige al detalle del cliente creado.  

### RF-04: Detalle del Cliente y sus Mascotas
- Muestra los datos del cliente.  
- Listado de mascotas asociadas al cliente.  
- Botón para agregar nueva mascota.  

### RF-05: Registro de Mascota
- Formulario con campos:
  - Nombre (requerido)
  - Especie (canino / felino / otro)
  - Raza (opcional)
  - Notas de comportamiento (opcional)
- Al guardar, vuelve al detalle del cliente.  

---

## 🔹 Base de datos, usuario de prueba y variables de entorno
------------------------------------------------------------

```sql
-- Tabla de clientes
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  notes text,
  created_at timestamp with time zone default now()
);

alter table public.clients enable row level security;

-- Tabla de mascotas
create table public.pets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  name text not null,
  species text not null check (species in ('canino','felino','otro')),
  breed text,
  behavior_notes text,
  created_at timestamp with time zone default now()
);

alter table public.pets enable row level security;

-- Policies para usuarios autenticados
create policy "Allow all for authenticated users"
on public.clients
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Allow all for authenticated users"
on public.pets
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

## Usuario de prueba
-- Email: relatoshistorias69@gmail.com
-- Contraseña: mntre14@

-- Variables de entorno (.env.local)
-- NEXT_PUBLIC_SUPABASE_URL=https://iccdxtbycumxyomyfqon.supabase.co
-- NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_6c0lpD54G923i3Tjt84xeA_ICd-FPTC


## 🔹 Despliegue

La aplicación está totalmente funcional en Vercel.

## 🔹 Decisiones técnicas

- Se implementó exactamente lo que pide la prueba (listar, agregar clientes, ver detalle, agregar mascotas).  
- No se incluyó editar o eliminar, ya que no estaba en los requerimientos.  
- Para futuras mejoras, se podrían agregar botones de editar/eliminar clientes y mascotas.  
- Los formularios se implementaron como Client Components con useState para simplicidad.  
- La tabla de clientes incluye un botón individual para ver detalle, mejorando la UX.  

## 🔹 Mejoras en el tiempo

### Estética y UX

- Aplicar colores corporativos de Ruffo App.  
- Mejorar la presentación de la tabla y los formularios.  
- Agregar animaciones y un diseño completamente responsive para móviles y tablets.  

### Validaciones avanzadas en formularios

- Usar react-hook-form con validaciones más completas.  
- Mensajes de error dinámicos y feedback inmediato al usuario.  

### Funcionalidades adicionales

- Editar y eliminar clientes y mascotas directamente desde la tabla o los detalles.  
- Botones de interacción que faciliten la navegación y gestión de clientes y mascotas.  
- Mostrar no solo la cantidad de mascotas de un cliente, sino también sus nombres.  
- Buscador avanzado que permita filtrar por nombre de cliente o de mascota.  

### Gestión de usuarios

- Control de roles (por ejemplo, administrador) que supervise eliminaciones y ediciones.  

### Calidad de código y tests

- Implementar tests unitarios y de integración para asegurar la funcionalidad y seguridad.  

### Escalabilidad futura

- Mejorar la base de datos y las relaciones para soportar más funcionalidades como historial de servicios, seguimiento de mascotas, reportes, etc.