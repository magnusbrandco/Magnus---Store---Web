# Magnus Store

**Cultura urbana premium. Sneakers, streetwear y accesorios auténticos en Colombia.**

Magnus Store es una plataforma de e-commerce moderna construida con React, TypeScript, Vite y Supabase. Ofrece una experiencia de compra inmersiva con gestión completa de catálogo, autenticación, carrito de compras, órdenes y un panel administrativo robusto.

---

## 🎯 Características Principales

### Para Clientes
- ✅ **Catálogo completo** - Productos con variantes (tallas, colores), búsqueda y filtros
- ✅ **Carrito de compras** - Con persistencia en localStorage
- ✅ **Autenticación** - Login/registro con Supabase
- ✅ **Órdenes** - Historial de compras y detalles
- ✅ **Wishlist** - Guardar productos favoritos
- ✅ **Drops exclusivos** - Colecciones limitadas por tiempo
- ✅ **Marcas y categorías** - Navegación por secciones
- ✅ **Checkout** - Con redirección a WhatsApp para confirmación
- ✅ **Información** - Términos, privacidad, envío, devoluciones, FAQ, contacto
- ✅ **Responsive Design** - Totalmente mobile-friendly
- ✅ **Animaciones** - Con Framer Motion para UX mejorada

### Para Administradores
- ✅ **Dashboard principal** - Métricas y edición de homepage
- ✅ **Gestión de productos** - CRUD con variantes (tallas, colores, stock)
- ✅ **Gestión de marcas** - Upload de logos y covers
- ✅ **Gestión de categorías** - Upload de imágenes
- ✅ **Gestión de cupones** - Crear y editar descuentos
- ✅ **Gestión de órdenes** - Ver y filtrar pedidos
- ✅ **Gestión de clientes** - Lista de usuarios registrados
- ✅ **Gestión de drops** - Crear colecciones limitadas
- ✅ **Editor de homepage** - Personalizar hero, CTAs y color destacado

### Para Dueño
- ✅ **Owner Dashboard** - Métricas de negocio
- ✅ **Acceso completo** - A todas las funciones administrativas
- ✅ **Control de marca** - Logo personalizado en panel admin
- ✅ **Redirect automático** - De `/admin` a `/admin/owner` para propietario

---

## 🛠 Stack Tecnológico

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool rápido
- **Tailwind CSS + @tailwindcss/postcss** - Styling moderno
- **Framer Motion** - Animaciones fluidas
- **React Router DOM** - Enrutamiento
- **React Hook Form + Zod** - Validación de formularios
- **Zustand** - State management (auth, cart, UI)
- **React Query** - Data fetching y caching
- **Lucide React** - Iconografía

### Backend
- **Supabase** - Base de datos PostgreSQL + Auth
- **Supabase RLS** - Row-Level Security para privacidad
- **Supabase Storage** - Almacenamiento de imágenes

### Características Avanzadas
- SEO meta tags con hook `useSEO`
- Infinite scroll en listado de productos
- Lazy loading de imágenes
- Cursor personalizado
- Newsletter signup (validado)
- Contact form con integración WhatsApp

---

## 📁 Estructura del Proyecto

```
src/
├── pages/                    # Páginas principales
│   ├── Home.tsx              # Homepage con hero, drops, categorías
│   ├── Shop.tsx              # Catálogo con filtros
│   ├── ProductDetail.tsx      # Detalle de producto
│   ├── Brand.tsx             # Productos de una marca
│   ├── Category.tsx          # Productos de una categoría
│   ├── Drops.tsx             # Drops exclusivos
│   ├── Checkout.tsx          # Checkout con WhatsApp
│   ├── OrderConfirmation.tsx # Confirmación de orden
│   ├── Orders.tsx            # Historial de órdenes
│   ├── Account.tsx           # Perfil del usuario
│   ├── Wishlist.tsx          # Lista de favoritos
│   ├── Search.tsx            # Búsqueda de productos
│   ├── Terminos.tsx          # Términos y condiciones
│   ├── Privacidad.tsx        # Política de privacidad
│   ├── Envio.tsx             # Información de envío
│   ├── Devoluciones.tsx      # Política de devoluciones
│   ├── FAQ.tsx               # Preguntas frecuentes
│   ├── Contacto.tsx          # Formulario de contacto
│   ├── Auth.tsx              # Login/registro
│   ├── NotFound.tsx          # 404
│   └── admin/                # Panel administrativo
│       ├── AdminLayout.tsx
│       ├── Dashboard.tsx
│       ├── OwnerDashboard.tsx
│       ├── ProductsAdmin.tsx
│       ├── BrandsAdmin.tsx
│       ├── CategoriesAdmin.tsx
│       ├── DropsAdmin.tsx
│       ├── OrdersAdmin.tsx
│       ├── CouponsAdmin.tsx
│       └── CustomersAdmin.tsx
├── components/               # Componentes reutilizables
│   ├── auth/                 # Auth modales
│   ├── cart/                 # Carrito y drawer
│   ├── checkout/             # Componentes de checkout
│   ├── home/                 # Secciones de homepage
│   ├── products/             # Componentes de productos
│   ├── layout/               # Navbar, Footer, Layout
│   ├── ui/                   # Componentes UI base
│   └── cursor/               # Cursor personalizado
├── hooks/                    # Custom React hooks
│   ├── useAuth.ts            # Autenticación
│   ├── useCart.ts            # Carrito de compras
│   ├── useProducts.ts        # Productos
│   ├── useOrders.ts          # Órdenes
│   ├── useWishlist.ts        # Wishlist
│   ├── useDrops.ts           # Drops
│   ├── useHomeContent.ts     # Contenido de homepage
│   ├── useSEO.ts             # Meta tags
│   └── más...
├── stores/                   # Zustand stores
│   ├── authStore.ts          # Estado de autenticación
│   ├── cartStore.ts          # Estado del carrito
│   └── uiStore.ts            # Estado de UI
├── types/                    # TypeScript types
│   ├── database.ts           # Tipos de Supabase
│   ├── product.ts
│   ├── order.ts
│   ├── user.ts
│   └── index.ts
├── lib/                      # Utilidades
│   ├── supabase.ts           # Cliente de Supabase
│   ├── queryClient.ts        # React Query config
│   ├── utils.ts              # Funciones generales
│   ├── animations.ts         # Framer Motion presets
│   └── wompi.ts              # Integración de pagos
├── config/
│   └── constants.ts          # Constantes (número WhatsApp, etc)
├── styles/                   # CSS global
│   ├── globals.css
│   ├── animations.css
│   └── fonts.css
└── App.tsx                   # Router principal

supabase/
├── migrations/               # SQL migrations
│   ├── 001_initial_schema.sql
│   ├── 002_rls_policies.sql
│   ├── 003_functions.sql
│   ├── 004_seed_data.sql
│   ├── 005_homepage_settings.sql
│   ├── 006_fix_rls_and_homepage.sql
│   └── 007_add_homepage_highlight_color.sql
├── functions/               # Edge functions
│   ├── create-order/
│   ├── n8n-trigger/
│   ├── send-email/
│   └── wompi-webhook/
└── seed.sql                 # Datos iniciales

n8n/
└── workflows/               # Automatizaciones n8n
    ├── abandoned-cart.json
    ├── drop-notification.json
    ├── low-stock-alert.json
    ├── order-confirmation.json
    └── weekly-report.json
```

---

## 🚀 Comenzar

### Requisitos
- Node.js 18+
- npm o pnpm
- Cuenta de Supabase (variables de entorno)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/magnusbrandco/Magnus---Store---Web.git
cd Magnus---Store---Web

# Instalar dependencias
npm install

# Crear archivo .env.local
cat > .env.local << EOF
VITE_SUPABASE_URL=tu_url_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
VITE_WOMPI_PUBLIC_KEY=tu_wompi_key
VITE_APP_URL=http://localhost:5173
VITE_OWNER_EMAIL=magnusstore02@gmail.com
EOF
```

### Desarrollo

```bash
# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview

# Lint
npm run lint
```

---

## 🔐 Autenticación & Seguridad

- **Supabase Auth** - Sistema de autenticación robusto
- **Row-Level Security** - RLS en todas las tablas sensibles
- **Owner Detection** - Detección automática de propietario por email
- **Role-based Access** - Admin y Owner con permisos diferentes
- **Secure Session** - Sessions persistentes y seguras

### Variables de Entorno Requeridas
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_WOMPI_PUBLIC_KEY=pub_xxx... (opcional, para pagos)
VITE_APP_URL=http://localhost:5173
VITE_OWNER_EMAIL=tu@email.com
```

---

## 💳 Sistema de Pagos

Actualmente implementado:
- ✅ **WhatsApp Integration** - Redirección a WhatsApp para confirmación de pago

Preparado pero no completamente integrado:
- ⚠️ **Wompi** - API preparada pero sin implementación final
- ⚠️ **Stripe** - Posible integración futura

---

## 📦 Funcionalidades de E-commerce

### Carrito
- Persistencia en localStorage
- Validación de stock
- Actualización de cantidad
- Removal de items

### Órdenes
- Creación desde checkout
- Historial de órdenes del usuario
- Estados (pending, confirmed, shipped, delivered)
- Integración con WhatsApp para confirmación

### Productos
- Variants (tallas, colores, stock)
- Búsqueda y filtros (precio, categoría, marca)
- Productos destacados
- Imágenes con lazy loading

### Wishlist
- Guardar/remover favoritos
- Persistencia
- Vista dedicada

---

## 🎨 Diseño & UX

- **Custom Dark Theme** - Colores personalizados (lime, cyan, etc)
- **Responsive** - Mobile-first design
- **Animaciones** - Transiciones suaves con Framer Motion
- **Custom Cursor** - Cursor personalizado en hover
- **Accessible** - Semántica HTML correcta
- **SEO Optimizado** - Meta tags dinámicos por página

---

## 🔄 Flujo de Compra

```
Explorar → Filtrar → Agregar Carrito → Checkout → Envío → WhatsApp → Confirmación
```

1. Usuario explora productos en Shop
2. Aplica filtros (precio, marca, categoría)
3. Ve detalle y agrega al carrito
4. Procede a checkout
5. Completa formulario de envío
6. Redirección a WhatsApp para confirmación de pago
7. Recibe confirmación y puede ver orden en perfil

---

## 👨‍💼 Panel Administrativo

### Acceso
- Propietario: `/admin` → auto-redirect a `/admin/owner`
- Administradores: `/admin` (con permisos limitados)

### Funcionalidades
| Página | Función |
|--------|---------|
| Dashboard | Editar contenido de homepage, ver métricas |
| Owner Dashboard | Métricas de negocio, acceso directo a gestión |
| Productos | CRUD, variantes, imágenes, stock |
| Marcas | CRUD, upload logo y cover |
| Categorías | CRUD, upload imagen |
| Drops | Crear colecciones limitadas |
| Cupones | CRUD de descuentos |
| Órdenes | Ver y filtrar pedidos |
| Clientes | Lista de usuarios registrados |

---

## 📊 Base de Datos (Supabase)

Tablas principales:
- `profiles` - Datos de usuarios
- `products` - Catálogo de productos
- `product_variants` - Variantes (tallas, colores)
- `brands` - Marcas disponibles
- `categories` - Categorías de productos
- `orders` - Órdenes realizadas
- `order_items` - Items en órdenes
- `carts` - Carritos activos
- `wishlist_items` - Items en wishlist
- `drops` - Drops exclusivos
- `coupons` - Códigos de descuento
- `homepage_settings` - Configuración de página principal

---

## 🧪 Testing

```bash
npm run test          # Ejecutar tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

**Nota**: Carpeta `__tests__` existe en la estructura pero tests aún no están implementados.

---

## 📱 Páginas Principales

### Públicas
- `GET /` - Homepage
- `GET /tienda` - Shop/Catálogo
- `GET /producto/:slug` - Detalle de producto
- `GET /marca/:slug` - Productos de marca
- `GET /categoria/:slug` - Productos de categoría
- `GET /drops` - Colecciones exclusivas
- `GET /buscar?q=...` - Búsqueda
- `GET /favoritos` - Wishlist (requiere auth)
- `GET /checkout` - Checkout (requiere carrito)
- `GET /confirmacion/:id` - Confirmación de orden
- `GET /cuenta` - Perfil de usuario (requiere auth)
- `GET /pedidos` - Historial de órdenes (requiere auth)
- `GET /terminos` - Términos y condiciones
- `GET /privacidad` - Política de privacidad
- `GET /envio` - Información de envío
- `GET /devoluciones` - Política de devoluciones
- `GET /faq` - Preguntas frecuentes
- `GET /contacto` - Formulario de contacto

### Admin
- `GET /admin` - Dashboard principal
- `GET /admin/owner` - Owner dashboard
- `GET /admin/productos` - Gestión de productos
- `GET /admin/marcas` - Gestión de marcas
- `GET /admin/categorias` - Gestión de categorías
- `GET /admin/drops` - Gestión de drops
- `GET /admin/cupones` - Gestión de cupones
- `GET /admin/pedidos` - Gestión de órdenes
- `GET /admin/clientes` - Lista de clientes

---

## 🔗 APIs Integradas

### Supabase
- PostgreSQL queries
- Row-Level Security
- Storage para imágenes
- Autenticación OAuth

### WhatsApp
- Integración en checkout
- Link dinámico con total de pedido
- Formulario de contacto redirige a WhatsApp

### Wompi (Preparado)
- SDK incluido
- Funciones Edge para webhooks
- Aún sin implementación final

### n8n (Opcional)
- Workflows para notificaciones
- Abandonded cart recovery
- Low stock alerts
- Order confirmations
- Weekly reports

---

## 🚨 Estado Actual & Notas

### ✅ Completamente Funcional
- Catálogo de productos con búsqueda y filtros
- Autenticación y perfil de usuario
- Carrito de compras
- Checkout con WhatsApp
- Órdenes y historial
- Wishlist
- Drops exclusivos
- Páginas de información
- Panel administrativo completo
- Owner dashboard
- Homepage editable

### ⚠️ Preparado pero Parcial
- Sistema de pagos (solo WhatsApp, Wompi preparado)
- Integración n8n (workflows creados pero no sincronizados)

### ❌ No Implementado
- Tests automatizados
- Integración de comentarios/reviews
- Chat en vivo
- Sistema de puntos/recompensas
- Multi-idioma
- Analytics/tracking avanzado
- Recomendaciones con IA

---

## 🐛 Conocidos Issues & Mejoras

### Mejoras Sugeridas
1. **Validación de formularios** - Implementar Zod en todos los formularios admin
2. **Manejo de errores** - Error boundaries y toasts globales
3. **Performance** - Code splitting más agresivo
4. **SEO** - XML sitemap dinámico
5. **Seguridad** - Implementar CSRF tokens
6. **Analytics** - Google Analytics o Plausible
7. **Email** - Sistema de notificaciones por email
8. **Pagos** - Completar integración de Wompi/Stripe

---

## 📚 Stack Details

### Versiones Principales
```json
{
  "react": "^19.2.5",
  "typescript": "~6.0.2",
  "vite": "^8.0.10",
  "tailwindcss": "^4.3.0",
  "framer-motion": "^12.38.0",
  "zustand": "^5.0.13",
  "@tanstack/react-query": "^5.100.9"
}
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/feature-name`)
3. Commit tus cambios (`git commit -m 'feat: Add feature'`)
4. Push a la rama (`git push origin feature/feature-name`)
5. Abre un Pull Request

---

## 📄 Licencia

Magnus Store © 2026. Todos los derechos reservados.

---

## 📞 Contacto

**Magnus Store**
- Email: magnusstore02@gmail.com
- WhatsApp: +573216209183
- Instagram: [@magnusbrand.co](https://instagram.com/magnusbrand.co)

---

**Última actualización:** Mayo 2026

