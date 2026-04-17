import random
from faker import Faker
from conex import supabase  # Importar conexión a Supabase

def generar_datos_ferreteria(cantidad_registros, cantidad_categorias=10, cantidad_proveedores=5):
    # Inicializamos Faker en español
    fake = Faker('es_ES')

    # Consultar el último ID existente en la tabla productos
    try:
        response = supabase.table("productos").select("id_producto").order("id_producto", desc=True).limit(1).execute()
        ultimo_id = response.data[0]["id_producto"] if response.data else 0
    except Exception as e:
        print(f"[ERROR] No se pudo obtener el último ID de productos: {e}")
        ultimo_id = 0

    # Lista de productos de ferretería coherentes para dar contexto
    catalogo_base = [
        ("Martillo de Carpintero", "Martillo con mango de nogal de 16 oz, ideal para trabajos de carpintería general."),
        ("Destornillador Cruz", "Destornillador Phillips #2 con punta magnética y mango ergonómico."),
        ("Taladro Inalámbrico 20V", "Taladro percutor incluye 2 baterías de litio y cargador rápido."),
        ("Clavos de Acero 2 pulgadas", "Caja de clavos de acero galvanizado, 1 kg."),
        ("Cinta Métrica 5m", "Huincha de medir retráctil con seguro y clip para cinturón."),
        ("Llave Inglesa 8 pulgadas", "Llave ajustable de acero al carbono, resistente a la corrosión."),
        ("Alicate Universal", "Alicate de 8 pulgadas con mangos aislados para trabajos eléctricos."),
        ("Sierra Circular", "Sierra circular eléctrica de 1500W, incluye disco de corte para madera."),
        ("Pintura Esmalte Sintético", "Galón de pintura esmalte sintético blanco brillante para interiores/exteriores."),
        ("Cemento Melón", "Saco de cemento de 25 kg para construcción y reparaciones."),
        ("Tubo PVC 110mm", "Tubo sanitario de PVC de 110mm de diámetro, largo de 3 metros."),
        ("Silicona Transparente", "Cartucho de silicona fungicida para sellado de baños y cocinas."),
        ("Candado de Bronce 40mm", "Candado de seguridad con 3 llaves incluidas, arco de acero endurecido."),
        ("Disco de Corte Metal", "Disco abrasivo de 4.5 pulgadas para esmeril angular."),
        ("Brocha 2 pulgadas", "Brocha de cerdas naturales para esmaltes y barnices.")
    ]

    datos_productos = []

    for i in range(1, cantidad_registros + 1):
        # Seleccionamos un producto aleatorio de nuestro catálogo base
        producto_base = random.choice(catalogo_base)
        nombre = producto_base[0]

        # Mezclamos la descripción base con texto aleatorio de Faker para hacerlos distintos
        descripcion = f"{producto_base[1]} {fake.sentence()}"

        # Lógica comercial: El precio de compra está entre $500 y $150,000 CLP (o la moneda que uses)
        precio_compra = int(random.uniform(500.0, 150000.0))
        # El precio de venta tiene un margen de ganancia aleatorio entre el 20% y el 60%
        margen = random.uniform(1.20, 1.60)
        precio_venta = int(precio_compra * margen)

        # Lógica de stock
        stock_minimo = random.randint(5, 20)
        # El stock actual puede estar por debajo del mínimo (alerta) o bien abastecido
        stock_actual = random.randint(0, 150)

        # Construcción del registro
        registro = {
            "id_producto": ultimo_id + i,  # Asegurar IDs únicos
            "codigo_sku": f"SKU-{str(ultimo_id + i).zfill(6)}",  # Genera SKU único y determinista
            "nombre": nombre,
            "descripcion": descripcion,
            "precio_compra": precio_compra,
            "precio_venta": precio_venta,
            "stock_actual": stock_actual,
            "stock_minimo": stock_minimo,
            "id_categoria": random.randint(1, cantidad_categorias),  # Referencias válidas a categorías
            "id_proveedor": random.randint(1, cantidad_proveedores)   # Referencias válidas a proveedores
        }

        datos_productos.append(registro)

    return datos_productos