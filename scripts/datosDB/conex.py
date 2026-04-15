from supabase import create_client, Client

# Credenciales de Supabase Local
SUPABASE_URL = "http://127.0.0.1:54321"
SUPABASE_KEY = "sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz"

# Cliente de Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
