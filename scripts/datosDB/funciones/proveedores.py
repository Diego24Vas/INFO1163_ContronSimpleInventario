from faker import Faker
import random

def generar_datos_proveedores(cantidad_registros=10):
    # Usamos Faker. Si quieres datos chilenos puedes usar 'es_CL', 
    # pero mantendremos 'es_ES' como en los scripts anteriores por consistencia.
    fake = Faker('es_ES')
    
    # Palabras clave para que las empresas suenen al rubro de la construcción/ferretería
    rubros = ["Ferretera", "Aceros", "Construcción", "Herramientas", "Distribuidora", "Industrial", "Plásticos", "Importadora"]

    datos_proveedores = []

    for i in range(1, cantidad_registros + 1):
        # Generamos un nombre de empresa combinando un rubro y un nombre falso
        rubro = random.choice(rubros)
        apellido_empresa = fake.last_name()
        nombre_empresa = f"{rubro} {apellido_empresa} S.A."
        
        # Datos del contacto
        nombre_contacto = fake.name()
        
        # Generamos el teléfono y nos aseguramos de que no supere el varchar(20)
        telefono = fake.phone_number()[:20] 
        
        # Generamos un correo corporativo falso
        correo = fake.ascii_company_email()

        # Construcción del registro respetando tu esquema
        registro = {
            "id_proveedor": i,                 # [primary key, increment]
            "nombre_empresa": nombre_empresa,  # varchar(150) [not null]
            "nombre_contacto": nombre_contacto,# varchar(100)
            "telefono": telefono,              # varchar(20)
            "correo": correo                   # varchar(100)
        }
        datos_proveedores.append(registro)

    return datos_proveedores