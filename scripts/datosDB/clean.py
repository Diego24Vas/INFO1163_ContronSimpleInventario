#!/usr/bin/env python3
"""
Script para limpiar (eliminar todos los registros) de las tablas de la base de datos.
NOTA: Solo elimina los datos, NO las tablas en sí.
"""

from conex import supabase


def limpiar_tabla(tabla: str, id_campo: str) -> bool:
    """
    Elimina todos los registros de una tabla sin eliminar la tabla.
    
    Args:
        tabla: Nombre de la tabla
        id_campo: Nombre del campo ID para usar en la condición
    
    Returns:
        True si se limpió exitosamente, False en caso contrario
    """
    try:
        print(f"\n  [INFO] Eliminando registros de '{tabla}'...")
        
        # Usar neq para eliminar donde el ID es diferente a un número imposible
        # Esto elimina todos los registros sin afectar la estructura de la tabla
        response = supabase.table(tabla).delete().neq(id_campo, -1).execute()
        
        # Verificar cuántos registros fueron eliminados
        print(f"  [OK] Registros de '{tabla}' eliminados exitosamente")
        return True
        
    except Exception as e:
        print(f"  [ERROR] Error al limpiar '{tabla}': {e}")
        return False


def limpiar_base_datos():
    """
    Limpia todos los registros de todas las tablas en orden de dependencias.
    Orden: Movimientos -> Productos -> Categorías -> Proveedores
    """
    
    print("\n" + "="*60)
    print("LIMPIANDO BASE DE DATOS")
    print("="*60)
    print("\nNOTA: Solo se eliminarán los registros, no las tablas\n")
    
    # Verificar conexión
    print("[1/5] Verificando conexión a Supabase...")
    try:
        supabase.table("categorias").select("*").limit(1).execute()
        print("[OK] Conexión verificada exitosamente")
    except Exception as e:
        print(f"[ERROR] Error de conexión: {e}")
        return
    
    # Orden de limpieza: respetar Foreign Keys
    # Primero eliminar tablas que dependen de otras
    print("\n[2/5] Limpiando tabla MOVIMIENTOS (depende de productos)...")
    if not limpiar_tabla("movimientos", "id_movimiento"):
        print("[WARNING] Continuando con la limpieza...")
    
    print("\n[3/5] Limpiando tabla PRODUCTOS (depende de categorías y proveedores)...")
    if not limpiar_tabla("productos", "id_producto"):
        print("[WARNING] Continuando con la limpieza...")
    
    # Luego eliminar tablas independientes
    print("\n[4/5] Limpiando tabla CATEGORÍAS...")
    if not limpiar_tabla("categorias", "id_categoria"):
        print("[WARNING] Continuando con la limpieza...")
    
    print("\n[5/5] Limpiando tabla PROVEEDORES...")
    if not limpiar_tabla("proveedores", "id_proveedor"):
        print("[WARNING] Continuando con la limpieza...")
    
    print("\n" + "="*60)
    print("[SUCCESS] LIMPIEZA DE BASE DE DATOS COMPLETADA")
    print("="*60 + "\n")


if __name__ == "__main__":
    import sys
    
    # Pedir confirmación
    print("\n" + "="*60)
    print("ADVERTENCIA: OPERACIÓN DESTRUCTIVA")
    print("="*60)
    print("\nEsta operación eliminará TODOS los registros de las tablas:")
    print("  - Movimientos")
    print("  - Productos")
    print("  - Categorías")
    print("  - Proveedores")
    print("\nLas tablas en sí NO serán eliminadas, solo sus datos.")
    print()
    
    confirmacion = input("¿Deseas continuar? (escriba 'si' para confirmar): ").strip().lower()
    
    if confirmacion == "si":
        limpiar_base_datos()
    else:
        print("\n[CANCELADO] Operación cancelada por el usuario.\n")
