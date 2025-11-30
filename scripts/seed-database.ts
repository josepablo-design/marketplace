/**
 * Seed database with sample data
 * Run with: npx tsx scripts/seed-database.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Artist profiles data
const artists = [
    {
        username: 'abstract_dreams',
        full_name: 'María Soledad Quiroga',
        bio: 'Pintora abstracta contemporánea. Exploro la relación entre color y emoción a través de acrílicos vibrantes.',
        seller_type: 'artist',
        role: 'seller',
    },
    {
        username: 'bronze_sculptor',
        full_name: 'Roberto Carlos Mendez',
        bio: 'Escultor especializado en bronce y cerámica. 15 años de experiencia en arte figurativo.',
        seller_type: 'artist',
        role: 'seller',
    },
    {
        username: 'digital_visions',
        full_name: 'Ana Lucía Ferreira',
        bio: 'Artista digital y diseñadora. Creo mundos surrealistas con tecnología de punta.',
        seller_type: 'artist',
        role: 'seller',
    },
    {
        username: 'lens_poetry',
        full_name: 'Diego Martín Torres',
        bio: 'Fotógrafo de paisajes urbanos y retratos. Capturo la esencia de Buenos Aires.',
        seller_type: 'artist',
        role: 'seller',
    },
    {
        username: 'ink_illustrations',
        full_name: 'Sofía Isabel Romero',
        bio: 'Ilustradora e historietista. Especializada en tinta china y acuarelas.',
        seller_type: 'artist',
        role: 'seller',
    },
];

// Store profiles data
const stores = [
    {
        username: 'luna_jewelry',
        full_name: 'Luna Artesanal',
        bio: 'Joyería artesanal en plata y piedras naturales. Diseños únicos inspirados en la naturaleza.',
        seller_type: 'store',
        role: 'seller',
    },
    {
        username: 'eco_threads',
        full_name: 'EcoThreads',
        bio: 'Moda sustentable y consciente. Ropa de algodón orgánico y tintes naturales.',
        seller_type: 'store',
        role: 'seller',
    },
    {
        username: 'tech_accessories_ba',
        full_name: 'Tech BA',
        bio: 'Accesorios tech premium. Cases, soportes y gadgets de última generación.',
        seller_type: 'store',
        role: 'seller',
    },
    {
        username: 'madera_noble',
        full_name: 'Madera Noble',
        bio: 'Muebles artesanales en madera maciza. Diseño escandinavo con toque argentino.',
        seller_type: 'store',
        role: 'seller',
    },
    {
        username: 'natura_skincare',
        full_name: 'Natura Orgánica',
        bio: 'Cosméticos naturales y veganos. Cuidado de la piel sin químicos nocivos.',
        seller_type: 'store',
        role: 'seller',
    },
];

// Individual sellers for used items
const individuals = [
    { username: 'juan_seller', full_name: 'Juan Pérez', seller_type: 'individual', role: 'seller' },
    { username: 'maria_ventas', full_name: 'María González', seller_type: 'individual', role: 'seller' },
    { username: 'carlos_market', full_name: 'Carlos Rodríguez', seller_type: 'individual', role: 'seller' },
    { username: 'ana_sales', full_name: 'Ana Martínez', seller_type: 'individual', role: 'seller' },
    { username: 'luis_usado', full_name: 'Luis Fernández', seller_type: 'individual', role: 'seller' },
    { username: 'laura_vende', full_name: 'Laura Sánchez', seller_type: 'individual', role: 'seller' },
    { username: 'pablo_marketplace', full_name: 'Pablo López', seller_type: 'individual', role: 'seller' },
    { username: 'sofia_segundamano', full_name: 'Sofía Díaz', seller_type: 'individual', role: 'seller' },
    { username: 'miguel_vendo', full_name: 'Miguel Ruiz', seller_type: 'individual', role: 'seller' },
    { username: 'carolina_usado', full_name: 'Carolina Moreno', seller_type: 'individual', role: 'seller' },
];

// Artist products by category
const artistProducts = {
    abstract_dreams: [
        { title: 'Amanecer Abstracto', category: 'Pinturas', price: 25000, description: 'Acrílico sobre tela 80x100cm. Colores cálidos representando el amanecer.' },
        { title: 'Serie Océano - Pieza 1', category: 'Pinturas', price: 30000, description: 'Acrílico sobre tela 100x120cm. Tonos azules y verdes.' },
        { title: 'Serie Océano - Pieza 2', category: 'Pinturas', price: 30000, description: 'Acrílico sobre tela 100x120cm. Complemento de la serie.' },
        { title: 'Emociones en Rojo', category: 'Pinturas', price: 28000, description: 'Técnica mixta 70x90cm. Explosión de rojos y naranjas.' },
        { title: 'Geometría del Alma', category: 'Pinturas', price: 22000, description: 'Acrílico sobre tela 60x80cm. Formas geométricas abstractas.' },
        { title: 'Print Limitado - Amanecer', category: 'Prints', price: 5000, description: 'Impresión giclée numerada y firmada. 30x40cm.' },
        { title: 'Print Limitado - Océano', category: 'Prints', price: 5000, description: 'Impresión giclée numerada y firmada. 30x40cm.' },
        { title: 'Postal Set Abstracto', category: 'Prints', price: 2000, description: 'Set de 6 postales con diseños originales.' },
        { title: 'Cuaderno de Artista', category: 'Merchandise', price: 3500, description: 'Cuaderno con tapa ilustrada por la artista.' },
        { title: 'Tote Bag Arte', category: 'Merchandise', price: 4000, description: 'Bolsa de tela con diseño exclusivo.' },
        { title: 'Sticker Pack', category: 'Merchandise', price: 1500, description: 'Pack de 10 stickers con diseños abstractos.' },
        { title: 'Mini Pintura 20x30', category: 'Pinturas', price: 12000, description: 'Pequeña obra original perfecta para espacios reducidos.' },
        { title: 'Díptico Moderno', category: 'Pinturas', price: 45000, description: 'Set de 2 pinturas complementarias 70x90cm cada una.' },
        { title: 'Obra Monocromática', category: 'Pinturas', price: 20000, description: 'Acrílico en tonos grises 60x80cm.' },
        { title: 'Textura y Color', category: 'Pinturas', price: 35000, description: 'Técnica mixta con relieve 90x120cm.' },
        { title: 'Print Edición Especial', category: 'Prints', price: 8000, description: 'Impresión de gran formato firmada 50x70cm.' },
    ],
    bronze_sculptor: [
        { title: 'Figura Humana Contemplativa', category: 'Esculturas', price: 75000, description: 'Bronce patinado 40cm altura. Edición limitada 5/10.' },
        { title: 'Torso Femenino', category: 'Esculturas', price: 65000, description: 'Bronce 35cm altura. Estudio anatómico clásico.' },
        { title: 'Manos Entrelazadas', category: 'Esculturas', price: 45000, description: 'Bronce 25cm. Simboliza unión y amor.' },
        { title: 'Busto Masculino', category: 'Esculturas', price: 55000, description: 'Bronce patinado 30cm. Estudio de expresión.' },
        { title: 'Caballo en Movimiento', category: 'Esculturas', price: 85000, description: 'Bronce 50cm largo. Captura la energía del galope.' },
        { title: 'Vasija Cerámica Raku', category: 'Cerámica', price: 15000, description: 'Cerámica hecha a mano técnica raku. Pieza única.' },
        { title: 'Bowl Decorativo', category: 'Cerámica', price: 12000, description: 'Cerámica esmaltada 30cm diámetro.' },
        { title: 'Jarrón Alto', category: 'Cerámica', price: 18000, description: 'Cerámica torneada 45cm altura.' },
        { title: 'Set Tazas Artesanales', category: 'Cerámica', price: 8000, description: 'Set de 4 tazas únicas hechas a mano.' },
        { title: 'Plato Decorativo', category: 'Cerámica', price: 10000, description: 'Cerámica esmaltada 35cm diámetro.' },
        { title: 'Escultura Pequeña - Ave', category: 'Esculturas', price: 35000, description: 'Bronce 20cm. Ave en vuelo.' },
        { title: 'Abstracto Geométrico', category: 'Esculturas', price: 50000, description: 'Bronce 30cm. Formas puras y modernas.' },
        { title: 'Maternidad', category: 'Esculturas', price: 70000, description: 'Bronce 35cm. Madre e hijo.' },
        { title: 'Mini Escultura - Gato', category: 'Esculturas', price: 28000, description: 'Bronce 15cm. Perfecto para escritorio.' },
        { title: 'Relieve Mural', category: 'Esculturas', price: 95000, description: 'Bronce para pared 60x40cm.' },
        { title: 'Cuenco Ritual', category: 'Cerámica', price: 20000, description: 'Cerámica ancestral inspirada en culturas precolombinas.' },
    ],
    digital_visions: [
        { title: 'Cityscape Futurista', category: 'Arte Digital', price: 8000, description: 'Ilustración digital impresa en alta calidad 40x60cm.' },
        { title: 'Retrato Cyberpunk', category: 'Arte Digital', price: 10000, description: 'Arte digital 50x70cm. Estilo neon futurista.' },
        { title: 'Paisaje Surrealista', category: 'Arte Digital', price: 12000, description: 'Impresión giclée 60x80cm. Mundo onírico.' },
        { title: 'Serie Cosmos - Nebulosa', category: 'Arte Digital', price: 9000, description: 'Arte digital 40x60cm. Espacios cósmicos.' },
        { title: 'Serie Cosmos - Galaxia', category: 'Arte Digital', price: 9000, description: 'Arte digital 40x60cm. Profundidad espacial.' },
        { title: 'Criatura Fantástica', category: 'Arte Digital', price: 11000, description: 'Ilustración digital 50x70cm. Diseño de personaje.' },
        { title: 'Arquitectura Imposible', category: 'Arte Digital', price: 10000, description: 'Arte digital 45x65cm. Estructuras surrealistas.' },
        { title: 'NFT Collection Print', category: 'NFT Prints', price: 15000, description: 'Impresión física de NFT con certificado. 50x50cm.' },
        { title: 'Avatar Personalizado', category: 'Comisiones', price: 5000, description: 'Ilustración digital personalizada para uso en redes.' },
        { title: 'Poster Minimalista', category: 'Arte Digital', price: 6000, description: 'Diseño geométrico 30x40cm.' },
        { title: 'Set 3 Prints Abstractos', category: 'Arte Digital', price: 18000, description: 'Tríptico digital 30x40cm cada uno.' },
        { title: 'Fondo de Pantalla Premium', category: 'Digital Downloads', price: 2000, description: 'Archivo digital 4K para múltiples dispositivos.' },
        { title: 'Pack Wallpapers', category: 'Digital Downloads', price: 5000, description: 'Set de 10 fondos de pantalla únicos.' },
        { title: 'Ilustración Sci-Fi', category: 'Arte Digital', price: 13000, description: 'Arte digital 60x90cm. Escenas de ciencia ficción.' },
        { title: 'Retrato Fantasy', category: 'Arte Digital', price: 12000, description: 'Ilustración digital estilo fantasía épica 50x70cm.' },
        { title: 'Concept Art Vehículo', category: 'Arte Digital', price: 14000, description: 'Diseño de vehículo futurista 70x50cm.' },
    ],
    lens_poetry: [
        { title: 'Obelisco al Amanecer', category: 'Fotografía Urbana', price: 18000, description: 'Impresión fine art 60x90cm. Edición limitada 10/25.' },
        { title: 'Caminito en Lluvia', category: 'Fotografía Urbana', price: 16000, description: 'Fotografía impresa 50x75cm. La Boca bajo la lluvia.' },
        { title: 'Subte en Hora Pico', category: 'Fotografía Urbana', price: 15000, description: 'Blanco y negro 40x60cm. Vida cotidiana porteña.' },
        { title: 'Puerto Madero Nocturno', category: 'Fotografía Urbana', price: 20000, description: 'Fotografía de larga exposición 70x100cm.' },
        { title: 'Retrato Urbano #1', category: 'Retratos', price: 12000, description: 'Retrato callejero 40x60cm. Serie documental.' },
        { title: 'Retrato Urbano #2', category: 'Retratos', price: 12000, description: 'Retrato callejero 40x60cm. Serie documental.' },
        { title: 'Retrato Urbano #3', category: 'Retratos', price: 12000, description: 'Retrato callejero 40x60cm. Serie documental.' },
        { title: 'Arquitectura Porteña', category: 'Fotografía Urbana', price: 17000, description: 'Detalles arquitectónicos 50x70cm.' },
        { title: 'Serie Barrios - Palermo', category: 'Fotografía Urbana', price: 16000, description: 'Esencia de Palermo 60x80cm.' },
        { title: 'Serie Barrios - San Telmo', category: 'Fotografía Urbana', price: 16000, description: 'Historia de San Telmo 60x80cm.' },
        { title: 'Mini Print Set', category: 'Fotografía Urbana', price: 8000, description: 'Set de 4 impresiones 20x30cm.' },
        { title: 'Postal Buenos Aires', category: 'Prints', price: 2500, description: 'Set de 8 postales con icónicos de BA.' },
        { title: 'Libro Fotográfico BA', category: 'Libros', price: 25000, description: 'Libro tapa dura con 80 fotografías seleccionadas.' },
        { title: 'Sesión Retrato Estudio', category: 'Servicios', price: 35000, description: 'Sesión de 1 hora + 10 fotos editadas.' },
        { title: 'Atardecer en Rosedal', category: 'Fotografía Urbana', price: 19000, description: 'Naturaleza urbana 70x100cm.' },
        { title: 'Graffiti Arte Urbano', category: 'Fotografía Urbana', price: 14000, description: 'Arte callejero de BA 50x70cm.' },
    ],
    ink_illustrations: [
        { title: 'Ilustración Tinta - Gato', category: 'Ilustraciones', price: 8000, description: 'Tinta china sobre papel 30x40cm. Original enmarcado.' },
        { title: 'Ilustración Tinta - Flora', category: 'Ilustraciones', price: 9000, description: 'Tinta y acuarela 35x50cm. Estudio botánico.' },
        { title: 'Retrato a Tinta', category: 'Ilustraciones', price: 12000, description: 'Tinta china 40x50cm. Retrato expresivo.' },
        { title: 'Miniatura Detallada', category: 'Ilustraciones', price: 6000, description: 'Tinta sobre papel 15x20cm. Nivel de detalle extremo.' },
        { title: 'Serie Fauna - Aves', category: 'Ilustraciones', price: 10000, description: 'Tinta y acuarela 30x40cm.' },
        { title: 'Serie Fauna - Mamíferos', category: 'Ilustraciones', price: 10000, description: 'Tinta y acuarela 30x40cm.' },
        { title: 'Historieta Original', category: 'Cómics', price: 15000, description: 'Página original de cómic 28x43cm.' },
        { title: 'Comic Book Autopublicado', category: 'Cómics', price: 5000, description: 'Historieta completa 32 páginas.' },
        { title: 'Sketchbook Personal', category: 'Libros', price: 12000, description: 'Compilación de bocetos y estudios.' },
        { title: 'Print Ilustración Digital', category: 'Prints', price: 4000, description: 'Impresión de ilustración 30x40cm.' },
        { title: 'Sticker Sheet', category: 'Merchandise', price: 1800, description: 'Hoja de stickers ilustrados.' },
        { title: 'Marcapáginas Set', category: 'Merchandise', price: 1200, description: 'Set de 5 marcapáginas ilustrados.' },
        { title: 'Comisión Ilustración', category: 'Comisiones', price: 8000, description: 'Ilustración personalizada tinta china.' },
        { title: 'Comisión Retrato Mascota', category: 'Comisiones', price: 10000, description: 'Retrato de tu mascota en tinta y acuarela.' },
        { title: 'Paisaje Urbano Tinta', category: 'Ilustraciones', price: 11000, description: 'Paisaje urbano técnica plumilla 40x60cm.' },
        { title: 'Abstracto en Tinta', category: 'Ilustraciones', price: 7000, description: 'Experimentación con tinta 30x40cm.' },
    ],
};

// Store products
const storeProducts = {
    luna_jewelry: [
        { title: 'Collar Luna Creciente', category: 'Collares', price: 8500, description: 'Plata 925 con piedra luna. Diseño único.' },
        { title: 'Aros Largos Obsidiana', category: 'Aros', price: 6000, description: 'Plata 925 con obsidiana negra.' },
        { title: 'Anillo Amatista', category: 'Anillos', price: 12000, description: 'Plata 925 con amatista natural brasileña.' },
        { title: 'Pulsera Cuarzo Rosa', category: 'Pulseras', price: 5500, description: 'Plata con cuentas de cuarzo rosa.' },
        { title: 'Collar Turquesa', category: 'Collares', price: 9500, description: 'Plata 925 con turquesa natural.' },
        { title: 'Set Aros Minimales', category: 'Aros', price: 4500, description: 'Set de 3 pares en plata 925.' },
        { title: 'Anillo Ojo de Tigre', category: 'Anillos', price: 11000, description: 'Plata 925 con ojo de tigre.' },
        { title: 'Gargantilla Choker', category: 'Collares', price: 7000, description: 'Plata 925 estilo contemporáneo.' },
        { title: 'Tobillera Plata', category: 'Tobilleras', price: 5000, description: 'Plata 925 con dijes de luna.' },
        { title: 'Piercing Plata', category: 'Piercings', price: 3500, description: 'Plata quirúrgica hipoalergénica.' },
        { title: 'Collar Ágata', category: 'Collares', price: 10500, description: 'Plata con rodaja de ágata natural.' },
        { title: 'Aros Circulares Grandes', category: 'Aros', price: 5800, description: 'Plata 925 aros tipo argolla.' },
        { title: 'Anillo Lapislázuli', category: 'Anillos', price: 13000, description: 'Plata con lapislázuli afgano.' },
        { title: 'Pulsera Triple Hilo', category: 'Pulseras', price: 6500, description: 'Plata 925 diseño moderno.' },
        { title: 'Colgante Geométrico', category: 'Collares', price: 8000, description: 'Plata 925 diseño geométrico minimal.' },
        { title: 'Set Completo Eventos', category: 'Sets', price: 22000, description: 'Collar, aros y anillo combinados.' },
    ],
    eco_threads: [
        { title: 'Remera Básica Orgánica', category: 'Remeras', price: 4500, description: 'Algodón orgánico certificado. Unisex.' },
        { title: 'Vestido Lino Natural', category: 'Vestidos', price: 12000, description: 'Lino 100% tintes naturales.' },
        { title: 'Pantalón Cargo Sustentable', category: 'Pantalones', price: 9500, description: 'Algodón orgánico estilo cargo.' },
        { title: 'Camisa Oversize', category: 'Camisas', price: 8000, description: 'Algodón orgánico corte amplio.' },
        { title: 'Sweater Lana Merino', category: 'Sweaters', price: 15000, description: 'Lana merino sustentable.' },
        { title: 'Jeans Reciclados', category: 'Pantalones', price: 11000, description: 'Denim de algodón reciclado.' },
        { title: 'Buzo Canguro Eco', category: 'Buzos', price: 10000, description: 'Algodón orgánico frisa premium.' },
        { title: 'Pollera Midi', category: 'Polleras', price: 8500, description: 'Lino natural tintes vegetales.' },
        { title: 'Top Cruzado', category: 'Tops', price: 5000, description: 'Algodón orgánico diseño moderno.' },
        { title: 'Shorts Lino', category: 'Shorts', price: 6500, description: 'Lino natural corte relajado.' },
        { title: 'Chaqueta Denim', category: 'Camperas', price: 16000, description: 'Denim orgánico lavado enzimático.' },
        { title: 'Set Ropa Interior', category: 'Interior', price: 7000, description: 'Algodón orgánico pack x3.' },
        { title: 'Medias Bambú', category: 'Accesorios', price: 2500, description: 'Fibra de bambú pack x5 pares.' },
        { title: 'Gorro Lana', category: 'Accesorios', price: 4000, description: 'Lana merino sustentable.' },
        { title: 'Bufanda Algodón', category: 'Accesorios', price: 5500, description: 'Algodón orgánico tejido artesanal.' },
        { title: 'Tote Bag Lona', category: 'Bolsos', price: 3500, description: 'Lona de algodón reciclado.' },
    ],
    tech_accessories_ba: [
        { title: 'Case iPhone 15 Pro', category: 'Cases', price: 5000, description: 'Silicona premium protección 360°.' },
        { title: 'Case Samsung S24', category: 'Cases', price: 4500, description: 'Silicona premium con soporte.' },
        { title: 'Soporte Laptop Aluminio', category: 'Soportes', price: 8000, description: 'Aluminio anodizado ajustable.' },
        { title: 'Cable USB-C Trenzado', category: 'Cables', price: 2500, description: '2 metros trenzado resistente.' },
        { title: 'Cargador Rápido 65W', category: 'Cargadores', price: 9500, description: 'GaN technology 3 puertos.' },
        { title: 'Mouse Pad  XXL', category: 'Accesorios', price: 3500, description: '90x40cm base antideslizante.' },
        { title: 'Webcam Full HD', category: 'Cámaras', price: 15000, description: '1080p 60fps con micrófono.' },
        { title: 'Hub USB-C 7 en 1', category: 'Hubs', price: 12000, description: 'HDMI, USB 3.0, lector SD.' },
        { title: 'Auriculares TWS Pro', category: 'Audio', price: 18000, description: 'Cancelación de ruido activa.' },
        { title: 'Teclado Mecánico RGB', category: 'Teclados', price: 25000, description: 'Switches blue retroiluminado.' },
        { title: 'Power Bank 20000mAh', category: 'Baterías', price: 11000, description: 'Carga rápida dual port.' },
        { title: 'Soporte Celular Auto', category: 'Soportes', price: 4000, description: 'Magnético ventilación aire.' },
        { title: 'Lámpara LED Escritorio', category: 'Iluminación', price: 7500, description: 'Temperatura ajustable USB.' },
        { title: 'Protector Pantalla Vidrio', category: 'Protectores', price: 2000, description: 'Vidrio templado 9H.' },
        { title: 'Adaptador HDMI 4K', category: 'Adaptadores', price: 3500, description: 'USB-C a HDMI 4K 60Hz.' },
        { title: 'Ring Light Portátil', category: 'Iluminación', price: 9000, description: '10" con trípode.' },
    ],
    madera_noble: [
        { title: 'Mesa Auxiliar Roble', category: 'Mesas', price: 45000, description: 'Roble macizo 50x50x60cm.' },
        { title: 'Estantería Minimalista', category: 'Estanterías', price: 65000, description: 'Pino tea 120x180cm 5 estantes.' },
        { title: 'Silla Nórdica', category: 'Sillas', price: 35000, description: 'Fresno con asiento tapizado.' },
        { title: 'Mesa Comedor 6 Personas', category: 'Mesas', price: 120000, description: 'Lapacho 180x90cm.' },
        { title: 'Escritorio Home Office', category: 'Escritorios', price: 75000, description: 'Guatambú 140x70cm cajón.' },
        { title: 'Repisa Flotante', category: 'Repisas', price: 12000, description: 'Petiribi 80cm soporte oculto.' },
        { title: 'Banco Alto Cocina', category: 'Bancos', price: 28000, description: 'Roble macizo altura 75cm.' },
        { title: 'Mesa de Luz', category: 'Mesas', price: 22000, description: 'Incienso 40x40x50cm.' },
        { title: 'Perchero de Pie', category: 'Percheros', price: 18000, description: 'Pino tea 175cm altura.' },
        { title: 'Marco Espejo Madera', category: 'Espejos', price: 15000, description: 'Cedro 60x80cm.' },
        { title: 'Organizador Escritorio', category: 'Accesorios', price: 8000, description: 'Roble compartimentos múltiples.' },
        { title: 'Tabla Picada Grande', category: 'Cocina', price: 6500, description: 'Algarrobo 50x30cm.' },
        { title: 'Set Tablas x3', category: 'Cocina', price: 12000, description: 'Distintos tamaños acacia.' },
        { title: 'Macetero de Pie', category: 'Jardín', price: 9500, description: 'Pino tea tratado altura 80cm.' },
        { title: 'Librero Modular', category: 'Estanterías', price: 85000, description: 'Petiribi 200x150cm personalizable.' },
        { title: 'Caja Organizadora', category: 'Accesorios', price: 5000, description: 'Pino con tapa 30x20x15cm.' },
    ],
    natura_skincare: [
        { title: 'Crema Facial Antiarrugas', category: 'Rostro', price: 4500, description: 'Ácido hialurónico y vitamina E. 50ml.' },
        { title: 'Serum Vitamina C', category: 'Rostro', price: 5500, description: '20% vitamina C pura. 30ml.' },
        { title: 'Limpiador Facial Suave', category: 'Rostro', price: 3200, description: 'Extractos naturales sin sulfatos. 150ml.' },
        { title: 'Tónico Rosas', category: 'Rostro', price: 3500, description: 'Agua de rosas búlgaras. 200ml.' },
        { title: 'Crema Corporal Almendras', category: 'Cuerpo', price: 4000, description: 'Aceite de almendras dulces. 250ml.' },
        { title: 'Exfoliante Café', category: 'Cuerpo', price: 3800, description: 'Café orgánico y aceite de coco. 200g.' },
        { title: 'Jabón Artesanal Lavanda', category: 'Jabones', price: 1500, description: 'Aceites esenciales prensado frío.' },
        { title: 'Set Jabones x5', category: 'Jabones', price: 6000, description: 'Variedad de aromas naturales.' },
        { title: 'Shampoo Sólido Natural', category: 'Cabello', price: 2800, description: 'Sin sulfatos ni parabenos. 80g.' },
        { title: 'Acondicionador Argán', category: 'Cabello', price: 4200, description: 'Aceite de argán marroquí. 250ml.' },
        { title: 'Mascarilla Capilar', category: 'Cabello', price: 5000, description: 'Tratamiento intensivo natural. 200ml.' },
        { title: 'Aceite Corporal Coco', category: 'Cuerpo', price: 3500, description: 'Aceite de coco virgen. 100ml.' },
        { title: 'Bálsamo Labial Natural', category: 'Labios', price: 1200, description: 'Cera de abejas y miel. 10g.' },
        { title: 'Desodorante Natural', category: 'Cuerpo', price: 2500, description: 'Sin aluminio bicarbonato. 60g.' },
        { title: 'Contorno de Ojos', category: 'Rostro', price: 4800, description: 'Cafeína y péptidos naturales. 15ml.' },
        { title: 'Kit Facial Completo', category: 'Sets', price: 18000, description: 'Rutina completa 5 productos.' },
    ],
};

// Used products across diverse categories
const usedProducts = [
    { seller: 'juan_seller', title: 'iPhone 12 64GB', category: 'Electrónica', price: 180000, condition: 'good', description: 'Usado 1 año, batería 87%, sin rayones.' },
    { seller: 'maria_ventas', title: 'Laptop HP i5 8GB RAM', category: 'Electrónica', price: 150000, condition: 'good', description: 'Funcionando perfecto, algunos detalles estéticos.' },
    { seller: 'carlos_market', title: 'PlayStation 5', category: 'Gaming', price: 250000, condition: 'like_new', description: 'Comprada hace 6 meses, impecable con caja.' },
    { seller: 'ana_sales', title: 'Bicicleta Montaña', category: 'Deportes', price: 85000, condition: 'good', description: 'Rodado 29, cambios Shimano, bien cuidada.' },
    { seller: 'luis_usado', title: 'Silla Gamer', category: 'Muebles', price: 35000, condition: 'good', description: 'Reclinable, apoyabrazos ajustables.' },
    { seller: 'laura_vende', title: 'Cafetera Nespresso', category: 'Electrodomésticos', price: 25000, condition: 'like_new', description: 'Poco uso, funciona perfecto.' },
    { seller: 'pablo_marketplace', title: 'Smart TV 50" Samsung', category: 'Electrónica', price: 120000, condition: 'good', description: '4K, funciona bien, control incluido.' },
    { seller: 'sofia_segundamano', title: 'Campera Cuero', category: 'Ropa', price: 15000, condition: 'good', description: 'Talle M, cuero genuino.' },
    { seller: 'miguel_vendo', title: 'Zapatillas Nike Air Max', category: 'Calzado', price: 22000, condition: 'like_new', description: 'Talle 42, usadas 3 veces.' },
    { seller: 'carolina_usado', title: 'Kindle Paperwhite', category: 'Libros', price: 35000, condition: 'like_new', description: '8GB, sin rayones, con funda.' },
    { seller: 'juan_seller', title: 'Auriculares Sony WH-1000XM4', category: 'Audio', price: 80000, condition: 'good', description: 'Cancelación ruido, funcionan perfecto.' },
    { seller: 'maria_ventas', title: 'iPad Air 2020', category: 'Electrónica', price: 140000, condition: 'like_new', description: '64GB WiFi, con Apple Pencil.' },
    { seller: 'carlos_market', title: 'Mueble TV Moderno', category: 'Muebles', price: 28000, condition: 'good', description: 'Melamina 120cm, como nuevo.' },
    { seller: 'ana_sales', title: 'Guitarra Acústica Yamaha', category: 'Instrumentos', price: 45000, condition: 'good', description: 'Modelo C40, ideal principiantes.' },
    { selector: 'luis_usado', title: 'Heladera Gafa 330L', category: 'Electrodomésticos', price: 95000, condition: 'good', description: 'Funciona perfecto, 3 años uso.' },
    { seller: 'laura_vende', title: 'Colchón Sommier 2 Plazas', category: 'Muebles', price: 65000, condition: 'good', description: 'Piero 1.40x1.90, buen estado.' },
    { seller: 'pablo_marketplace', title: 'Drone DJI Mini 2', category: 'Electrónica', price: 110000, condition: 'like_new', description: 'Poco uso, con case y baterías extra.' },
    { seller: 'sofia_segundamano', title: 'Reloj Casio G-Shock', category: 'Accesorios', price: 18000, condition: 'good', description: 'Original, funcionando perfecto.' },
    { seller: 'miguel_vendo', title: 'Longboard Completo', category: 'Deportes', price: 12000, condition: 'fair', description: 'Tabla con detalles, ruedas nuevas.' },
    { seller: 'carolina_usado', title: 'Cámara Canon EOS M50', category: 'Fotografía', price: 180000, condition: 'like_new', description: 'Con lente 15-45mm, como nueva.' },
    { seller: 'juan_seller', title: 'Escritorio L-Shape', category: 'Muebles', price: 32000, condition: 'good', description: 'Ideal home office, 150x150cm.' },
    { seller: 'maria_ventas', title: 'Juego de Living', category: 'Muebles', price: 120000, condition: 'good', description: 'Sillón 3 cuerpos + 2 individuales.' },
    { seller: 'carlos_market', title: 'Parrilla Eléctrica', category: 'Electrodomésticos', price: 15000, condition: 'like_new', description: 'Liliana, usada 2 veces.' },
    { seller: 'ana_sales', title: 'Cinta Correr Plegable', category: 'Deportes', price: 75000, condition: 'good', description: 'Digital, velocidad variable.' },
    { seller: 'luis_usado', title: 'Vinilo The Beatles', category: 'Música', price: 8000, condition: 'good', description: 'Abbey Road, disco en buen estado.' },
    { seller: 'laura_vende', title: 'Libros Harry Potter Set', category: 'Libros', price: 20000, condition: 'good', description: 'Saga completa tapa dura español.' },
    { seller: 'pablo_marketplace', title: 'Monitor 27" LG', category: 'Electrónica', price: 65000, condition: 'like_new', description: 'Full HD IPS 75Hz.' },
    { seller: 'sofia_segundamano', title: 'Cartera Michael Kors', category: 'Accesorios', price: 35000, condition: 'good', description: 'Original, cuero genuino.' },
    { seller: 'miguel_vendo', title: 'Xbox Series S', category: 'Gaming', price: 140000, condition: 'like_new', description: '512GB, con 2 joysticks.' },
    { seller: 'carolina_usado', title: 'Freidora Aire 5L', category: 'Electrodomésticos', price: 28000, condition: 'like_new', description: 'Philips, poco uso.' },
    { seller: 'juan_seller', title: 'Mochila North Face', category: 'Accesorios', price: 18000, condition: 'good', description: '40L trekking, impermeable.' },
    { seller: 'maria_ventas', title: 'Plancha Pelo GHD', category: 'Belleza', price: 45000, condition: 'good', description: 'Profesional, funciona perfecto.' },
    { seller: 'carlos_market', title: 'Lámpara Pie Moderna', category: 'Iluminación', price: 12000, condition: 'like_new', description: 'Trípode madera, pantalla lino.' },
    { seller: 'ana_sales', title: 'Set Pesas Hexagonales', category: 'Deportes', price: 25000, condition: 'good', description: 'Pares de 5, 8 y 10kg.' },
    { seller: 'luis_usado', title: 'Alfombra Persa 2x3m', category: 'Decoración', price: 55000, condition: 'good', description: 'Hecha a mano, colores vivos.' },
    { seller: 'laura_vende', title: 'Microondas Samsung', category: 'Electrodomésticos', price: 22000, condition: 'good', description: '28L, funciona bien.' },
    { seller: 'pablo_marketplace', title: 'Teclado MIDI 61 Teclas', category: 'Instrumentos', price: 35000, condition: 'like_new', description: 'M-Audio con software.' },
    { seller: 'sofia_segundamano', title: 'Botas Dr Martens', category: 'Calzado', price: 28000, condition: 'good', description: 'Talle 39, cuero genuino.' },
    { seller: 'miguel_vendo', title: 'Router Mesh TP-Link', category: 'Electrónica', price: 18000, condition: 'like_new', description: 'Sistema 2 nodos, WiFi 6.' },
    { seller: 'carolina_usado', title: 'Cuadros Decorativos Set', category: 'Decoración', price: 8000, condition: 'like_new', description: 'Set de 3 modernos minimalistas.' },
    { seller: 'juan_seller', title: 'Batidora KitchenAid', category: 'Electrodomésticos', price: 75000, condition: 'good', description: 'Planetaria 4.8L, accesorios.' },
    { seller: 'maria_ventas', title: 'Parlante JBL Charge 5', category: 'Audio', price: 35000, condition: 'like_new', description: 'Bluetooth impermeable.' },
    { seller: 'carlos_market', title: 'Mesa Plegable Camping', category: 'Camping', price: 8500, condition: 'good', description: 'Aluminio para 6 personas.' },
    { seller: 'ana_sales', title: 'Patines Rollers Adulto', category: 'Deportes', price: 15000, condition: 'good', description: 'Talle 42, rulemanes ABEC 7.' },
    { seller: 'luis_usado', title: 'Enciclopedia Britannica', category: 'Libros', price: 12000, condition: 'fair', description: 'Edición completa 30 tomos.' },
    { seller: 'laura_vende', title: 'Ventilador de Pie', category: 'Electrodomésticos', price: 10000, condition: 'good', description: 'Liliana 20", potente.' },
    { seller: 'pablo_marketplace', title: 'Skate Completo Element', category: 'Deportes', price: 18000, condition: 'good', description: 'Tabla 8", trucks independents.' },
    { seller: 'sofia_segundamano', title: 'Carpa 4 Personas', category: 'Camping', price: 22000, condition: 'like_new', description: 'Doite, impermeable.' },
    { seller: 'miguel_vendo', title: 'Proyector Epson', category: 'Electrónica', price: 95000, condition: 'good', description: 'Full HD 3000 lúmenes.' },
    { seller: 'carolina_usado', title: 'Set Ollas Tramontina', category: 'Cocina', price: 18000, condition: 'like_new', description: 'Acero inox 5 piezas.' },
];

async function seedDatabase() {
    console.log('🌱 Starting database seed...\n');

    try {
        // Create all profiles (artists, stores, individuals)
        console.log('Creating artist profiles...');
        const artistProfiles: any[] = [];
        for (const artist of artists) {
            // Create a dummy user email for testing
            const email = `${artist.username}@marketplace-demo.com`;
            const password = 'Demo123456!'; // For testing only

            // Sign up the user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: artist.full_name,
                    },
                },
            });

            if (authError) {
                console.error(`Error creating artist ${artist.username}:`, authError.message);
                continue;
            }

            if (authData.user) {
                // Update profile with additional info
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        username: artist.username,
                        bio: artist.bio,
                        seller_type: artist.seller_type,
                        role: artist.role,
                    })
                    .eq('id', authData.user.id)
                    .select()
                    .single();

                if (!profileError && profileData) {
                    artistProfiles.push(profileData);
                    console.log(`✓ Created artist: ${artist.full_name}`);
                }
            }

            // Wait a bit to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log(`\nCreated ${artistProfiles.length} artist profiles\n`);

        // Create store profiles
        console.log('Creating store profiles...');
        const storeProfiles: any[] = [];
        for (const store of stores) {
            const email = `${store.username}@marketplace-demo.com`;
            const password = 'Demo123456!';

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: store.full_name,
                    },
                },
            });

            if (authError) {
                console.error(`Error creating store ${store.username}:`, authError.message);
                continue;
            }

            if (authData.user) {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        username: store.username,
                        bio: store.bio,
                        seller_type: store.seller_type,
                        role: store.role,
                    })
                    .eq('id', authData.user.id)
                    .select()
                    .single();

                if (!profileError && profileData) {
                    storeProfiles.push(profileData);
                    console.log(`✓ Created store: ${store.full_name}`);
                }
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log(`\nCreated ${storeProfiles.length} store profiles\n`);

        // Create individual seller profiles
        console.log('Creating individual seller profiles...');
        const individualProfiles: any[] = [];
        for (const individual of individuals) {
            const email = `${individual.username}@marketplace-demo.com`;
            const password = 'Demo123456!';

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: individual.full_name,
                    },
                },
            });

            if (authError) {
                console.error(`Error creating individual ${individual.username}:`, authError.message);
                continue;
            }

            if (authData.user) {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        username: individual.username,
                        seller_type: individual.seller_type,
                        role: individual.role,
                    })
                    .eq('id', authData.user.id)
                    .select()
                    .single();

                if (!profileError && profileData) {
                    individualProfiles.push(profileData);
                    console.log(`✓ Created individual: ${individual.full_name}`);
                }
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log(`\nCreated ${individualProfiles.length} individual seller profiles\n`);

        // Create products for each artist
        console.log('Creating artist products...');
        let totalProducts = 0;
        for (const profile of artistProfiles) {
            const username = profile.username;
            const products = (artistProducts as any)[username];

            if (products) {
                for (const product of products) {
                    const { error } = await supabase.from('products').insert({
                        seller_id: profile.id,
                        title: product.title,
                        description: product.description,
                        price: product.price,
                        category: product.category,
                        condition: 'new',
                        status: 'active',
                        currency: 'ARS',
                        images: [`https://placehold.co/600x600/random/white?text=${encodeURIComponent(product.title)}`],
                    });

                    if (error) {
                        console.error(`Error creating product ${product.title}:`, error.message);
                    } else {
                        totalProducts++;
                    }
                }
                console.log(`✓ Created ${products.length} products for ${profile.full_name}`);
            }
        }

        // Create products for each store
        console.log('\nCreating store products...');
        for (const profile of storeProfiles) {
            const username = profile.username;
            const products = (storeProducts as any)[username];

            if (products) {
                for (const product of products) {
                    const { error } = await supabase.from('products').insert({
                        seller_id: profile.id,
                        title: product.title,
                        description: product.description,
                        price: product.price,
                        category: product.category,
                        condition: 'new',
                        status: 'active',
                        currency: 'ARS',
                        images: [`https://placehold.co/600x600/random/white?text=${encodeURIComponent(product.title)}`],
                    });

                    if (error) {
                        console.error(`Error creating product ${product.title}:`, error.message);
                    } else {
                        totalProducts++;
                    }
                }
                console.log(`✓ Created ${products.length} products for ${profile.full_name}`);
            }
        }

        // Create used products
        console.log('\nCreating used products...');
        for (const usedProduct of usedProducts) {
            const seller = individualProfiles.find(p => p.username === usedProduct.seller);

            if (seller) {
                const { error } = await supabase.from('products').insert({
                    seller_id: seller.id,
                    title: usedProduct.title,
                    description: usedProduct.description,
                    price: usedProduct.price,
                    category: usedProduct.category,
                    condition: usedProduct.condition,
                    status: 'active',
                    currency: 'ARS',
                    images: [`https://placehold.co/600x600/random/white?text=${encodeURIComponent(usedProduct.title)}`],
                });

                if (error) {
                    console.error(`Error creating used product ${usedProduct.title}:`, error.message);
                } else {
                    totalProducts++;
                }
            }
        }

        console.log(`✓ Created ${usedProducts.length} used products\n`);

        console.log('🎉 Seed completed successfully!');
        console.log(`\nSummary:`);
        console.log(`- ${artistProfiles.length} artists`);
        console.log(`- ${storeProfiles.length} stores`);
        console.log(`- ${individualProfiles.length} individual sellers`);
        console.log(`- ${totalProducts} total products`);
        console.log(`\n📝 All accounts use password: Demo123456!`);

    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

// Run the seed
seedDatabase();
