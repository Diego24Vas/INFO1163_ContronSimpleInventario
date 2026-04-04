from faker import Faker
import random
import pandas as pd

def generar_datos_movimientos(cantidad_registros=20, total_productos_creados=10):
    fake = Faker('es_ES')
    datos_movimientos = []

    # Opciones lógicas para entradas y salidas
    motivos_entrada = ['compra a proveedor', 'devolución de cliente', 'ajuste de inventario positivo']
    motivos_salida = ['venta en local', 'venta web', 'devolución a proveedor', 'merma por daño', 'ajuste de inventario negativo']

    for i in range(1, cantidad_registros + 1):
        # Seleccionamos aleatoriamente si es entrada o salida
        tipo_movimiento = random.choice(['entrada', 'salida'])
        
        # Asignamos un motivo coherente según el tipo de movimiento
        if tipo_movimiento == 'entrada':
            motivo = random.choice(motivos_entrada)
        else:
            motivo = random.choice(motivos_salida)

        # Generamos una fecha y hora aleatoria dentro del último año
        fecha_hora = fake.date_time_between(start_date='-1y', end_date='now').strftime("%Y-%m-%d %H:%M:%S")

        registro = {
            "id_movimiento": i,                                      # [primary key, increment]
            "id_producto": random.randint(1, total_productos_creados), # Debe coincidir con los IDs de la tabla productos
            "tipo_movimiento": tipo_movimiento,                      # varchar(20)
            "cantidad": random.randint(1, 50),                       # Cantidades lógicas por transacción
            "fecha_hora": fecha_hora,                                # datetime
            "motivo": motivo                                         # varchar(150)
        }
        
        datos_movimientos.append(registro)

    # Ordenamos cronológicamente los datos para que el historial sea realista
    datos_movimientos = sorted(datos_movimientos, key=lambda x: x['fecha_hora'])
    
    # Reasignamos los IDs después de ordenar para que sigan siendo correlativos en el tiempo
    for index, registro in enumerate(datos_movimientos, start=1):
        registro['id_movimiento'] = index

    return datos_movimientos

# Generar 20 movimientos de prueba
mis_movimientos = generar_datos_movimientos(20)

# Mostrar los datos en un formato de tabla usando Pandas
df_movimientos = pd.DataFrame(mis_movimientos)
print("--- TABLA DE MOVIMIENTOS DE INVENTARIO ---")
print(df_movimientos.to_string(index=False))