from faker import Faker

def generar_datos_categorias(cantidad_registros=10):
    fake = Faker('es_ES')
    
    # Lista de categorías clásicas y coherentes para una ferretería
    nombres_categorias = [
        "Herramientas Manuales",
        "Herramientas Eléctricas",
        "Materiales de Construcción",
        "Pinturas y Accesorios",
        "Fijaciones y Adhesivos",
        "Electricidad e Iluminación",
        "Gasfitería y Plomería",
        "Seguridad Industrial",
        "Jardinería y Exteriores",
        "Aseo y Limpieza"
    ]
    
    # Limitar a la cantidad disponible si se pide más
    cantidad_registros = min(cantidad_registros, len(nombres_categorias))

    datos_categorias = []

    # Iteramos sobre la cantidad solicitada para crear un ID autoincremental
    for i, nombre in enumerate(nombres_categorias[:cantidad_registros], start=1):
        
        # Creamos una descripción que tenga sentido con el nombre de la categoría
        # y le agregamos una oración aleatoria de Faker para darle volumen.
        descripcion = f"Departamento especializado en {nombre.lower()}. {fake.sentence()}"
        
        # Construcción del registro según tu esquema
        registro = {
            "id_categoria": i,               # [primary key, increment]
            "nombre": nombre,                # varchar(100) [not null]
            "descripcion": descripcion       # text
        }
        
        datos_categorias.append(registro)

    return datos_categorias