# 🛒 Marketplace - Multi-Platform E-Commerce

Aplicación de marketplace multi-plataforma (iOS, Android, Web) construida con React Native, Expo Router, Supabase y Stripe.

## ✨ Características

- 🎨 **Vendedores Artistas**: Galería para artistas que venden sus obras
- 🏪 **Tiendas**: Marcas y emprendimientos con múltiples productos
- 🔄 **Productos Usados**: Marketplace P2P para artículos de segunda mano
- 💳 **Pagos con Stripe**: Integración completa con modo de prueba
- 💰 **Sistema de Comisiones**: 10% de comisión automática en ventas
- 💬 **Chat en Tiempo Real**: Comunicación entre compradores y vendedores
- 🔐 **Autenticación**: Sistema completo con Supabase Auth
- 📱 **Multi-Plataforma**: iOS, Android y Web desde un solo código

## 🚀 Inicio Rápido

### 1. Clonar e Instalar

```bash
cd marketplace
npm install --legacy-peer-deps
```

### 2. Configurar Stripe

**⚠️ IMPORTANTE**: Sigue la guía completa en [`SETUP_STRIPE.md`](./SETUP_STRIPE.md)

Incluye:
- ✅ Instrucciones para crear cuenta en Chile
- ✅ Cómo obtener las API keys de prueba
- ✅ Configuración de webhooks
- ✅ Tarjetas de prueba de Stripe

### 3. Configurar Variables de Entorno

Copia `.env.example` a `.env` y completa:

```env
EXPO_PUBLIC_SUPABASE_URL=tu_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

STRIPE_PUBLISHABLE_KEY_TEST=pk_test_...
STRIPE_SECRET_KEY_TEST=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Configurar Base de Datos

En Supabase SQL Editor, ejecuta en orden:

1. `supabase_schema.sql`
2. `products_schema.sql`
3. `orders_schema.sql`
4. `chat_schema.sql`

### 5. Poblar con Datos de Prueba

```bash
npm run seed
```

Esto crea:
- 5 artistas con ~80 productos de arte
- 5 tiendas con ~80 productos variados
- 50 productos usados en categorías diversas

**Contraseña de prueba para todos**: `Demo123456!`

### 6. Iniciar la App

```bash
npm start
```

## 📂 Estructura del Proyecto

```
marketplace/
├── app/                      # Pantallas y rutas (Expo Router)
│   ├── (auth)/              # Autenticación
│   ├── (tabs)/              # Navegación principal
│   ├── api/                 # API routes (Stripe)
│   ├── product/[id].tsx     # Detalle de producto
│   └── checkout.tsx         # Pantalla de pago
├── components/              # Componentes reutilizables
├── services/                # Lógica de negocio
│   ├── supabase.ts         # Cliente de Supabase
│   ├── stripe.ts           # Integración Stripe
│   └── commission.ts       # Cálculo de comisiones
├── scripts/
│   └── seed-database.ts    # Script de población
├── *_schema.sql            # Schemas de base de datos
└── SETUP_STRIPE.md         # Guía completa de Stripe
```

## 💰 Sistema de Comisiones

El marketplace cobra **10% de comisión** en todas las ventas:

**Ejemplo:**
- Producto: $10,000 ARS
- Comisión plataforma: $1,000 ARS (10%)
- Pago al vendedor: $9,000 ARS

Las comisiones se calculan automáticamente al crear una orden y se almacenan en la base de datos.

## 🧪 Testing con Stripe

### Tarjetas de Prueba

```
✅ Pago exitoso: 4242 4242 4242 4242
❌ Pago rechazado: 4000 0000 0000 0002
🔐 3D Secure: 4000 0027 6000 3184
```

**Más info**: https://stripe.com/docs/testing

### Webhooks Locales

```bash
stripe listen --forward-to http://localhost:8081/api/stripe-webhook
```

## 📱 Usuarios de Prueba

### Artistas
- `abstract_dreams@marketplace-demo.com` - Pintora abstracta
- `bronze_sculptor@marketplace-demo.com` - Escultor
- `digital_visions@marketplace-demo.com` - Artista digital
- `lens_poetry@marketplace-demo.com` - Fotógrafo
- `ink_illustrations@marketplace-demo.com` - Ilustradora

### Tiendas
- `luna_jewelry@marketplace-demo.com` - Joyería artesanal
- `eco_threads@marketplace-demo.com` - Ropa sustentable
- `tech_accessories_ba@marketplace-demo.com` - Accesorios tech
- `madera_noble@marketplace-demo.com` - Muebles de madera
- `natura_skincare@marketplace-demo.com` - Cosmética natural

## 🛠️ Scripts Disponibles

```bash
npm start          # Inicia Expo dev server
npm run web        # Solo web
npm run android    # Solo Android
npm run ios        # Solo iOS
npm run seed       # Poblar base de datos
```

## 🌐 Stripe en Chile

✅ **Sí, Stripe funciona en Chile** desde 2022

- Procesa pagos locales e internacionales
- Soporta CLP (Peso Chileno)
- Requiere RUT y cuenta bancaria chilena
- Modo de prueba disponible sin verificación

Ver guía completa: [`SETUP_STRIPE.md`](./SETUP_STRIPE.md)

## 📚 Tecnologías

- **Frontend**: React Native + Expo
- **Routing**: Expo Router v6
- **Estilos**: NativeWind (Tailwind for React Native)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Pagos**: Stripe (Test Mode)
- **Lenguaje**: TypeScript

## 🔐 Seguridad

- ✅ Row Level Security (RLS) en Supabase
- ✅ Autenticación JWT
- ✅ Verificación de webhooks de Stripe
- ✅ Variables de entorno para secretos
- ✅ Validación de datos en API routes

## 📝 Próximos Pasos

1. ✅ Configurar Stripe → Ver `SETUP_STRIPE.md`
2. ✅ Poblar base de datos → `npm run seed`
3. 🎨 Generar imágenes reales para productos
4. 📱 Integrar Stripe Elements en mobile
5. 🚀 Deploy a producción (Vercel + EAS)

## 🆘 Troubleshooting

**Problema**: Error al ejecutar seed
- **Solución**: Verifica que los schemas estén aplicados en Supabase

**Problema**: Stripe no funciona
- **Solución**: Asegúrate de usar claves `pk_test_` y `sk_test_`

**Problema**: No aparecen productos
- **Solución**: Ejecuta `npm run seed` y revisa la consola

## 📄 Licencia

MIT

---

**¿Necesitas ayuda?** Lee [`SETUP_STRIPE.md`](./SETUP_STRIPE.md) para instrucciones completas.
