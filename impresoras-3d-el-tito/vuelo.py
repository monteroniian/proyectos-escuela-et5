import tkinter as tk
from tkinter import messagebox, scrolledtext
import datetime
import random

class AgenciaViajesApp:
    def __init__(self, master):
        self.master = master
        master.title("Agencia de Viajes Python")
        master.geometry("800x680") # Aumentado ligeramente para más espacio
        master.resizable(False, False)

        self.carrito_compras = []
        self.historial_compras = [] # Nueva lista para almacenar compras confirmadas

        self.vuelos_disponibles = {
            "1": {"destino": "Bariloche", "precio": 15000, "moneda": "ARS", "tipo": "Nacional", "duracion": "2 horas", "disponibilidad": "Alta"},
            "2": {"destino": "Ushuaia", "precio": 18000, "moneda": "ARS", "tipo": "Nacional", "duracion": "3.5 horas", "disponibilidad": "Media"},
            "3": {"destino": "Madrid", "precio": 800, "moneda": "USD", "tipo": "Internacional", "duracion": "12 horas", "disponibilidad": "Alta"},
            "4": {"destino": "Cancún", "precio": 750, "moneda": "USD", "tipo": "Internacional", "duracion": "10 horas", "disponibilidad": "Media"}
        }

        self.crear_widgets()
        self.asiento_seleccionado = None
        self.tipo_asiento = None
        self.precio_asiento = 0

    def crear_widgets(self):
        # Frame de Bienvenida
        self.frame_bienvenida = tk.Frame(self.master, bd=2, relief="groove", padx=10, pady=10)
        self.frame_bienvenida.pack(pady=10)

        tk.Label(self.frame_bienvenida, text="¡Bienvenido a la Agencia de Viajes Python!", font=("Arial", 16, "bold")).pack(pady=5)
        tk.Label(self.frame_bienvenida, text="Tu aventura comienza aquí y ahora.", font=("Arial", 12)).pack()
        tk.Label(self.frame_bienvenida, text="Estamos ubicados en Plátanos, Buenos Aires, Argentina.", font=("Arial", 10)).pack()
        
        now = datetime.datetime.now()
        fecha_hora_str = now.strftime("%A, %d de %B de %Y - %I:%M %p")
        tk.Label(self.frame_bienvenida, text=f"Fecha y Hora Actual: {fecha_hora_str}", font=("Arial", 10)).pack()

        # Frame de Vuelos
        self.frame_vuelos = tk.Frame(self.master, bd=2, relief="groove", padx=10, pady=10)
        self.frame_vuelos.pack(pady=10, fill=tk.X)

        tk.Label(self.frame_vuelos, text="--- Catálogo de Vuelos Disponibles ---", font=("Arial", 14, "bold")).pack(pady=5)

        self.vuelos_text = scrolledtext.ScrolledText(self.frame_vuelos, width=70, height=12, font=("Courier New", 10), state=tk.DISABLED)
        self.vuelos_text.pack(pady=5)
        self.actualizar_texto_vuelos()

        # Frame de Interacción
        self.frame_interaccion = tk.Frame(self.master, padx=10, pady=5)
        self.frame_interaccion.pack(pady=5)

        tk.Label(self.frame_interaccion, text="Ingresa el NÚMERO del vuelo:", font=("Arial", 10)).grid(row=0, column=0, padx=5, pady=5)
        self.vuelo_entry = tk.Entry(self.frame_interaccion, width=5, font=("Arial", 10))
        self.vuelo_entry.grid(row=0, column=1, padx=5, pady=5)

        tk.Button(self.frame_interaccion, text="➕ Agregar al Carrito", command=self.agregar_vuelo, bg="lightblue", font=("Arial", 10, "bold")).grid(row=0, column=2, padx=10, pady=5)
        tk.Button(self.frame_interaccion, text="🛒 Ver Carrito", command=self.mostrar_carrito_gui, bg="lightgreen", font=("Arial", 10, "bold")).grid(row=0, column=3, padx=10, pady=5)
        tk.Button(self.frame_interaccion, text="💳 Finalizar Compra", command=self.finalizar_compra_gui, bg="orange", font=("Arial", 10, "bold")).grid(row=0, column=4, padx=10, pady=5)
        
        # Nuevo botón para ver compras realizadas
        tk.Button(self.frame_interaccion, text="📜 Ver Compras Realizadas", command=self.mostrar_historial_compras, bg="lightgray", font=("Arial", 10, "bold")).grid(row=1, column=0, columnspan=5, pady=10)


        # Frame de Mensajes (para feedback al usuario)
        self.frame_mensajes = tk.Frame(self.master, bd=1, relief="solid", padx=5, pady=5)
        self.frame_mensajes.pack(fill=tk.X, pady=5)
        self.mensaje_label = tk.Label(self.frame_mensajes, text="¡Bienvenido! Selecciona un vuelo.", fg="blue", font=("Arial", 10, "italic"))
        self.mensaje_label.pack()

    def actualizar_texto_vuelos(self):
        """Actualiza el texto en el scrolledtext con la información de los vuelos."""
        self.vuelos_text.config(state=tk.NORMAL)
        self.vuelos_text.delete(1.0, tk.END)
        for num, data in self.vuelos_disponibles.items():
            self.vuelos_text.insert(tk.END, f"  {num}. Vuelo a {data['destino']} ({data['tipo']})\n")
            self.vuelos_text.insert(tk.END, f"     Precio: ${data['precio']:,} {data['moneda']}\n")
            self.vuelos_text.insert(tk.END, f"     Duración estimada: {data['duracion']}\n")
            self.vuelos_text.insert(tk.END, f"     Disponibilidad: {data['disponibilidad']}\n\n")
        self.vuelos_text.config(state=tk.DISABLED)

    def agregar_vuelo(self):
        opcion = self.vuelo_entry.get().strip()
        self.vuelo_entry.delete(0, tk.END)

        if opcion in self.vuelos_disponibles:
            vuelo_info = self.vuelos_disponibles[opcion]
            self.carrito_compras.append(vuelo_info)
            self.mostrar_mensaje(f"✅ ¡Vuelo a {vuelo_info['destino']} agregado al carrito!", "green")
        else:
            self.mostrar_mensaje("❌ Opción de vuelo no válida. Por favor, selecciona un número del 1 al 4.", "red")

    def mostrar_carrito_gui(self):
        if not self.carrito_compras:
            self.mostrar_mensaje("🛒 Tu carrito de compras está vacío. ¡Es un buen momento para añadir un vuelo!", "blue")
            return

        carrito_str = "--- Contenido de tu Carrito de Compras ---\n"
        total_ars = 0
        total_usd = 0
        for i, vuelo in enumerate(self.carrito_compras):
            carrito_str += f"  {i+1}. Destino: {vuelo['destino']} ({vuelo['tipo']})\n"
            carrito_str += f"     Precio: ${vuelo['precio']:,} {vuelo['moneda']}\n"
            if vuelo['moneda'] == 'ARS':
                total_ars += vuelo['precio']
            elif vuelo['moneda'] == 'USD':
                total_usd += vuelo['precio']
        carrito_str += "----------------------------------------\n"
        if self.asiento_seleccionado:
            carrito_str += f"\n🪑 Asiento seleccionado: {self.asiento_seleccionado} ({self.tipo_asiento}) - ${self.precio_asiento}\n"
        carrito_str += f"💰 Total en Pesos Argentinos: ${total_ars:,} ARS\n"
        carrito_str += f"💵 Total en Dólares Estadounidenses: ${total_usd:,} USD\n"
        if self.asiento_seleccionado:
            carrito_str += f"💺 Costo del asiento: ${self.precio_asiento}\n"
        carrito_str += "----------------------------------------"
        messagebox.showinfo("Tu Carrito", carrito_str)
    
    def finalizar_compra_gui(self):
        if not self.carrito_compras:
            self.mostrar_mensaje("No puedes finalizar la compra si tu carrito está vacío. ¡Selecciona un vuelo!", "red")
            return
        
        if not self.asiento_seleccionado:
            self.mostrar_mensaje("Seleccionando asiento antes de finalizar compra...", "blue")
            destino = self.carrito_compras[-1]['destino']
            self.abrir_selector_asientos_compra(destino)
        else:
            self.mostrar_mensaje("Procediendo a finalizar compra...", "blue")
            self.abrir_ventana_compra()

    def abrir_ventana_compra(self):
        self.ventana_compra = tk.Toplevel(self.master)
        self.ventana_compra.title("Finalizar Compra")
        self.ventana_compra.geometry("400x350")
        self.ventana_compra.resizable(False, False)

        tk.Label(self.ventana_compra, text="--- Datos del Comprador ---", font=("Arial", 12, "bold")).pack(pady=10)

        tk.Label(self.ventana_compra, text="Nombre:").pack(pady=2)
        self.entry_nombre = tk.Entry(self.ventana_compra, width=30)
        self.entry_nombre.pack(pady=2)

        tk.Label(self.ventana_compra, text="Apellido Paterno:").pack(pady=2)
        self.entry_apellido_paterno = tk.Entry(self.ventana_compra, width=30)
        self.entry_apellido_paterno.pack(pady=2)

        tk.Label(self.ventana_compra, text="Apellido Materno (opcional):").pack(pady=2)
        self.entry_apellido_materno = tk.Entry(self.ventana_compra, width=30)
        self.entry_apellido_materno.pack(pady=2)

        tk.Label(self.ventana_compra, text="--- Forma de Pago ---", font=("Arial", 12, "bold")).pack(pady=10)

        self.forma_pago_var = tk.StringVar(self.ventana_compra)
        self.forma_pago_var.set("Tarjeta de Crédito") # Valor por defecto

        tk.Radiobutton(self.ventana_compra, text="Tarjeta de Crédito", variable=self.forma_pago_var, value="Tarjeta de Crédito").pack(anchor="w", padx=20)
        tk.Radiobutton(self.ventana_compra, text="Tarjeta de Débito", variable=self.forma_pago_var, value="Tarjeta de Débito").pack(anchor="w", padx=20)
        tk.Radiobutton(self.ventana_compra, text="Transferencia Bancaria", variable=self.forma_pago_var, value="Transferencia Bancaria").pack(anchor="w", padx=20)

        tk.Button(self.ventana_compra, text="Confirmar Compra", command=self.confirmar_compra, bg="gold", font=("Arial", 11, "bold")).pack(pady=15)

    def confirmar_compra(self):
        nombre = self.entry_nombre.get().strip()
        apellido_paterno = self.entry_apellido_paterno.get().strip()
        apellido_materno = self.entry_apellido_materno.get().strip()
        forma_pago = self.forma_pago_var.get()

        if not nombre or not apellido_paterno:
            messagebox.showerror("Error de Datos", "Por favor, ingresa tu nombre y apellido paterno.")
            return

        # Calcular totales para el resumen y el almacenamiento
        total_ars = sum(v['precio'] for v in self.carrito_compras if v['moneda'] == 'ARS')
        total_usd = sum(v['precio'] for v in self.carrito_compras if v['moneda'] == 'USD')
        
        # Crear un registro de la compra
        registro_compra = {
            "fecha_hora": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "nombre": nombre,
            "apellido_paterno": apellido_paterno,
            "apellido_materno": apellido_materno,
            "forma_pago": forma_pago,
            "vuelos": [vuelo.copy() for vuelo in self.carrito_compras],
            "asiento": self.asiento_seleccionado,
            "tipo_asiento": self.tipo_asiento,
            "precio_asiento": self.precio_asiento,
            "total_ars": total_ars,
            "total_usd": total_usd
        }
        self.historial_compras.append(registro_compra) # Almacenar la compra en el historial

        # Generar el resumen final para mostrar
        resumen_compra_str = "--- Detalles de tu Reserva ---\n"
        resumen_compra_str += f"Comprador: {nombre} {apellido_paterno} {apellido_materno}\n"
        resumen_compra_str += f"Forma de Pago Seleccionada: {forma_pago}\n"
        if self.asiento_seleccionado:
            resumen_compra_str += f"Asiento: {self.asiento_seleccionado} ({self.tipo_asiento})\n\n"
        
        resumen_compra_str += "Vuelos Reservados:\n"
        for i, vuelo in enumerate(self.carrito_compras):
            resumen_compra_str += f"  {i+1}. Destino: {vuelo['destino']} - Precio: ${vuelo['precio']:,} {vuelo['moneda']}\n"
        if self.asiento_seleccionado:
            resumen_compra_str += f"Asiento {self.asiento_seleccionado}: ${self.precio_asiento}\n"
        
        resumen_compra_str += "\n----------------------------------------\n"
        total_final_ars = total_ars + (self.precio_asiento if self.asiento_seleccionado else 0)
        total_final_usd = total_usd
        resumen_compra_str += f"💰 Total Final en ARS: ${total_final_ars:,} ARS\n"
        resumen_compra_str += f"💵 Total Final en USD: ${total_final_usd:,} USD\n"
        resumen_compra_str += "----------------------------------------\n\n"
        resumen_compra_str += "¡Gracias por elegir la Agencia de Viajes Python! ¡Te deseamos un Viaje Inolvidable!"

        messagebox.showinfo("Compra Confirmada", resumen_compra_str)
        self.ventana_compra.destroy()
        self.carrito_compras = []
        self.asiento_seleccionado = None
        self.tipo_asiento = None
        self.precio_asiento = 0
        self.mostrar_mensaje("🎉 ¡Compra finalizada con éxito! Carrito vaciado.", "purple")

    def mostrar_historial_compras(self):
        if not self.historial_compras:
            messagebox.showinfo("Historial de Compras", "Aún no se han realizado compras.")
            return

        historial_str = "--- Historial de Compras Realizadas ---\n\n"
        for i, compra in enumerate(self.historial_compras):
            historial_str += f"--- Compra #{i+1} ({compra['fecha_hora']}) ---\n"
            historial_str += f"Comprador: {compra.get('nombre', '')} {compra['apellido_paterno']} {compra['apellido_materno']}\n"
            historial_str += f"Forma de Pago: {compra['forma_pago']}\n"
            if compra.get('asiento'):
                historial_str += f"Asiento: {compra['asiento']} ({compra['tipo_asiento']}) - ${compra['precio_asiento']}\n"
            historial_str += "Vuelos:\n"
            for j, vuelo in enumerate(compra['vuelos']):
                historial_str += f"  - {vuelo['destino']} (${vuelo['precio']:,} {vuelo['moneda']})\n"
            historial_str += f"Total ARS: ${compra['total_ars']:,} | Total USD: ${compra['total_usd']:,}\n"
            historial_str += "---------------------------------------\n\n"
        
        # Usar un ScrolledText en un Toplevel para mostrar el historial largo
        historial_ventana = tk.Toplevel(self.master)
        historial_ventana.title("Historial de Compras")
        historial_ventana.geometry("600x400")
        historial_ventana.resizable(True, True)

        historial_text_area = scrolledtext.ScrolledText(historial_ventana, wrap=tk.WORD, font=("Courier New", 10))
        historial_text_area.insert(tk.END, historial_str)
        historial_text_area.config(state=tk.DISABLED)
        historial_text_area.pack(expand=True, fill="both", padx=10, pady=10)

        tk.Button(historial_ventana, text="Cerrar", command=historial_ventana.destroy).pack(pady=5)


    def abrir_selector_asientos_compra(self, destino):
        ventana_asientos = tk.Toplevel(self.master)
        ventana_asientos.title(f"Selección de Asientos - {destino}")
        ventana_asientos.geometry("900x750")
        ventana_asientos.grab_set()
        
        # Configurar asientos
        asientos = self.configurar_asientos(destino)
        asiento_seleccionado = [None]
        botones_asientos = {}
        
        # Título
        tk.Label(ventana_asientos, text=f"Selecciona tu asiento - Vuelo a {destino}", 
                font=("Arial", 16, "bold"), bg="lightblue").pack(pady=10)
        
        # Leyenda
        frame_leyenda = tk.Frame(ventana_asientos)
        frame_leyenda.pack(pady=5)
        
        colores = [("Disponible", "lightgreen"), ("VIP", "gold"), ("Ocupado", "red"), ("Seleccionado", "blue")]
        for i, (texto, color) in enumerate(colores):
            tk.Button(frame_leyenda, text=texto, bg=color, width=12, state="disabled").grid(row=0, column=i, padx=2)
        
        # Avión
        frame_avion = tk.Frame(ventana_asientos, bg="lightgray", relief="raised", bd=2)
        frame_avion.pack(pady=20)
        
        tk.Label(frame_avion, text="🛩️ CABINA 🛩️", font=("Arial", 14, "bold"), bg="lightgray").grid(row=0, column=0, columnspan=8, pady=5)
        
        def seleccionar_asiento(asiento_id):
            if asiento_seleccionado[0]:
                estado = asientos[asiento_seleccionado[0]]
                color = "lightgreen" if estado == "disponible" else "gold"
                botones_asientos[asiento_seleccionado[0]].config(bg=color)
            
            asiento_seleccionado[0] = asiento_id
            botones_asientos[asiento_id].config(bg="blue")
            
            estado = asientos[asiento_id]
            precio = 1000 if estado == "vip" else 500
            tipo = "VIP" if estado == "vip" else "Económico"
            
            info_text = f"Asiento: {asiento_id} | Tipo: {tipo} | Precio: ${precio}"
            info_label.config(text=info_text)
            btn_continuar.config(state="normal")
        
        for fila in range(1, 13):
            tk.Label(frame_avion, text=str(fila), font=("Arial", 10, "bold"), bg="lightgray", width=2).grid(row=fila, column=0, padx=2, pady=1)
            
            for i, letra in enumerate(['A', 'B', 'C', 'D', 'E', 'F']):
                asiento_id = f"{fila}{letra}"
                estado = asientos[asiento_id]
                
                if estado == "disponible":
                    color, estado_btn = "lightgreen", "normal"
                elif estado == "vip":
                    color, estado_btn = "gold", "normal"
                else:
                    color, estado_btn = "red", "disabled"
                
                btn = tk.Button(frame_avion, text=asiento_id, width=6, height=2, bg=color, font=("Arial", 8, "bold"), state=estado_btn, command=lambda aid=asiento_id: seleccionar_asiento(aid))
                col = i + 1 if i < 3 else i + 2
                btn.grid(row=fila, column=col, padx=1, pady=1)
                botones_asientos[asiento_id] = btn
            
            tk.Label(frame_avion, text="  ", bg="lightgray").grid(row=fila, column=4, padx=5)
        
        # Info y botones
        info_label = tk.Label(ventana_asientos, text="Selecciona un asiento para continuar", font=("Arial", 12), bg="lightyellow", relief="raised", bd=2, width=50)
        info_label.pack(pady=15)
        
        btn_frame = tk.Frame(ventana_asientos)
        btn_frame.pack(pady=25)
        
        def aceptar_y_continuar():
            if asiento_seleccionado[0]:
                estado = asientos[asiento_seleccionado[0]]
                self.asiento_seleccionado = asiento_seleccionado[0]
                self.tipo_asiento = "VIP" if estado == "vip" else "Económico"
                self.precio_asiento = 1000 if estado == "vip" else 500
                ventana_asientos.destroy()
                self.mostrar_mensaje("Procediendo a finalizar compra...", "blue")
                self.abrir_ventana_compra()
        
        btn_continuar = tk.Button(btn_frame, text="CONTINUAR", font=("Arial", 14, "bold"), bg="green", fg="white", state="disabled", command=aceptar_y_continuar, width=15, height=2)
        btn_continuar.pack(side=tk.LEFT, padx=20)
        
        tk.Button(btn_frame, text="Cancelar", font=("Arial", 12), bg="lightgray", command=ventana_asientos.destroy, width=10).pack(side=tk.LEFT, padx=10)
    
    def configurar_asientos(self, destino):
        config = {
            "Bariloche": {"ocupados": 20, "vip_ocupados": 3},
            "Ushuaia": {"ocupados": 25, "vip_ocupados": 4},
            "Madrid": {"ocupados": 15, "vip_ocupados": 2},
            "Cancún": {"ocupados": 30, "vip_ocupados": 5}
        }.get(destino, {"ocupados": 15, "vip_ocupados": 2})
        
        asientos = {}
        for fila in range(1, 13):
            for letra in ['A', 'B', 'C', 'D', 'E', 'F']:
                asientos[f"{fila}{letra}"] = "disponible"
        
        # VIP (primeras 2 filas)
        for fila in range(1, 3):
            for letra in ['A', 'B', 'C', 'D', 'E', 'F']:
                asientos[f"{fila}{letra}"] = "vip"
        
        # Ocupar asientos
        normales = [k for k, v in asientos.items() if v == "disponible"]
        vips = [k for k, v in asientos.items() if v == "vip"]
        
        for asiento in random.sample(normales, min(config["ocupados"], len(normales))):
            asientos[asiento] = "ocupado"
        for asiento in random.sample(vips, min(config["vip_ocupados"], len(vips))):
            asientos[asiento] = "ocupado"
        
        return asientos

    def mostrar_mensaje(self, mensaje, color="black"):
        self.mensaje_label.config(text=mensaje, fg=color)


if __name__ == "__main__":
    root = tk.Tk()
    app = AgenciaViajesApp(root)
    root.mainloop()