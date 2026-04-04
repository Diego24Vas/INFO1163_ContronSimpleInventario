from faker import Faker
import pandas as pd

def generar_datos_categorias():
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

    datos_categorias = []

    # Iteramos directamente sobre nuestra lista para crear un ID autoincremental
    for i, nombre in enumerate(nombres_categorias, start=1):
        
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

# Generar y guardar los registros
mis_categorias = generar_datos_categorias()

# Mostrar los datos en un formato de tabla usando Pandas
df_categorias = pd.DataFrame(mis_categorias)
print("--- TABLA DE CATEGORÍAS ---")
print(df_categorias.to_string(index=False))