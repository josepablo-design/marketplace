# Guía de Configuración - Marketplace con Stripe

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Cuenta de Supabase activa
- Cuenta de Stripe (cubriremos cómo crearla)

## 🌐 Crear Cuenta de Stripe en Chile

### ¿Stripe está disponible en Chile?

**Sí**, Stripe está disponible en Chile desde 2022. Puedes crear una cuenta y procesar pagos locales e internacionales.

### Paso a Paso para Crear Cuenta

1. **Visita Stripe Chile**
   - Ve a: https://stripe.com/es-cl
   - Haz clic en "Empezar ahora" o "Sign up"

2. **Crea tu Cuenta**
   - Ingresa tu email
   - Crea una contraseña segura
   - Proporciona tu nombre completo

3. **Información del Negocio**
   - Nombre de tu negocio/marketplace
   - Tipo de negocio (selecciona "Marketplace" o "E-commerce")
   - RUT de tu empresa o RUT personal
   - Dirección en Chile

4. **Verificación de Identidad**
   - Cédula de identidad chilena o pasaporte
   - Comprobante de domicilio
   - Información bancaria (cuenta en banco chileno)

5. **Habilitar Modo de Prueba**
   - Por defecto, tendrás acceso al modo de prueba
   - No necesitas completar toda la verificación para usar el modo de prueba
   - Puedes empezar a desarrollar inmediatamente

### Obtener las API Keys

1. **Inicia sesión en Stripe Dashboard**
   - Ve a: https://dashboard.stripe.com

2. **Activa el Modo de Prueba**
   - En la esquina superior derecha, asegúrate de que esté activado "Test mode" (toggle azul)

3. **Obtén las Claves**
   - Ve a "Developers" → "API keys"
   - Verás dos claves de prueba:
     - **Publishable key**: Empieza con `pk_test_...`
     - **Secret key**: Empieza con `sk_test_...` (¡Mantén esta segura!)

4. **Copia las Claves**
   - Copia ambas claves para usarlas en tu `.env`

## ⚙️ Configuración del Proyecto

### 1. Instalar Dependencias

Ya están instaladas si seguiste los pasos anteriores. Si no:

```bash
npm install --legacy-peer-deps
```

### 2. Configurar Variables de Entorno

Crea o edita el archivo `.env` en la raíz del proyecto:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=tu_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Stripe Test Mode (obtenidas del dashboard de Stripe)
STRIPE_PUBLISHABLE_KEY_TEST=pk_test_tu_clave_publicable
STRIPE_SECRET_KEY_TEST=sk_test_tu_clave_secreta
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret
```

### 3. Configurar Webhook Secret (Opcional para desarrollo local)

Para desarrollo local, puedes usar el Stripe CLI:

```bash
# Instalar Stripe CLI
# Windows (con Scoop)
scoop install stripe

# Iniciar sesión
stripe login

# Escuchar webhooks localmente
stripe listen --forward-to http://localhost:8081/api/stripe-webhook
```

Esto te dará un webhook secret que empieza con `whsec_...` - cópialo a tu `.env`.

## 🗄️ Configurar Base de Datos

### 1. Aplicar Schemas en Supabase

Ve a Supabase Dashboard → SQL Editor y ejecuta los siguientes archivos en orden:

1. `supabase_schema.sql` - Crea tabla de perfiles
2. `products_schema.sql` - Crea tabla de productos
3. `orders_schema.sql` - Crea tabla de órdenes
4. `chat_schema.sql` - Crea tablas de chat

### 2. Crear Storage Bucket (Opcional)

Si quieres subir imágenes reales en el futuro:

1. Ve a Supabase Dashboard → Storage
2. Crea un nuevo bucket llamado `product-images`
3. Configura políticas públicas para lectura

### 3. Poblar con Datos de Prueba

Ejecuta el script de seed:

```bash
npm run seed
```

Esto creará:
- ✅ 5 artistas con 15-20 productos cada uno
- ✅ 5 tiendas con 15-20 productos cada uno
- ✅ 10 vendedores individuales con 50 productos usados
- ✅ Total: ~200 productos con imágenes placeholder

**Nota**: Todas las cuentas creadas usan la contraseña: `Demo123456!`

### Usuarios de Prueba Creados

**Artistas:**
- abstract_dreams@marketplace-demo.com
- bronze_sculptor@marketplace-demo.com
- digital_visions@marketplace-demo.com
- lens_poetry@marketplace-demo.com
- ink_illustrations@marketplace-demo.com

**Tiendas:**
- luna_jewelry@marketplace-demo.com
- eco_threads@marketplace-demo.com
- tech_accessories_ba@marketplace-demo.com
- madera_noble@marketplace-demo.com
- natura_skincare@marketplace-demo.com

## 🧪 Probar Pagos con Stripe

### Tarjetas de Prueba de Stripe

Cuando estés en **modo de prueba**, usa estas tarjetas:

**Pago Exitoso:**
- Número: `4242 4242 4242 4242`
- Fecha: Cualquier fecha futura
- CVC: Cualquier 3 dígitos
- ZIP: Cualquier código postal

**Pago Rechazado:**
- Número: `4000 0000 0000 0002`

**Requiere Autenticación 3D Secure:**
- Número: `4000 0027 6000 3184`

**Más tarjetas de prueba**: https://stripe.com/docs/testing

### Flujo de Prueba

1. Inicia la app: `npm start`
2. Navega a un producto
3. Inicia el proceso de compra
4. En el checkout, usa una tarjeta de prueba
5. Verifica que:
   - El pago se procese correctamente
   - La orden se marque como "paid" en Supabase
   - El producto se marque como "sold"
   - La comisión del 10% se calcule correctamente

## 💰 Estructura de Comisiones

El marketplace cobra una comisión del **10%** en todas las ventas:

**Ejemplo:**
- Precio del producto: $10,000 ARS
- Comisión de plataforma (10%): $1,000 ARS  
- Pago al vendedor: $9,000 ARS

Las comisiones se calculan automáticamente y se almacenan en la tabla `orders`.

## 🔧 Comandos Útiles

```bash
# Iniciar app en desarrollo
npm start

# Solo web
npm run web

# Poblar base de datos
npm run seed

# Ver logs de Stripe webhook (con Stripe CLI)
stripe listen --forward-to http://localhost:8081/api/stripe-webhook
```

## 📊 Ver Transacciones en Stripe

1. Ve a Stripe Dashboard: https://dashboard.stripe.com
2. Asegúrate de estar en "Test mode"
3. Ve a "Payments" para ver todas las transacciones de prueba
4. Puedes ver detalles, reembolsar, etc.

## ⚠️ Importante

- **Modo de Prueba**: Todas las configuraciones actuales son para modo de prueba
- **No hay cargos reales**: Las tarjetas de prueba no procesan dinero real
- **Producción**: Para ir a producción, necesitarás:
  - Completar la verificación de tu cuenta Stripe
  - Cambiar a claves de producción
  - Configurar webhooks en producción
  - Implementar un flujo de onboarding para vendedores (Stripe Connect)

## 🚀 Próximos Pasos

1. ✅ Configurar cuenta Stripe
2. ✅ Agregar claves a `.env`
3. ✅ Ejecutar schemas en Supabase
4. ✅ Correr `npm run seed`
5. ✅ Probar la app
6. ✅ Hacer una compra de prueba
7. 📝 Personalizar productos y categorías según necesites

## 🆘 Troubleshooting

**Error al ejecutar seed:**
- Verifica que las credenciales de Supabase en `.env` sean correctas
- Asegúrate de que los schemas estén aplicados en Supabase

**Stripe no funciona:**
- Verifica que las claves de Stripe estén en `.env`
- Asegúrate de usar claves de **test mode** (empiezan con `pk_test_` y `sk_test_`)

**No se crean productos:**
- Revisa la consola para errores
- Verifica que las tablas existan en Supabase
- Asegúrate de que RLS (Row Level Security) permita inserts

## 📞 Soporte

- Stripe Docs: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Supabase Docs: https://supabase.com/docs
