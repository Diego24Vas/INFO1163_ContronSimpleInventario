#!/usr/bin/env python3
"""
Script principal para generar e insertar datos en la base de datos Supabase.
Permite configurar la cantidad de registros a generar con opciones predefinidas o personalizadas.
"""

from funciones.categorias import generar_datos_categorias
from funciones.proveedores import generar_datos_proveedores
from funciones.productos import generar_datos_ferreteria
from funciones.movimientos import generar_datos_movimientos
from conex import supabase


def insertar_datos(tabla: str, datos: list) -> bool:
    """Inserta datos en una tabla específica con mejor manejo de errores."""
    if not datos or len(datos) == 0:
        print(f"[WARNING] No hay datos para insertar en '{tabla}'")
        return False
    
    try:
        print(f"  [INFO] Preparando inserción de {len(datos)} registros...")
        
        # Intentar inserción por lotes si hay muchos registros
        tamaño_lote = 100
        registros_insertados = 0
        
        for i in range(0, len(datos), tamaño_lote):
            lote = datos[i:i + tamaño_lote]
            try:
                response = supabase.table(tabla).insert(lote).execute()
                registros_insertados += len(lote)
                print(f"  [INFO] Lote {i//tamaño_lote + 1}: {len(lote)} registros insertados")
            except Exception as e:
                print(f"[ERROR] Falla en lote {i//tamaño_lote + 1}: {e}")
                return False
        
        print(f"[OK] {registros_insertados} registro(s) insertado(s) exitosamente en '{tabla}'")
        return True
        
    except Exception as e:
        print(f"[ERROR] Error general al insertar en '{tabla}': {e}")
        import traceback
        traceback.print_exc()
        return False


def mostrar_menu_interactivo():
    """Muestra un menú interactivo preguntando por cada tabla."""
    print("\n" + "="*60)
    print("CONFIGURACIÓN DE CANTIDAD DE DATOS POR TABLA")
    print("="*60)
    print("\nIngrese la cantidad de registros para cada tabla:")
    print("(Presione Enter para usar el valor por defecto)\n")
    
    try:
        cantidad_proveedores = input("  Cantidad de PROVEEDORES (default 5): ").strip()
        cantidad_proveedores = int(cantidad_proveedores) if cantidad_proveedores else 5
        
        cantidad_categorias = input("  Cantidad de CATEGORÍAS (default 10): ").strip()
        cantidad_categorias = int(cantidad_categorias) if cantidad_categorias else 10
        
        cantidad_productos = input("  Cantidad de PRODUCTOS (default 10): ").strip()
        cantidad_productos = int(cantidad_productos) if cantidad_productos else 10
        
        cantidad_movimientos = input("  Cantidad de MOVIMIENTOS (default 20): ").strip()
        cantidad_movimientos = int(cantidad_movimientos) if cantidad_movimientos else 20
        
        print(f"\n[INFO] Configuración finalizada:")
        print(f"       - Proveedores: {cantidad_proveedores}")
        print(f"       - Categorías: {cantidad_categorias}")
        print(f"       - Productos: {cantidad_productos}")
        print(f"       - Movimientos: {cantidad_movimientos}")
        
        return cantidad_proveedores, cantidad_categorias, cantidad_productos, cantidad_movimientos
    
    except ValueError:
        print("[ERROR] Valores inválidos. Usando configuración por defecto...")
        return 5, 10, 10, 20


def rellenar_base_datos(
    cantidad_proveedores=5,
    cantidad_categorias=10,
    cantidad_productos=10,
    cantidad_movimientos=20
):
    """
    Genera e inserta datos en la base de datos en orden de prioridad:
    1. Proveedores (sin dependencias)
    2. Categorías (sin dependencias)
    3. Productos (depende de proveedores y categorías)
    4. Movimientos (depende de productos)
    """
    
    print("\n" + "="*60)
    print("INICIANDO LLENADO DE BASE DE DATOS")
    print("="*60)
    
    # Verificar conexión
    print("\n[1/5] Verificando conexión a Supabase...")
    try:
        supabase.table("categorias").select("*").limit(1).execute()
        print("[OK] Conexión verificada exitosamente")
    except Exception as e:
        print(f"[ERROR] Error de conexión: {e}")
        return
    
    # Generar e insertar PROVEEDORES (1ero - sin dependencias)
    print(f"\n[2/5] Generando {cantidad_proveedores} proveedores...")
    proveedores = generar_datos_proveedores(cantidad_proveedores)
    if not insertar_datos("proveedores", proveedores):
        print("[ERROR] Falló inserción de proveedores. Abortando...")
        return
    print(f"     [DONE] {len(proveedores)} proveedores insertados")
    
    # Generar e insertar CATEGORÍAS (2do - sin dependencias)
    print(f"\n[3/5] Generando {cantidad_categorias} categorías...")
    categorias = generar_datos_categorias(cantidad_categorias)
    if not insertar_datos("categorias", categorias):
        print("[ERROR] Falló inserción de categorías. Abortando...")
        return
    categorias_reales = len(categorias)  # Guardar la cantidad real de categorías insertadas
    print(f"     [DONE] {categorias_reales} categorías insertadas (Nota: máximo 10 disponibles)")
    
    # Generar e insertar PRODUCTOS (3ro - depende de proveedores y categorías)
    print(f"\n[4/5] Generando {cantidad_productos} productos...")
    try:
        # Usar la cantidad real de categorías y proveedores generados
        productos = generar_datos_ferreteria(cantidad_productos, categorias_reales, len(proveedores))
        print(f"  [INFO] {len(productos)} productos generados correctamente")
        if not insertar_datos("productos", productos):
            print("[ERROR] Falló inserción de productos. Abortando...")
            return
        print(f"     [DONE] {len(productos)} productos insertados")
        productos_reales = len(productos)  # Guardar la cantidad real de productos insertados
    except Exception as e:
        print(f"[ERROR] Error al generar productos: {e}")
        return
    
    # Generar e insertar MOVIMIENTOS (4to - depende de productos)
    print(f"\n[5/5] Generando {cantidad_movimientos} movimientos...")
    print(f"  [INFO] Usando {productos_reales} productos como referencia...")
    try:
        movimientos = generar_datos_movimientos(cantidad_movimientos, productos_reales)
        print(f"  [INFO] {len(movimientos)} movimientos generados correctamente")
        if not insertar_datos("movimientos", movimientos):
            print("[ERROR] Falló inserción de movimientos.")
            return
        print(f"     [DONE] {len(movimientos)} movimientos insertados")
    except Exception as e:
        print(f"[ERROR] Error al generar movimientos: {e}")
        return
    
    print("\n" + "="*60)
    print("[SUCCESS] LLENADO DE BASE DE DATOS COMPLETADO EXITOSAMENTE")
    print("="*60 + "\n")


if __name__ == "__main__":
    import sys
    
    # Si hay argumentos de línea de comandos, usarlos
    if len(sys.argv) > 1:
        cantidad_proveedores = int(sys.argv[1])
        cantidad_categorias = int(sys.argv[2]) if len(sys.argv) > 2 else 10
        cantidad_productos = int(sys.argv[3]) if len(sys.argv) > 3 else 10
        cantidad_movimientos = int(sys.argv[4]) if len(sys.argv) > 4 else 20
        
        print(f"\n[INFO] Argumentos desde línea de comandos detectados")
        print(f"Configurando con: {cantidad_proveedores} proveedores, "
              f"{cantidad_categorias} categorías, "
              f"{cantidad_productos} productos, "
              f"{cantidad_movimientos} movimientos")
    else:
        # Si no hay argumentos, mostrar menú interactivo
        cantidad_proveedores, cantidad_categorias, cantidad_productos, cantidad_movimientos = mostrar_menu_interactivo()
    
    rellenar_base_datos(
        cantidad_proveedores,
        cantidad_categorias,
        cantidad_productos,
        cantidad_movimientos
    )
