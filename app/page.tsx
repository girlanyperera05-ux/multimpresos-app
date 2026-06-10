"use client"
import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Users,
  DollarSign,
  Package,
  Truck,
  Receipt
} from "lucide-react"

import { supabase } from "@/app/lib/supabase"
export default function Home() {
const [clientes, setClientes] = useState<any[]>([])
const [productos, setProductos] = useState<any[]>([])
const [clienteSeleccionado, setClienteSeleccionado] = useState("")
const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null)
const [monto, setMonto] = useState("")
const [anticipo, setAnticipo] = useState("")
const [requiereFactura, setRequiereFactura] = useState(false)
const [tipoCliente, setTipoCliente] = useState("NV")
const [estadoPago, setEstadoPago] = useState("Pendiente")
const [observaciones, setObservaciones] = useState("")
const [vista, setVista] = useState("dashboard")
const [ventas, setVentas] = useState<any[]>([])
const [proveedores, setProveedores] = useState<any[]>([])
const [nombreProveedor, setNombreProveedor] = useState("")
const [telefonoProveedor, setTelefonoProveedor] = useState("")
const [serviciosProveedor, setServiciosProveedor] = useState("")
const [correoProveedor, setCorreoProveedor] = useState("")
const [ubicacionProveedor, setUbicacionProveedor] = useState("")
const [observacionesProveedor, setObservacionesProveedor] = useState("")
const [proveedorEditando, setProveedorEditando] = useState<string | null>(null)
const [nombreCliente, setNombreCliente] = useState("")
const [telefonoCliente, setTelefonoCliente] = useState("")
const saldo =
  Number(monto || 0) - Number(anticipo || 0)
const [ventaEditando, setVentaEditando] =
  useState<string | null>(null)
  const [anticipoEditado, setAnticipoEditado] =
  useState("")
const [estadoPagoEditado, setEstadoPagoEditado] =
  useState("Pendiente")
 
const [facturaEditada, setFacturaEditada] =
  useState(false)
const [clienteEditando, setClienteEditando] =
  useState<string | null>(null)
const [nombreEditado, setNombreEditado] =
  useState("")

const [telefonoEditado, setTelefonoEditado] =
  useState("")

const [giroEditado, setGiroEditado] =
  useState("")

const [direccionEditada, setDireccionEditada] =
  useState("")

const [tipoClienteEditado, setTipoClienteEditado] =
  useState("NV")
const [nombreOriginal, setNombreOriginal] =
  useState("")

const [proveedoresProducto, setProveedoresProducto] = useState<any[]>([])


const [nuevoProducto, setNuevoProducto] = useState("")
const [nuevoPrecio, setNuevoPrecio] = useState("")
const [nuevaObservacion, setNuevaObservacion] = useState("")

const [proveedorSeleccionado, setProveedorSeleccionado] =
  useState("")
const [productoVenta, setProductoVenta] = useState("")


useEffect(() => {
  cargarDatos()
}, [])

async function cargarDatos() {
  const { data: clientesData } = await supabase
    .from("Clientes")
    .select("*")

  const { data: productosData } = await supabase
    .from("Productos")
    .select("*")

  const { data: proveedoresData } = await supabase
.from("Proveedores")
.select("*")

  const { data: ventasData, error: ventasError } = await supabase
  .from("Ventas")
  .select("*")
  .order("Fecha", { ascending: false })

console.log("VENTAS RECARGADAS:", ventasData)
console.log("ERROR VENTAS:", ventasError)
console.log("VENTAS:", ventasData)

  setClientes(clientesData || [])
  setProductos(productosData || [])
  setVentas(ventasData || [])
  setProveedores(proveedoresData || [])

  console.log("VENTAS GUARDADAS EN STATE:", ventasData)
  
}
const ventasDelMes = ventas.reduce(
  (acc, venta) => acc + Number(venta.Total || 0),
  0
)

const pedidosDelMes = ventas.length

const cobradoDelMes = ventas
  .filter((venta) => venta.Estado_pago === "Pagado")
  .reduce(
    (acc, venta) => acc + Number(venta.Total || 0),
    0
  )

const trabajosActivos = ventas.filter(
  (venta) => venta.Estado_pedido !== "Terminado"
).length


async function guardarCliente(id: string) {

  const { error } = await supabase
    .from("Clientes")
    .update({
      Nombre: nombreEditado,
      Telefono: telefonoEditado,
      Giro: giroEditado,
      Direccion: direccionEditada,
      Tipo_cliente: tipoClienteEditado
    })
    .eq("id", id)

  if (error) {
    console.log(error)
    return
  }

  const { error: errorVentas } = await supabase
    .from("Ventas")
    .update({
      Cliente_nombre: nombreEditado,
      Giro: giroEditado,
      Tipo_cliente: tipoClienteEditado
    })
    .eq("Cliente_nombre", nombreOriginal)

  if (errorVentas) {
    console.log(errorVentas)
  }

  setClienteEditando(null)

  cargarDatos()
}
function editarCliente(cliente: any) {

  console.log("EDITANDO CLIENTE")

  setClienteEditando(cliente.id)

  setNombreOriginal(
    cliente.Nombre || ""
  )

  setNombreEditado(
    cliente.Nombre || ""
  )

  setTelefonoEditado(
    cliente.Telefono || ""
  )

  setGiroEditado(
    cliente.Giro || ""
  )

  setDireccionEditada(
    cliente.Direccion || ""
  )

  setTipoClienteEditado(
    cliente.Tipo_cliente || "NV"
  )
}

async function eliminarCliente(id: string) {

  const confirmar = confirm(
    "¿Eliminar este cliente?"
  )

  if (!confirmar) return

  const { error } = await supabase
    .from("Clientes")
    .delete()
    .eq("id", id)

  if (error) {
    console.log(error)
    return
  }

  cargarDatos()
}

async function guardarVenta() {

  let clienteId = clienteSeleccionado
let clienteNombre = ""

if (clienteSeleccionado === "nuevo") {

  if (!nombreCliente) {
    alert("Ingresa el nombre del cliente")
    return
  }

  const { data: nuevoCliente, error: errorCliente } =
    await supabase
      .from("Clientes")
      .insert([
        {
          Nombre: nombreCliente,
          Telefono: telefonoCliente
        }
      ])
      .select()
      .single()

  if (errorCliente) {
    alert(JSON.stringify(errorCliente))
    return
  }

  clienteId = nuevoCliente.id
  clienteNombre = nuevoCliente.Nombre

} else {

  const cliente = clientes.find(
    (c) => c.id === Number(clienteSeleccionado)
  )

  clienteNombre = cliente?.Nombre || ""
}

  const producto = productos.find(
    (p) => p.id === Number(productoSeleccionado)
  )

 console.log("CLIENTE:", clienteSeleccionado)
 console.log("PRODUCTO:", productoSeleccionado)
 console.log("PRODUCTO SELECCIONADO:", productoSeleccionado)
 console.log("PRODUCTO ENCONTRADO:", producto)
 console.log("TODOS LOS PRODUCTOS:", productos)

 const { error } = await supabase
  .from("Ventas")
    .insert([
      {
        Cliente_id: clienteId,
      Cliente_nombre: clienteNombre,
      Producto_nombre: producto?.Nombre,

      Total: Number(monto),
      Anticipo: Number(anticipo),
      Saldo: Number(monto) - Number(anticipo),

      Estado_pago: estadoPago,
      Estado_pedido: "Por hacer",

      Tipo_cliente: tipoCliente,
      Requiere_factura: requiereFactura,

      Observaciones: observaciones
      }
    ])

  if (error) {
   alert(JSON.stringify(error))
   console.log(error)
   console.log("STATE VENTAS:", ventas)
   return
  }

  alert("Venta guardada correctamente")
  cargarDatos()
}
async function guardarProveedor() {
  const { error } = await supabase
    .from("Proveedores")
    .insert([
      {
        Nombre: nombreProveedor,
        Telefono: telefonoProveedor,
        Servicios: serviciosProveedor,
        Correo: correoProveedor,
        Ubicacion: ubicacionProveedor,
        Observaciones: observacionesProveedor,
      },
    ])

  if (error) {
    alert(JSON.stringify(error))
    return
  }

  alert("Proveedor guardado correctamente")

  setNombreProveedor("")
  setTelefonoProveedor("")
  setServiciosProveedor("")
  setCorreoProveedor("")
  setUbicacionProveedor("")
  setObservacionesProveedor("")

  cargarDatos()
}  

async function actualizarProveedor() {
  const { error } = await supabase
    .from("Proveedores")
    .update({
      Nombre: nombreProveedor,
      Telefono: telefonoProveedor,
      Servicios: serviciosProveedor,
      Correo: correoProveedor,
      Ubicacion: ubicacionProveedor,
      Observaciones: observacionesProveedor,
    })
    .eq("id", proveedorEditando)

  if (error) {
    alert(JSON.stringify(error))
    return
  }

  alert("Proveedor actualizado")

  setProveedorEditando(null)

  setNombreProveedor("")
  setTelefonoProveedor("")
  setServiciosProveedor("")
  setCorreoProveedor("")
  setUbicacionProveedor("")
  setObservacionesProveedor("")

  cargarDatos()
}

async function eliminarProveedor(id: string) {
  const confirmar = confirm(
    "¿Seguro que deseas eliminar este proveedor?"
  )

  if (!confirmar) return

  const { error } = await supabase
    .from("Proveedores")
    .delete()
    .eq("id", id)

  if (error) {
    alert(JSON.stringify(error))
    return
  }

  alert("Proveedor eliminado")

  cargarDatos()
}

function editarVenta(venta: any) {

  setVentaEditando(venta.id)

  setAnticipoEditado(
    String(venta.Anticipo || 0)
  )

  setEstadoPagoEditado(
  venta.Estado_pago || "Pendiente"
  )

  setGiroEditado(
  venta.Giro || ""
  )

  setFacturaEditada(
  venta.Requiere_factura || false
  )
}

async function eliminarVenta(id: string) {
  const confirmar = confirm(
    "¿Seguro que deseas eliminar esta venta?"
  )

  if (!confirmar) return

  const { error } = await supabase
    .from("Ventas")
    .delete()
    .eq("id", id)

  if (error) {
    alert(JSON.stringify(error))
    return
  }

  await cargarDatos()

  alert("Venta eliminada")
}

async function guardarEdicionVenta(
  id: string,
  total: number
) {

  const nuevoSaldo =
    total - Number(anticipoEditado)

  const { error } = await supabase
    .from("Ventas")
    .update({
  Anticipo: Number(anticipoEditado),
  Saldo: nuevoSaldo,
  Estado_pago: estadoPagoEditado,
  Giro: giroEditado,
  Requiere_factura: facturaEditada
})
    .eq("id", id)

  if (error) {
    alert(JSON.stringify(error))
    return
  }

  setVentaEditando(null)

  await cargarDatos()
}


async function actualizarEstado(
  id: string,
  nuevoEstado: string
) {

  const { error } = await supabase
    .from("Ventas")
    .update({
      Estado_pedido: nuevoEstado
    })
    .eq("id", id)

  if (error) {
    console.log(error)
    return
  }

  await cargarDatos()

}
  
async function actualizarProveedorVenta(
  id: string,
  proveedor: string
) {

  const { error } = await supabase
    .from("Ventas")
    .update({
      Proveedor: proveedor
    })
    .eq("id", id)

  if (error) {
    console.log(error)
    return
  }

  await cargarDatos()

}

async function cargarProductos() {

  const { data, error } = await supabase
    .from("Productos")
    .select("*")
    .order("Nombre")

  if (error) {
    console.log(error)
    return
  }

  setProductos(data || [])
}

async function cargarProveedores() {

  const { data, error } = await supabase
    .from("Proveedores")
    .select("*")
    .order("Nombre")

  if (error) {
    console.log(error)
    return
  }

  setProveedores(data || [])
}

async function cargarProveedoresProducto(
  productoId: number
) {

  const { data, error } = await supabase
    .from("Producto_Proveedor")
    .select("*")
    .eq("Producto_id", productoId)

  if (error) {
    console.log(error)
    return
  }

  setProveedoresProducto(data || [])
}

async function agregarProducto() {

  if (!nuevoProducto) return

  const { error } = await supabase
    .from("Productos")
    .insert([
      {
        Nombre: nuevoProducto
      }
    ])

  if (error) {
    console.log(error)
    return
  }

  setNuevoProducto("")

  cargarProductos()
}

async function agregarProveedorProducto() {

  if (!productoSeleccionado) return

  if (!proveedorSeleccionado) return

  const { error } = await supabase
    .from("Producto_Proveedor")
    .insert([
      {
        Producto_id: productoSeleccionado.id,
        Proveedor_id: proveedorSeleccionado,
        Precio: Number(nuevoPrecio),
        Observacion: nuevaObservacion
      }
    ])

  if (error) {
    console.log(error)
    return
  }

  setNuevoPrecio("")
  setNuevaObservacion("")
  setProveedorSeleccionado("")

  cargarProveedoresProducto(
    productoSeleccionado.id
  )
}


  return (
    <main className="flex min-h-screen bg-[#0f1117] text-white">

      {/* Sidebar */}
      <aside className="w-72 bg-[#111827] border-r border-gray-800 p-6">

        <h1 className="text-3xl font-bold mb-10 text-cyan-400">
          Multimpresos
        </h1>

        <nav className="space-y-3">

          <div
            onClick={() => setVista("dashboard")}
            className="flex items-center gap-3 bg-cyan-500/20 text-cyan-400 p-3 rounded-xl cursor-pointer"
          >
           <LayoutDashboard size={20} />
           <span>Dashboard</span>
          </div>

          <div
           onClick={() => setVista("historial")}
           className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer"
          >
           <ShoppingCart size={20} />
           <span>Historial</span>
          </div>

          <div
            onClick={() => setVista("produccion")}
           className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer"
          >
           <ClipboardList size={20} />
           <span>Producción</span>
          </div>

          <div
           onClick={() => setVista("clientes")}
           className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer"
          >
           <Users size={20} />
           <span>Clientes</span>
          </div>

          <div
           onClick={() => setVista("productos")}
           className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer"
          >
           <Package size={20} />
           <span>Productos</span>
          </div>

          <div
           onClick={() => setVista("proveedores")}
           className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer"
          >
           <Truck size={20} />
           <span>Proveedores</span>
          </div>
          
          <div
            onClick={() => setVista("gastos")}
           className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer"
         >
            <Receipt size={20} />
           <span>Gastos</span>
          </div>
        </nav>

      </aside>

      {/* Main */}
      <section className="flex-1 p-8">

       {vista === "dashboard" && (
       <>

        <div className="flex items-center justify-between mb-10">

          <div>
            <h2 className="text-4xl font-bold">
              Ventas del día
            </h2>

            <p className="text-gray-400 mt-2">
              Bienvenido de nuevo 👋
            </p>
          </div>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-6 mb-10">

          <div className="bg-[#1a1d26] p-6 rounded-2xl border border-gray-800">
            <p className="text-gray-400 mb-3">
              Ventas del mes
            </p>

            <div className="flex items-center gap-3">
              <DollarSign className="text-cyan-400" />
              <h3 className="text-3xl font-bold">
               {"$" + ventasDelMes.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="bg-[#1a1d26] p-6 rounded-2xl border border-gray-800">
            <p className="text-gray-400 mb-3">
              Pedidos del mes
            </p>

            <h3 className="text-3xl font-bold">
             {pedidosDelMes}
            </h3>
          </div>

          <div className="bg-[#1a1d26] p-6 rounded-2xl border border-gray-800">
            <p className="text-gray-400 mb-3">
              Trabajos activos
            </p>

            <h3 className="text-3xl font-bold">
              {trabajosActivos}
            </h3>
          </div>

        </div>

        {/* Formulario */}
        <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="bg-[#1a1d26] border border-gray-800 rounded-2xl p-8">
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
            🔷 Nueva venta 💙
         </h3>
<div className="space-y-4">

  <div className="grid grid-cols-2 gap-4 mb-4">

  <div>
    <label className="block text-sm text-gray-300 mb-2">
      Cliente
    </label>

    <select
      value={clienteSeleccionado}
      onChange={(e) =>
        setClienteSeleccionado(e.target.value)
      }
      className="w-full bg-[#111827] border border-gray-700 rounded-xl p-4"
    >
      <option value="">
        Cliente
      </option>

      <option value="nuevo">
        + Agregar nuevo cliente
      </option>

      {clientes?.map((cliente) => (
        <option
          key={cliente.id}
          value={cliente.id}
        >
          {cliente.Nombre}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label className="block text-sm text-gray-300 mb-2">
      Tipo de cliente
    </label>

    <select
      value={tipoCliente}
      onChange={(e) =>
        setTipoCliente(e.target.value)
      }
      className="w-full bg-[#111827] border border-gray-700 rounded-xl p-4"
    >
      <option value="NV">
        NV - Nuevo
      </option>

      <option value="RF">
        RF - Referido
      </option>

      <option value="C">
        C - Cliente frecuente
      </option>
    </select>
  </div>

</div>

  

<div className="grid grid-cols-2 gap-4 mb-2">
  <label className="text-sm text-gray-300">
    Nombre del cliente
  </label>

  <label className="text-sm text-gray-300">
    Teléfono
  </label>
</div>

<div className="grid grid-cols-2 gap-4 mb-4">

  <input
    value={nombreCliente}
    onChange={(e) => setNombreCliente(e.target.value)}
    placeholder="Nombre del cliente"
    className="bg-[#111827] border border-gray-700 rounded-xl p-4"
  />

  <input
    value={telefonoCliente}
    onChange={(e) => setTelefonoCliente(e.target.value)}
    placeholder="Número de teléfono"
    className="bg-[#111827] border border-gray-700 rounded-xl p-4"
  />

</div>

<div className="grid grid-cols-2 gap-4 mb-2">

  <label className="text-sm text-gray-300">
    Producto
  </label>

  <label className="text-sm text-gray-300">
    Total
  </label>

</div>

<div className="grid grid-cols-2 gap-4 mb-4">

  <select
    value={productoVenta}
    onChange={(e) =>
      setProductoSeleccionado(e.target.value)
    }
    className="bg-[#111827] border border-gray-700 rounded-xl p-4"
  >
    <option value="">
      Seleccionar Producto
    </option>

    {productos?.map((producto) => (
      <option
        key={producto.id}
        value={producto.id}
      >
        {producto.Nombre}
      </option>
    ))}
  </select>

  <input
    value={monto}
    onChange={(e) => setMonto(e.target.value)}
    placeholder="$ 0.00"
    className="bg-[#111827] border border-gray-700 rounded-xl p-4"
  />

</div>

<div className="grid grid-cols-2 gap-4 mb-2">

  <label className="text-sm text-gray-300">
    Anticipo
  </label>

  <label className="text-sm text-gray-300">
    Saldo pendiente
  </label>

</div>

<div className="grid grid-cols-2 gap-4 mb-4">

  <input
    value={anticipo}
    onChange={(e) =>
      setAnticipo(e.target.value)
    }
    placeholder="$ 0.00"
    className="bg-[#111827] border border-gray-700 rounded-xl p-4"
  />

  <input
    value={`$${saldo}`}
    readOnly
    className="bg-[#0f172a] border border-cyan-700 rounded-xl p-4 text-cyan-400 font-bold"
  />

</div>

<div className="grid grid-cols-2 gap-4 mb-4">

  <div>
    <label className="block text-sm text-gray-300 mb-2">
      Estado de pago
    </label>

    <select
      value={estadoPago}
      onChange={(e) =>
        setEstadoPago(e.target.value)
      }
      className="w-full bg-[#111827] border border-gray-700 rounded-xl p-4"
    >
      <option value="Pendiente">
        Pendiente
      </option>

      <option value="Parcial">
        Parcial
      </option>

      <option value="Pagado">
        Pagado
      </option>
    </select>
  </div>

  <div>
    <label className="block text-sm text-gray-300 mb-2">
      Factura
    </label>

    <div className="h-[56px] flex items-center px-4 border border-gray-700 rounded-xl bg-[#111827]">
      <input
        type="checkbox"
        checked={requiereFactura}
        onChange={(e) =>
          setRequiereFactura(e.target.checked)
        }
      />

      <span className="ml-2 text-gray-300">
        Requiere factura
      </span>
    </div>
  </div>

</div>

<textarea
  value={observaciones}
  onChange={(e) => setObservaciones(e.target.value)}
  placeholder="Observaciones..."
  className="bg-[#111827] border border-gray-700 rounded-xl p-4 outline-none w-full h-32 mb-4"
></textarea>

<button
  onClick={guardarVenta}
  className="bg-cyan-500 hover:bg-cyan-400 transition text-black font-bold px-8 py-4 rounded-xl shadow-lg"
>
  Guardar venta
</button> 

</div>
</div>

<div className="bg-[#1a1d26] border border-gray-800 rounded-2xl p-8">
  

  <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
  📋 Trabajos activos
  </h3> 

<div className="grid grid-cols-4 text-gray-400 text-sm mb-3 pb-2 border-b border-gray-800">

  <div className="font-semibold">Cliente</div>
  <div className="font-semibold">Producto</div>
  <div className="font-semibold">Estado</div>
  <div className="font-semibold">Total</div>

</div>

  <div className="space-y-0">

    {ventas.slice(0, 8).map((venta) => (

     <div
  key={venta.id}
  className="grid grid-cols-4 items-center border-b border-gray-800 py-8"
>

  <div className="flex items-center gap-3">

  <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold">
    {venta.Cliente_nombre?.charAt(0).toUpperCase()}
  </div>

  <p className="font-bold text-lg">
    {venta.Cliente_nombre}
  </p>

 </div>

  <div>
    <p className="font-bold text-lg">
      {venta.Producto_nombre}
    </p>
  </div>

  <div>
    <span
      className={`px-4 py-2 rounded-full text-base font-bold ${
        venta.Estado_pedido === "Diseño"
          ? "bg-yellow-500/20 text-yellow-300"
          : venta.Estado_pedido === "A imprenta"
          ? "bg-cyan-500/20 text-cyan-300"
          : venta.Estado_pedido === "Producción"
          ? "bg-purple-500/20 text-purple-300"
          : venta.Estado_pedido === "Terminado"
          ? "bg-green-500/20 text-green-300"
          : "bg-gray-500/20 text-gray-300"
      }`}
    >
      {venta.Estado_pedido}
    </span>
  </div>

  <div className="font-bold text-cyan-400">
  ${venta.Total}
</div>

</div> 

    ))}

  </div>

</div>  
</div>       
</>
        
)}
 {vista === "historial" && (
  <div>
    <h1 className="text-4xl font-bold mb-8">
      Historial de ventas
    </h1>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700 text-left">
          <th className="p-4">Fecha</th>
          <th className="p-4">Tipo</th>
         <th className="p-4">Cliente</th>
         <th className="p-4">Giro</th>
         <th className="p-4">Producto</th>
         <th className="p-4">Total</th>
         <th className="p-4">Anticipo</th>
         <th className="p-4">Saldo</th>
         <th className="p-4">Pago</th>
         <th className="p-4">Factura</th>
         <th className="p-4">Acciones</th>
        </tr>
        </thead>

        <tbody>
          {ventas.map((venta) => (
            <tr
              key={venta.id}
              className="border-b border-gray-800"
            >
              <td className="p-4">
               {new Date(
                venta.Fecha
               ).toLocaleDateString()}
              </td>

              <td className="p-4">
  {venta.Tipo_cliente}
</td>

<td className="p-4">
  {venta.Cliente_nombre}
</td>

<td className="p-4">

  {ventaEditando === venta.id ? (

    <input
      value={giroEditado}
      onChange={(e) =>
        setGiroEditado(e.target.value)
      }
      className="bg-[#111827] border border-gray-700 rounded px-2 py-1 w-32"
      placeholder="Giro"
    />

  ) : (

    venta.Giro

  )}

</td>

<td className="p-4">
  {venta.Producto_nombre}
</td>

<td className="p-4">
  ${venta.Total}
</td>

<td className="p-4">
  {ventaEditando === venta.id ? (

    <input
      value={anticipoEditado}
      onChange={(e) =>
        setAnticipoEditado(e.target.value)
      }
      className="bg-[#111827] border border-gray-700 rounded px-2 py-1 w-24"
    />

  ) : (

    <span className="text-cyan-400">
      ${venta.Anticipo || 0}
    </span>

  )}
</td>

<td className="p-4 text-yellow-400">
  ${venta.Saldo || 0}
</td>

<td className="p-4">

  {ventaEditando === venta.id ? (

    <select
      value={estadoPagoEditado}
      onChange={(e) =>
        setEstadoPagoEditado(
          e.target.value
        )
      }
      className="bg-[#111827] border border-gray-700 rounded px-2 py-1"
    >
      <option value="Pendiente">
        Pendiente
      </option>

      <option value="Parcial">
        Parcial
      </option>

      <option value="Pagado">
        Pagado
      </option>
    </select>

  ) : (

    venta.Estado_pago

  )}

</td>

<td className="p-4 text-center">

  {ventaEditando === venta.id ? (

    <input
      type="checkbox"
      checked={facturaEditada}
      onChange={(e) =>
        setFacturaEditada(
          e.target.checked
        )
      }
    />

  ) : (

    venta.Requiere_factura
      ? "✔"
      : "—"

  )}

</td>

<td className="p-4 flex gap-2">

  {ventaEditando === venta.id ? (

    <>
      <button
        onClick={() =>
          guardarEdicionVenta(
           venta.id,
           Number(venta.Total)
          )
        }
        className="bg-green-600 px-3 py-1 rounded"
      >
        💾
      </button>

      <button
        onClick={() =>
          setVentaEditando(null)
        }
        className="bg-gray-600 px-3 py-1 rounded"
      >
        ❌
      </button>
    </>

  ) : (

    <>
      <button
        onClick={() => editarVenta(venta)}
        className="bg-blue-600 px-3 py-1 rounded"
      >
        ✏️
      </button>

      <button
        onClick={() =>
          eliminarVenta(venta.id)
        }
        className="bg-red-600 px-3 py-1 rounded"
      >
        🗑️
      </button>
    </>

  )}

</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

{vista === "produccion" && (
  <div>
    <h1 className="text-4xl font-bold mb-8">
      Producción
    </h1>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700 text-left">
            <th className="p-4">Cliente</th>
            <th className="p-4">Producto</th>
            <th className="p-4">Observaciones</th>
            <th className="p-4">Estado</th>
            <th className="p-4">Proveedor</th>
          </tr>
        </thead>

        <tbody>
          {ventas.map((venta) => (
            <tr
              key={venta.id}
              className="border-b border-gray-800"
            >
              <td className="p-4">
                {venta.Cliente_nombre}
              </td>

              <td className="p-4">
                {venta.Producto_nombre}
              </td>

              <td className="p-4">
                {venta.Observaciones}
              </td>

              <td className="p-4">
              <select
                value={venta.Estado_pedido}
               onChange={(e) => {
               console.log("ID:", venta.id)
               console.log("ESTADO NUEVO:", e.target.value)

               actualizarEstado(
                venta.id,
                e.target.value
             )
           }}
                className="bg-[#111827] border border-gray-700 rounded-lg px-3 py-1"
             >
               <option>Por hacer</option>
               <option>Diseño</option>
               <option>Aprobado</option>
               <option>A imprenta</option>
               <option>En producción</option>
               <option>Por recoger</option>
               <option>Listo para entrega</option>
               <option>Entregado</option>
             </select>

             </td>

              <td className="p-4">

  <select
    value={venta.Proveedor || ""}
    onChange={(e) =>
      actualizarProveedorVenta(
        venta.id,
        e.target.value
      )
    }
    className="bg-[#111827] border border-gray-700 rounded-lg px-3 py-1"
  >

    <option value="">
      Seleccionar proveedor
    </option>

    {proveedores.map((proveedor) => (
      <option
        key={proveedor.id}
        value={proveedor.Nombre}
      >
        {proveedor.Nombre}
      </option>
    ))}

  </select>

</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

{vista === "proveedores" && (
  <div>
    <h1 className="text-4xl font-bold mb-8">
      Proveedores
    </h1>

    <div className="bg-[#111827] p-6 rounded-xl mb-8">

      <input
        placeholder="Nombre"
        value={nombreProveedor}
        onChange={(e) => setNombreProveedor(e.target.value)}
        className="w-full p-3 mb-3 bg-[#0f172a] rounded"
      />

      <input
        placeholder="Teléfono"
        value={telefonoProveedor}
        onChange={(e) => setTelefonoProveedor(e.target.value)}
        className="w-full p-3 mb-3 bg-[#0f172a] rounded"
      />

      <textarea
        placeholder="Servicios (uno por línea)"
        value={serviciosProveedor}
        onChange={(e) => setServiciosProveedor(e.target.value)}
        className="w-full p-3 mb-3 bg-[#0f172a] rounded"
      />

      <input
        placeholder="Correo"
        value={correoProveedor}
        onChange={(e) => setCorreoProveedor(e.target.value)}
        className="w-full p-3 mb-3 bg-[#0f172a] rounded"
      />

      <input
        placeholder="Ubicación"
        value={ubicacionProveedor}
        onChange={(e) => setUbicacionProveedor(e.target.value)}
        className="w-full p-3 mb-3 bg-[#0f172a] rounded"
      />

      <textarea
        placeholder="Observaciones"
        value={observacionesProveedor}
        onChange={(e) => setObservacionesProveedor(e.target.value)}
        className="w-full p-3 mb-3 bg-[#0f172a] rounded"
      />

     <button
      onClick={() => {
        if (proveedorEditando) {
         actualizarProveedor()
        } else {
         guardarProveedor()
        }
     }}
      className="bg-cyan-500 px-6 py-3 rounded-lg"
      >
        {proveedorEditando
         ? "Actualizar proveedor"
         : "Guardar proveedor"}
      </button>
      <h2 className="text-2xl font-bold mt-10 mb-4">
  Lista de proveedores
</h2>

<div className="overflow-x-auto">
  <table className="w-full">
    <thead>
      <tr className="border-b border-gray-700">
        <th className="p-3 text-left">Nombre</th>
        <th className="p-3 text-left">Teléfono</th>
        <th className="p-3 text-left">Servicios</th>
        <th className="p-3 text-left">Correo</th>
        <th className="p-3 text-left">Ubicación</th>
        <th className="p-3 text-left">Acciones</th>
      </tr>
    </thead>

    <tbody>
      {proveedores.map((proveedor) => (
        <tr
          key={proveedor.id}
          className="border-b border-gray-800"
        >
          <td className="p-3">{proveedor.Nombre}</td>
          <td className="p-3">{proveedor.Telefono}</td>

          <td className="p-3 whitespace-pre-line">
            {proveedor.Servicios}
          </td>

          <td className="p-3">{proveedor.Correo}</td>

          <td className="p-3">
            {proveedor.Ubicacion}
          </td>
          
          <td className="p-3 flex gap-2">
            
          <button
            onClick={() => {
             setProveedorEditando(proveedor.id)

             setNombreProveedor(proveedor.Nombre)
             setTelefonoProveedor(proveedor.Telefono)
             setServiciosProveedor(proveedor.Servicios)
             setCorreoProveedor(proveedor.Correo)
             setUbicacionProveedor(proveedor.Ubicacion)
             setObservacionesProveedor(proveedor.Observaciones)
           }}
           className="bg-yellow-500 px-3 py-1 rounded"
          >
           ✏️
          </button>


          <button
           onClick={() => eliminarProveedor(proveedor.id)}
           className="bg-red-600 px-3 py-1 rounded"
          >
           🗑
          </button>

         </td>

        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  </div>
)}

{vista === "clientes" && (
  <div>
    <h1 className="text-4xl font-bold mb-8">
      Clientes
    </h1>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700 text-left">

            <th className="p-4">Tipo</th>
            <th className="p-4">Cliente</th>
            <th className="p-4">Teléfono</th>
            <th className="p-4">Giro</th>
            <th className="p-4">Dirección</th>
            <th className="p-4">Acciones</th>

          </tr>
        </thead>

        <tbody>

          {clientes.map((cliente) => (

            <tr
              key={cliente.id}
              className="border-b border-gray-800"
            >

              <td className="p-4">

  {clienteEditando === cliente.id ? (

    <select
      value={tipoClienteEditado}
      onChange={(e) =>
        setTipoClienteEditado(
          e.target.value
        )
      }
      className="bg-[#111827] border border-gray-700 rounded px-2 py-1"
    >
      <option value="NV">NV</option>
      <option value="RF">RF</option>
      <option value="C">C</option>
    </select>

  ) : (

    <span className="bg-cyan-500 text-black px-3 py-1 rounded-lg font-bold">
      {cliente.Tipo_cliente || "NV"}
    </span>

  )}

</td>

              <td className="p-4">

  {clienteEditando === cliente.id ? (

    <input
      value={nombreEditado}
      onChange={(e) =>
        setNombreEditado(e.target.value)
      }
      className="bg-[#111827] border border-gray-700 rounded px-2 py-1 w-full"
    />

  ) : (

    cliente.Nombre

  )}

</td>

              <td className="p-4">

  {clienteEditando === cliente.id ? (

    <input
      value={telefonoEditado}
      onChange={(e) =>
        setTelefonoEditado(e.target.value)
      }
      className="bg-[#111827] border border-gray-700 rounded px-2 py-1 w-full"
    />

  ) : (

    cliente.Telefono

  )}

</td>

              <td className="p-4">

  {clienteEditando === cliente.id ? (

    <input
      value={giroEditado}
      onChange={(e) =>
        setGiroEditado(e.target.value)
      }
      className="bg-[#111827] border border-gray-700 rounded px-2 py-1 w-full"
    />

  ) : (

    cliente.Giro || "-"

  )}

</td>

              <td className="p-4">

  {clienteEditando === cliente.id ? (

    <input
      value={direccionEditada}
      onChange={(e) =>
        setDireccionEditada(e.target.value)
      }
      className="bg-[#111827] border border-gray-700 rounded px-2 py-1 w-full"
    />

  ) : (

    cliente.Direccion || "-"

  )}

</td>

 <td className="p-4 flex gap-2">

  {clienteEditando === cliente.id ? (

    <>
      <button
        onClick={() =>
          guardarCliente(cliente.id)
        }
        className="bg-green-600 px-3 py-1 rounded"
      >
        💾
      </button>

      <button
        onClick={() =>
          setClienteEditando(null)
        }
        className="bg-gray-600 px-3 py-1 rounded"
      >
        ❌
      </button>
    </>

  ) : (

    <>
      <button
        onClick={() =>
          editarCliente(cliente)
        }
        className="bg-blue-600 px-3 py-1 rounded"
      >
        ✏️
      </button>

      <button
        onClick={() =>
          eliminarCliente(cliente.id)
        }
        className="bg-red-600 px-3 py-1 rounded"
      >
        🗑️
      </button>
    </>

  )}

</td>             

            </tr>

          ))}

        </tbody>
      </table>
    </div>
  </div>
)}

{vista === "productos" && (

<div className="grid grid-cols-2 gap-6 mt-6">

  <div className="bg-[#0f172a] p-6 rounded-xl">

    <h2 className="text-2xl font-bold mb-4">
      Productos
    </h2>

    <div className="flex gap-2 mb-4">

      <input
        value={nuevoProducto}
        onChange={(e) =>
          setNuevoProducto(e.target.value)
        }
        placeholder="Nuevo producto"
        className="bg-black border border-gray-700 p-2 rounded flex-1"
      />

      <button
        onClick={agregarProducto}
        className="bg-cyan-500 text-black px-4 rounded"
      >
        +
      </button>

    </div>

    <div className="space-y-2">

      {productos.map((producto) => (

        <div
          key={producto.id}
          onClick={() => {

            setProductoSeleccionado(producto)

            cargarProveedoresProducto(
              producto.id
            )

          }}
          className="p-3 rounded bg-[#1e293b] cursor-pointer hover:bg-gray-900"
        >

          {producto.Nombre}

        </div>

      ))}

    </div>

  </div>

  <div className="bg-[#0f172a] p-6 rounded-xl">

    <h2 className="text-2xl font-bold mb-4">

      {productoSeleccionado
        ? `Proveedores de ${productoSeleccionado.Nombre}`
        : "Selecciona un producto"}

    </h2>

    {productoSeleccionado && (

      <>

        <div className="flex gap-2 mb-4">

          <select
            value={proveedorSeleccionado}
            onChange={(e) =>
              setProveedorSeleccionado(
                e.target.value
              )
            }
            className="bg-black border border-gray-700 p-2 rounded flex-1"
          >

            <option value="">
              Seleccionar proveedor
            </option>

            {proveedores.map((p) => (

              <option
                key={p.id}
                value={p.id}
              >
                {p.Nombre}
              </option>

            ))}

          </select>

          <input
            type="number"
            value={nuevoPrecio}
            onChange={(e) =>
              setNuevoPrecio(e.target.value)
            }
            placeholder="Precio"
            className="bg-black border border-gray-700 p-2 rounded w-32"
          />
          
          <input
           value={nuevaObservacion}
           onChange={(e) =>
             setNuevaObservacion(e.target.value)
           }
            placeholder="Observación"
           className="bg-[#111827] border border-gray-700 rounded-xl p-3"
          />

          <button
            onClick={agregarProveedorProducto}
            className="bg-green-600 px-4 rounded"
          >
            +
          </button>

        </div>

        <div className="space-y-2">

          {proveedoresProducto.map((item) => (

            <div
              key={item.id}
              className="bg-black p-3 rounded flex justify-between"
            >

              <span>
                {item.Proveedor_id}
              </span>

              <span>
                ${item.Precio}
              </span>

              <div className="text-gray-400 text-sm mt-2">
               {item.Observacion}
            </div>
            </div>

          ))}

        </div>

      </>

    )}

  </div>

</div>

)}

</section>
    </main>
 )
}