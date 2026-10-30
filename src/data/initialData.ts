import { Category, Product, StreamingAccount, Order, Client, BusinessSettings, AdminUser, WarrantyClaim } from '../types';

export const INITIAL_SETTINGS: BusinessSettings = {
  id: 'business_jenyx',
  businessName: 'JENYX',
  motto: 'Tu mundo digital, a tu estilo.',
  logoUrl: '/assets/aistudio/jenix_4fac0935.jpeg',
  primaryColor: '#FF2E93',
  accentSoftColor: '#FF8CC6',
  wineColor: '#7A1236',
  currency: 'MXN',
  whatsappSupport: '+525587654321',
  announcement: '✦ ¡Promoción de temporada neón! 20% de descuento en perfiles semestrales ✦',
  payment: {
    bank: 'BBVA México',
    clabe: '012180015948372619',
    beneficiary: 'JENYX DIGITAL SERVICES',
    oxxoCardNumber: '4152 3138 9845 2314',
    oxxoBeneficiary: 'Jenyx Tienda Digital',
    whatsappSupportNumber: '+525587654321',
    instructions: 'Transfiere el monto exacto o deposita en OXXO. Toma captura o foto clara del comprobante donde se aprecie la referencia y adjúntala al finalizar tu compra o en el seguimiento de pedido.'
  },
  adminPin: '2026',
  vaultMasterPin: '7799'
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-netflix',
    name: 'Netflix 4K Ultra HD',
    slug: 'netflix',
    iconName: 'Tv',
    color: '#E50914',
    description: 'Películas, series y documentales ilimitados en máxima resolución 4K HDR con audio espacial.',
    active: true,
    order: 1
  },
  {
    id: 'cat-disney',
    name: 'Disney+ / Star+',
    slug: 'disney-plus',
    iconName: 'Sparkles',
    color: '#0063E5',
    description: 'Disney, Pixar, Marvel, Star Wars, National Geographic y deportes en vivo ESPN.',
    active: true,
    order: 2
  },
  {
    id: 'cat-max',
    name: 'Max (HBO)',
    slug: 'max-hbo',
    iconName: 'Film',
    color: '#002BE7',
    description: 'El hogar de HBO, Warner Bros, Cartoon Network y el Universo DC sin límites.',
    active: true,
    order: 3
  },
  {
    id: 'cat-prime',
    name: 'Prime Video',
    slug: 'prime-video',
    iconName: 'PlayCircle',
    color: '#00A8E1',
    description: 'Amazon Originals, estrenos de cine y series exclusivas en Full HD y 4K.',
    active: true,
    order: 4
  },
  {
    id: 'cat-spotify',
    name: 'Spotify Premium',
    slug: 'spotify',
    iconName: 'Music',
    color: '#1DB954',
    description: 'Música sin anuncios, descargas offline y calidad de sonido extrema para todos tus dispositivos.',
    active: true,
    order: 5
  },
  {
    id: 'cat-youtube',
    name: 'YouTube Premium',
    slug: 'youtube',
    iconName: 'Video',
    color: '#FF0000',
    description: 'YouTube y YouTube Music sin anuncios, en segundo plano y con descargas.',
    active: true,
    order: 6
  },
  {
    id: 'cat-crunchyroll',
    name: 'Crunchyroll Mega Fan',
    slug: 'crunchyroll',
    iconName: 'Flame',
    color: '#F47521',
    description: 'El catálogo de anime más grande del mundo, episodios simulcast y sin anuncios.',
    active: true,
    order: 7
  },
  {
    id: 'cat-paramount',
    name: 'Paramount+',
    slug: 'paramount',
    iconName: 'Compass',
    color: '#0064FF',
    description: 'Películas taquilleras, series exclusivas y la Premier League en directo.',
    active: true,
    order: 8
  },
  {
    id: 'cat-digital',
    name: 'Métodos, APKs & Drive',
    slug: 'digital-apks',
    iconName: 'FolderDown',
    color: '#FF2E93',
    description: 'Archivos Google Drive VIP, APKs premium para Smart TV y Android, y métodos de facturación.',
    active: true,
    order: 9
  },
  {
    id: 'cat-tramites',
    name: 'Trámites Digitales',
    slug: 'tramites',
    iconName: 'FileCheck',
    color: '#3DDC97',
    description: 'Constancias de Situación Fiscal (SAT), RFC, Actas de Nacimiento certificadas y CURP.',
    active: true,
    order: 10
  },
  {
    id: 'cat-recargas',
    name: 'Recargas Telefónicas',
    slug: 'recargas',
    iconName: 'Smartphone',
    color: '#FFB020',
    description: 'Recargas de saldo y paquetes de datos para Telcel, Movistar, AT&T y Bait con entrega instantánea.',
    active: true,
    order: 11
  },
  {
    id: 'cat-diamantes',
    name: 'Diamantes & Videojuegos',
    slug: 'diamantes',
    iconName: 'Gamepad2',
    color: '#00F0FF',
    description: 'Recargas directas de Diamantes Free Fire por ID, Robux para Roblox y pases de batalla.',
    active: true,
    order: 12
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-netflix-p1',
    categoryId: 'cat-netflix',
    categoryName: 'Netflix 4K Ultra HD',
    name: 'Netflix 4K - Perfil Privado (1 Mes)',
    type: 'perfil',
    duration: '1 Mes',
    price: 65,
    originalPrice: 85,
    description: 'Perfil individual garantizado en cuenta Ultra HD. Puedes colocar tu propio nombre y PIN de seguridad. Soporta 1 pantalla simultánea en 4K UHD.',
    features: ['1 Pantalla exclusiva', 'Calidad 4K UHD + HDR', 'PIN personalizable', 'Renovación mensual sin perder historial', 'Garantía JENYX 30 días'],
    badge: 'Más Vendido ✦',
    active: true
  },
  {
    id: 'prod-netflix-c1',
    categoryId: 'cat-netflix',
    categoryName: 'Netflix 4K Ultra HD',
    name: 'Netflix 4K - Cuenta Completa Familiar',
    type: 'cuenta_completa',
    duration: '1 Mes',
    price: 219,
    originalPrice: 280,
    description: 'Cuenta completa privada con 5 perfiles para toda tu familia. Acceso con correo y contraseña exclusivos tuyos.',
    features: ['5 Perfiles independientes', '4 Pantallas simultáneas', 'Control total de contraseña', 'Sin caídas garantizado'],
    badge: 'Familiar VIP',
    active: true
  },
  {
    id: 'prod-disney-p1',
    categoryId: 'cat-disney',
    categoryName: 'Disney+ / Star+',
    name: 'Disney+ Estándar - Perfil Privado',
    type: 'perfil',
    duration: '1 Mes',
    price: 49,
    originalPrice: 69,
    description: 'Perfil personal con PIN para disfrutar de todo el contenido de Disney, Pixar, Marvel y Star Wars.',
    features: ['1 Pantalla personal', 'Calidad Full HD', 'Descargas offline', 'Garantía 30 días'],
    badge: 'Popular',
    active: true
  },
  {
    id: 'prod-max-p1',
    categoryId: 'cat-max',
    categoryName: 'Max (HBO)',
    name: 'Max Platino - Perfil Privado (1 Mes)',
    type: 'perfil',
    duration: '1 Mes',
    price: 55,
    originalPrice: 75,
    description: 'Perfil privado con PIN para ver La Casa del Dragón, The Last of Us y estrenos del cine en 4K.',
    features: ['1 Pantalla privada', 'Calidad 4K UHD + Dolby Atmos', 'PIN personal', 'Soporte 24/7'],
    badge: 'Recomendado',
    active: true
  },
  {
    id: 'prod-prime-p1',
    categoryId: 'cat-prime',
    categoryName: 'Prime Video',
    name: 'Prime Video - Perfil Personal (1 Mes)',
    type: 'perfil',
    duration: '1 Mes',
    price: 45,
    originalPrice: 60,
    description: 'Acceso a todo el catálogo Prime Video en alta definición. Perfil exclusivo con tu nombre.',
    features: ['1 Pantalla privada', 'Full HD y 4K', 'Sin interrupciones', 'Entrega inmediata'],
    badge: 'Económico',
    active: true
  },
  {
    id: 'prod-spotify-c1',
    categoryId: 'cat-spotify',
    categoryName: 'Spotify Premium',
    name: 'Spotify Premium Individual (3 Meses)',
    type: 'cuenta_completa',
    duration: '3 Meses',
    price: 135,
    originalPrice: 195,
    description: 'Cuenta propia o renovación a tu cuenta de Spotify Premium. Música sin límites ni anuncios por 90 días.',
    features: ['90 Días de música sin anuncios', 'Descargas ilimitadas', 'Audio 320kbps máxima fidelidad', 'Garantía total'],
    badge: 'Super Ahorro ✦',
    active: true
  },
  {
    id: 'prod-crunchy-p1',
    categoryId: 'cat-crunchyroll',
    categoryName: 'Crunchyroll Mega Fan',
    name: 'Crunchyroll Mega Fan - Perfil (1 Mes)',
    type: 'perfil',
    duration: '1 Mes',
    price: 39,
    originalPrice: 55,
    description: 'Visualización sin anuncios de los animes de estreno 1 hora después de Japón.',
    features: ['Sin anuncios', 'Simulcast al día', 'Calidad 1080p', 'Garantía JENYX'],
    badge: 'Otaku Choice',
    active: true
  },
  {
    id: 'prod-youtube-c1',
    categoryId: 'cat-youtube',
    categoryName: 'YouTube Premium',
    name: 'YouTube Premium Familiar (1 Mes)',
    type: 'cuenta_completa',
    duration: '1 Mes',
    price: 79,
    originalPrice: 109,
    description: 'Invitación a grupo familiar oficial o cuenta completa para YouTube y YouTube Music sin cortes.',
    features: ['YouTube sin anuncios', 'Reproducción en segundo plano', 'YouTube Music Premium', 'Descarga de videos'],
    badge: 'Top Audio/Video',
    active: true
  },
  {
    id: 'prod-apk-magis',
    categoryId: 'cat-digital',
    categoryName: 'Métodos, APKs & Drive',
    name: 'MagisTV Pro 4K + Tele Latino (APK Premium Android & Fire TV)',
    type: 'digital',
    itemCategory: 'apk',
    duration: 'Permanente / Sin Anuncios',
    price: 99,
    originalPrice: 150,
    description: 'Aplicación APK modificada sin publicidad con más de 1,200 canales en vivo en resolución Full HD y 4K, películas de estreno y series. Compatible con Smart TV, TV Box, FireStick y celulares Android.',
    features: ['1,200+ Canales en vivo HD/4K', 'Deportes premium en vivo sin cortes', 'Instalación fácil en Android / Fire TV', 'Guía de instalación en video y soporte'],
    badge: 'APK Premium ✦',
    active: true,
    downloadUrl: 'https://drive.google.com/drive/folders/jenyx-magistv-vip-apk',
    guideInstructions: 'Descarga el archivo APK en tu Smart TV o FireStick usando la app Downloader con el código provisto tras la compra.',
    version: 'v5.4.2 Pro'
  },
  {
    id: 'prod-drive-cine',
    categoryId: 'cat-digital',
    categoryName: 'Métodos, APKs & Drive',
    name: 'Google Drive VIP: Mega Colección Cine 4K & Series Completas',
    type: 'digital',
    itemCategory: 'drive',
    duration: 'Acceso Vitalicio',
    price: 129,
    originalPrice: 199,
    description: 'Acceso directo a carpeta privada de Google Drive con más de 6 Terabytes de contenido cinematográfico en máxima calidad 4K UHD Remux, series completas y sagas.',
    features: ['Más de 6 TB de almacenamiento', 'Descargas directas a máxima velocidad', 'Acceso directo con tu correo Gmail', 'Actualizaciones semanales con nuevos estrenos'],
    badge: 'Mega Drive ✦',
    active: true,
    downloadUrl: 'https://drive.google.com/drive/folders/jenyx-coleccion-cine-4k-vip',
    guideInstructions: 'Se comparte acceso como lector/descargador a tu correo Gmail ingresado al momento de la compra.'
  },
  {
    id: 'prod-metodo-vip',
    categoryId: 'cat-digital',
    categoryName: 'Métodos, APKs & Drive',
    name: 'Método Secreto: Creación de Cuentas Streaming 2026',
    type: 'digital',
    itemCategory: 'metodo',
    duration: 'Guía PDF + Asesoría',
    price: 169,
    originalPrice: 250,
    description: 'Guía paso a paso en PDF con capturas reales y pasarelas de pago para crear cuentas de streaming sin que se caigan. Incluye grupo de soporte privado.',
    features: ['Guía completa en PDF ilustrada', 'Técnicas anti-geobloqueo y anti-caídas', 'Lista de BINs y pasarelas actualizadas', 'Acceso a canal VIP de WhatsApp'],
    badge: 'Método Exclusivo',
    active: true,
    downloadUrl: 'https://drive.google.com/file/d/jenyx-metodo-streaming-2026-vip/view',
    guideInstructions: 'Abre el PDF con cualquier lector y sigue las instrucciones para unirte al grupo VIP de soporte.'
  },
  {
    id: 'prod-tramite-sat',
    categoryId: 'cat-tramites',
    categoryName: 'Trámites Digitales',
    name: 'Constancia de Situación Fiscal SAT (Entrega Express)',
    type: 'digital',
    itemCategory: 'metodo',
    duration: 'Entrega en 10 min',
    price: 60,
    originalPrice: 90,
    description: 'Generación y envío express de tu Constancia de Situación Fiscal actualizada con RFC y código QR oficial, lista para imprimir o presentar en tu trabajo.',
    features: ['Documento oficial 100% válido', 'Código QR verificable ante el SAT', 'Envío inmediato en PDF a tu WhatsApp', 'Sin filas ni citas engorrosas'],
    badge: 'Express ✦',
    active: true
  },
  {
    id: 'prod-tramite-acta',
    categoryId: 'cat-tramites',
    categoryName: 'Trámites Digitales',
    name: 'Acta de Nacimiento Certificada Oficial (PDF Validez Nacional)',
    type: 'digital',
    itemCategory: 'metodo',
    duration: 'Entrega Inmediata',
    price: 130,
    originalPrice: 170,
    description: 'Copia certificada del acta de nacimiento con firma electrónica y código QR para cualquier trámite legal, pasaporte o escolar en México.',
    features: ['Formato único oficial', 'Vigencia permanente', 'Descarga directa en PDF', 'Aceptada en todas las instituciones'],
    badge: 'Oficial',
    active: true
  },
  {
    id: 'prod-recarga-telcel100',
    categoryId: 'cat-recargas',
    categoryName: 'Recargas Telefónicas',
    name: 'Paquete Telcel Amigo Sin Límite $100 (1.5GB + Redes)',
    type: 'digital',
    itemCategory: 'metodo',
    duration: 'Vigencia 15 Días',
    price: 100,
    originalPrice: 100,
    description: 'Recarga directa a tu número celular Telcel. Incluye 1,500 MB para navegar, llamadas y SMS ilimitados en México, EE. UU. y Canadá, y redes sociales ilimitadas.',
    features: ['1,500 MB libres de navegación', 'WhatsApp, Facebook, Messenger y X ilimitados', 'Minutos y SMS ilimitados', 'Acreditación en 3 minutos'],
    badge: 'Instantáneo',
    active: true
  },
  {
    id: 'prod-diamantes-520',
    categoryId: 'cat-diamantes',
    categoryName: 'Diamantes & Videojuegos',
    name: 'Free Fire: 520 Diamantes (Carga Directa por ID)',
    type: 'digital',
    itemCategory: 'metodo',
    duration: 'Entrega en 5 min',
    price: 95,
    originalPrice: 115,
    description: 'Recarga de 520 Diamantes para Free Fire sin pedir contraseña, solo necesitamos tu ID de jugador de 9 o 10 dígitos y región.',
    features: ['100% seguro sin riesgo de baneo', 'Solo requiere ID de jugador', 'Pase élite y skins desbloqueables', 'Acreditación instantánea en tu cuenta'],
    badge: 'Popular Gamer ✦',
    active: true
  },
  {
    id: 'prod-diamantes-1060',
    categoryId: 'cat-diamantes',
    categoryName: 'Diamantes & Videojuegos',
    name: 'Free Fire: 1,060 Diamantes (Directo por ID)',
    type: 'digital',
    itemCategory: 'metodo',
    duration: 'Entrega en 5 min',
    price: 185,
    originalPrice: 220,
    description: 'Mega recarga de 1,060 Diamantes para tu cuenta de Free Fire. Entrega rápida y garantizada directamente por sistema oficial.',
    features: ['Acreditación inmediata con ID', 'Bono promocional de recarga', 'Garantía JENYX Digital', 'Soporte prioritario por WhatsApp'],
    badge: 'Super Oferta',
    active: true
  }
];

export const INITIAL_ACCOUNTS: StreamingAccount[] = [
  {
    id: 'acc-nf-01',
    categoryId: 'cat-netflix',
    serviceName: 'Netflix 4K Ultra HD',
    email: 'netflix.jenyx01@gmail.com',
    password: 'JenyxP@ss2026Netf',
    masterPin: '8899',
    maxProfiles: 5,
    status: 'activa',
    expirationDate: '2026-11-28',
    notes: 'Cuenta titular contratada con tarjeta virtual BBVA. Renovación automática.',
    createdAt: '2026-10-25',
    profiles: [
      {
        id: 'prof-nf-01-1',
        profileNumber: 1,
        name: 'Perfil 1 (Admin)',
        pin: '1423',
        status: 'ocupado',
        assignedClientId: 'cli-01',
        assignedClientName: 'Mariana Reyes',
        assignedClientWhatsApp: '+525543219876',
        assignedOrderId: 'JNX-2091',
        assignedAt: '2026-10-26',
        expiresAt: '2026-11-26'
      },
      {
        id: 'prof-nf-01-2',
        profileNumber: 2,
        name: 'Perfil 2 (Carlos)',
        pin: '5920',
        status: 'ocupado',
        assignedClientId: 'cli-02',
        assignedClientName: 'Carlos Mendoza',
        assignedClientWhatsApp: '+528112345678',
        assignedOrderId: 'JNX-2084',
        assignedAt: '2026-10-20',
        expiresAt: '2026-11-20'
      },
      {
        id: 'prof-nf-01-3',
        profileNumber: 3,
        name: 'Perfil 3 (Disponible)',
        pin: '4421',
        status: 'libre'
      },
      {
        id: 'prof-nf-01-4',
        profileNumber: 4,
        name: 'Perfil 4 (Disponible)',
        pin: '7731',
        status: 'libre'
      },
      {
        id: 'prof-nf-01-5',
        profileNumber: 5,
        name: 'Perfil 5 (Disponible)',
        pin: '9082',
        status: 'libre'
      }
    ]
  },
  {
    id: 'acc-nf-02',
    categoryId: 'cat-netflix',
    serviceName: 'Netflix 4K Ultra HD',
    email: 'netflix.jenyx02@gmail.com',
    password: 'JenyxGoth#2026Nf',
    masterPin: '6655',
    maxProfiles: 5,
    status: 'activa',
    expirationDate: '2026-11-15',
    notes: 'Servidor 2 Netflix Colombia / México',
    createdAt: '2026-10-15',
    profiles: [
      {
        id: 'prof-nf-02-1',
        profileNumber: 1,
        name: 'Perfil 1 (Lucía)',
        pin: '3312',
        status: 'ocupado',
        assignedClientId: 'cli-03',
        assignedClientName: 'Lucía Morales',
        assignedClientWhatsApp: '+523319876543',
        assignedOrderId: 'JNX-2070',
        assignedAt: '2026-10-01',
        expiresAt: '2026-10-31'
      },
      {
        id: 'prof-nf-02-2',
        profileNumber: 2,
        name: 'Perfil 2 (Disponible)',
        pin: '8814',
        status: 'libre'
      },
      {
        id: 'prof-nf-02-3',
        profileNumber: 3,
        name: 'Perfil 3 (Disponible)',
        pin: '2941',
        status: 'libre'
      },
      {
        id: 'prof-nf-02-4',
        profileNumber: 4,
        name: 'Perfil 4 (Disponible)',
        pin: '6105',
        status: 'libre'
      },
      {
        id: 'prof-nf-02-5',
        profileNumber: 5,
        name: 'Perfil 5 (Disponible)',
        pin: '4452',
        status: 'libre'
      }
    ]
  },
  {
    id: 'acc-dis-01',
    categoryId: 'cat-disney',
    serviceName: 'Disney+ / Star+',
    email: 'disney.jenyx01@gmail.com',
    password: 'MickeyJenyx$2026',
    masterPin: '1122',
    maxProfiles: 6,
    status: 'activa',
    expirationDate: '2026-12-05',
    notes: 'Disney+ combo con Star+ y ESPN',
    createdAt: '2026-10-20',
    profiles: [
      {
        id: 'prof-dis-01-1',
        profileNumber: 1,
        name: 'Perfil 1 (Diego)',
        pin: '1092',
        status: 'ocupado',
        assignedClientId: 'cli-04',
        assignedClientName: 'Diego Fernández',
        assignedClientWhatsApp: '+525598123456',
        assignedOrderId: 'JNX-2065',
        assignedAt: '2026-10-18',
        expiresAt: '2026-11-18'
      },
      {
        id: 'prof-dis-01-2',
        profileNumber: 2,
        name: 'Perfil 2 (Disponible)',
        pin: '7341',
        status: 'libre'
      },
      {
        id: 'prof-dis-01-3',
        profileNumber: 3,
        name: 'Perfil 3 (Disponible)',
        pin: '5523',
        status: 'libre'
      },
      {
        id: 'prof-dis-01-4',
        profileNumber: 4,
        name: 'Perfil 4 (Disponible)',
        pin: '4491',
        status: 'libre'
      },
      {
        id: 'prof-dis-01-5',
        profileNumber: 5,
        name: 'Perfil 5 (Disponible)',
        pin: '9812',
        status: 'libre'
      },
      {
        id: 'prof-dis-01-6',
        profileNumber: 6,
        name: 'Perfil 6 (Disponible)',
        pin: '6723',
        status: 'libre'
      }
    ]
  },
  {
    id: 'acc-max-01',
    categoryId: 'cat-max',
    serviceName: 'Max (HBO)',
    email: 'max.jenyx01@gmail.com',
    password: 'MaxJenyxGoth!26',
    masterPin: '4455',
    maxProfiles: 5,
    status: 'activa',
    expirationDate: '2026-11-22',
    notes: 'Plan Platino Anual activado',
    createdAt: '2026-10-10',
    profiles: [
      {
        id: 'prof-max-01-1',
        profileNumber: 1,
        name: 'Perfil 1 (Sofía)',
        pin: '9901',
        status: 'ocupado',
        assignedClientId: 'cli-05',
        assignedClientName: 'Sofía Valdés',
        assignedClientWhatsApp: '+525576543210',
        assignedOrderId: 'JNX-2051',
        assignedAt: '2026-10-12',
        expiresAt: '2026-11-12'
      },
      {
        id: 'prof-max-01-2',
        profileNumber: 2,
        name: 'Perfil 2 (Disponible)',
        pin: '3812',
        status: 'libre'
      },
      {
        id: 'prof-max-01-3',
        profileNumber: 3,
        name: 'Perfil 3 (Disponible)',
        pin: '6620',
        status: 'libre'
      },
      {
        id: 'prof-max-01-4',
        profileNumber: 4,
        name: 'Perfil 4 (Disponible)',
        pin: '1945',
        status: 'libre'
      },
      {
        id: 'prof-max-01-5',
        profileNumber: 5,
        name: 'Perfil 5 (Disponible)',
        pin: '5012',
        status: 'libre'
      }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-01',
    orderNumber: 'JNX-2091',
    customerName: 'Mariana Reyes',
    customerWhatsApp: '+525543219876',
    customerEmail: 'mariana.reyes@gmail.com',
    productId: 'prod-netflix-p1',
    productName: 'Netflix 4K - Perfil Privado (1 Mes)',
    productType: 'perfil',
    categoryId: 'cat-netflix',
    categoryName: 'Netflix 4K Ultra HD',
    duration: '1 Mes',
    price: 65,
    paymentMethod: 'transferencia',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
    receiptNote: 'Transferencia BBVA ref: 948102',
    status: 'entregado',
    createdAt: '2026-10-26T14:30:00Z',
    updatedAt: '2026-10-26T14:45:00Z',
    expiresAt: '2026-11-26T14:30:00Z',
    assignedAccountId: 'acc-nf-01',
    assignedAccountEmail: 'netflix.jenyx01@gmail.com',
    assignedAccountPassword: 'JenyxP@ss2026Netf',
    assignedProfileId: 'prof-nf-01-1',
    assignedProfileName: 'Perfil 1 (Admin)',
    assignedProfilePin: '1423',
    notes: 'Cliente puntual y recurrente.'
  },
  {
    id: 'ord-02',
    orderNumber: 'JNX-2092',
    customerName: 'Alejandro Gómez',
    customerWhatsApp: '+525511223344',
    customerEmail: 'alex.gomez@outlook.com',
    productId: 'prod-max-p1',
    productName: 'Max Platino - Perfil Privado (1 Mes)',
    productType: 'perfil',
    categoryId: 'cat-max',
    categoryName: 'Max (HBO)',
    duration: '1 Mes',
    price: 55,
    paymentMethod: 'oxxo',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&auto=format&fit=crop&q=80',
    receiptNote: 'Ticket OXXO folio 440182 pagado a las 18:22 hrs',
    status: 'revision',
    createdAt: '2026-10-29T18:25:00Z',
    notes: 'Esperando validación en portal OXXO.'
  },
  {
    id: 'ord-03',
    orderNumber: 'JNX-2093',
    customerName: 'Fernanda Salgado',
    customerWhatsApp: '+528199887766',
    customerEmail: 'fer.salgado@gmail.com',
    productId: 'prod-netflix-c1',
    productName: 'Netflix 4K - Cuenta Completa Familiar',
    productType: 'cuenta_completa',
    categoryId: 'cat-netflix',
    categoryName: 'Netflix 4K Ultra HD',
    duration: '1 Mes',
    price: 219,
    paymentMethod: 'transferencia',
    status: 'pendiente',
    createdAt: '2026-10-29T21:10:00Z',
    notes: 'Pedido generado por checkout web, esperando envío de comprobante.'
  },
  {
    id: 'ord-04',
    orderNumber: 'JNX-2070',
    customerName: 'Lucía Morales',
    customerWhatsApp: '+523319876543',
    customerEmail: 'lucia.m@yahoo.com',
    productId: 'prod-netflix-p1',
    productName: 'Netflix 4K - Perfil Privado (1 Mes)',
    productType: 'perfil',
    categoryId: 'cat-netflix',
    categoryName: 'Netflix 4K Ultra HD',
    duration: '1 Mes',
    price: 65,
    paymentMethod: 'deposito',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
    status: 'aprobado',
    createdAt: '2026-10-01T10:00:00Z',
    expiresAt: '2026-10-31T23:59:59Z', // Próximo a vencer en 2 días!
    assignedAccountId: 'acc-nf-02',
    assignedAccountEmail: 'netflix.jenyx02@gmail.com',
    assignedAccountPassword: 'JenyxGoth#2026Nf',
    assignedProfileId: 'prof-nf-02-1',
    assignedProfileName: 'Perfil 1 (Lucía)',
    assignedProfilePin: '3312',
    notes: 'A punto de vencer. Notificar para renovación.'
  },
  {
    id: 'ord-05',
    orderNumber: 'JNX-2015',
    customerName: 'Roberto Garza',
    customerWhatsApp: '+528187654321',
    customerEmail: 'roberto.garza@gmail.com',
    productId: 'prod-prime-p1',
    productName: 'Prime Video - Perfil Personal (1 Mes)',
    productType: 'perfil',
    categoryId: 'cat-prime',
    categoryName: 'Prime Video',
    duration: '1 Mes',
    price: 45,
    paymentMethod: 'transferencia',
    status: 'vencido',
    createdAt: '2026-09-20T12:00:00Z',
    expiresAt: '2026-10-20T12:00:00Z',
    notes: 'Suscripción expirada hace 9 días. Ofrecer promo de reactivación.'
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-01',
    name: 'Mariana Reyes',
    whatsapp: '+525543219876',
    email: 'mariana.reyes@gmail.com',
    password: 'jenyx123',
    registered: true,
    balance: 200,
    balanceHistory: [
      { id: 'bal-01', amount: 200, type: 'abono', reason: 'Abono SPEI verificado', date: '2026-10-25', adminName: 'Admin Jenyx' }
    ],
    totalOrders: 3,
    activeSubscriptions: 1,
    totalSpent: 195,
    lastOrderDate: '2026-10-26',
    nextExpirationDate: '2026-11-26',
    status: 'activo',
    notes: 'Cliente VIP desde agosto. Paga puntual por transferencia.',
    createdAt: '2026-08-15'
  },
  {
    id: 'cli-02',
    name: 'Carlos Mendoza',
    whatsapp: '+528112345678',
    email: 'carlos.m@hotmail.com',
    password: 'jenyx123',
    registered: true,
    balance: 100,
    balanceHistory: [
      { id: 'bal-02', amount: 100, type: 'abono', reason: 'Recarga saldo monedero', date: '2026-10-20', adminName: 'Admin Jenyx' }
    ],
    totalOrders: 2,
    activeSubscriptions: 1,
    totalSpent: 130,
    lastOrderDate: '2026-10-20',
    nextExpirationDate: '2026-11-20',
    status: 'activo',
    notes: 'Monterrey, prefiere WhatsApp para renovar.',
    createdAt: '2026-09-10'
  },
  {
    id: 'cli-03',
    name: 'Lucía Morales',
    whatsapp: '+523319876543',
    email: 'lucia.m@yahoo.com',
    totalOrders: 1,
    activeSubscriptions: 1,
    totalSpent: 65,
    lastOrderDate: '2026-10-01',
    nextExpirationDate: '2026-10-31',
    status: 'por_vencer',
    notes: 'Vence en 48 horas. Enviar mensaje de renovación.',
    createdAt: '2026-10-01'
  },
  {
    id: 'cli-04',
    name: 'Diego Fernández',
    whatsapp: '+525598123456',
    email: 'diego.f@gmail.com',
    totalOrders: 1,
    activeSubscriptions: 1,
    totalSpent: 49,
    lastOrderDate: '2026-10-18',
    nextExpirationDate: '2026-11-18',
    status: 'activo',
    notes: 'Disney+ fan',
    createdAt: '2026-10-18'
  },
  {
    id: 'cli-05',
    name: 'Sofía Valdés',
    whatsapp: '+525576543210',
    email: 'sofia.valdes@gmail.com',
    totalOrders: 2,
    activeSubscriptions: 1,
    totalSpent: 110,
    lastOrderDate: '2026-10-12',
    nextExpirationDate: '2026-11-12',
    status: 'activo',
    notes: 'Recomendada por Mariana Reyes.',
    createdAt: '2026-09-12'
  },
  {
    id: 'cli-06',
    name: 'Roberto Garza',
    whatsapp: '+528187654321',
    email: 'roberto.garza@gmail.com',
    totalOrders: 1,
    activeSubscriptions: 0,
    totalSpent: 45,
    lastOrderDate: '2026-09-20',
    nextExpirationDate: '2026-10-20',
    status: 'vencido',
    notes: 'Vencido sin renovar todavía.',
    createdAt: '2026-09-20'
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-01',
    email: 'ticket.cut24@gmail.com',
    name: 'Jenyx Founder & Owner',
    role: 'admin',
    avatar: '/assets/aistudio/jenix_4fac0935.jpeg',
    active: true,
    createdAt: '2026-10-01',
    lastLogin: '2026-10-29 22:45'
  },
  {
    id: 'usr-02',
    email: 'admin@jenyx.com',
    name: 'Jenyx Administradora',
    role: 'admin',
    avatar: '/assets/aistudio/jenix_4fac0935.jpeg',
    active: true,
    createdAt: '2026-10-05',
    lastLogin: '2026-10-29 20:10'
  },
  {
    id: 'usr-03',
    email: 'ventas@jenyx.com',
    name: 'Valeria Luna (Atención & Ventas)',
    role: 'vendedor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    active: true,
    createdAt: '2026-10-12',
    lastLogin: '2026-10-29 19:30'
  }
];

export const INITIAL_WARRANTY_CLAIMS: WarrantyClaim[] = [
  {
    id: 'claim-101',
    claimNumber: 'GAR-1042',
    orderId: 'ord-01',
    orderNumber: 'JNX-8492',
    productId: 'prod-nf-01',
    productName: 'Netflix Ultra HD 4K - 1 Pantalla (1 Mes)',
    customerName: 'Santiago Ramírez',
    customerWhatsApp: '+525512345678',
    customerEmail: 'santiago.ramirez@gmail.com',
    actionRequested: 'renovacion',
    issueType: 'credenciales_incorrectas',
    description: 'Hola, al intentar ingresar a mi perfil de Netflix me dice que la contraseña es incorrecta o caducó. Mi garantía de 30 días aún está activa, solicito por favor una renovación o reemplazo de credenciales.',
    status: 'abierto',
    warrantyValidUntil: '2026-11-28',
    isWithinWarranty: true,
    createdAt: '2026-10-29T18:40:00.000Z'
  },
  {
    id: 'claim-102',
    claimNumber: 'GAR-1038',
    orderId: 'ord-02',
    orderNumber: 'JNX-5129',
    productId: 'prod-disney-01',
    productName: 'Disney+ / Star+ - Perfil Premium (1 Mes)',
    customerName: 'Fernanda Morales',
    customerWhatsApp: '+525598765432',
    customerEmail: 'fernanda.morales@hotmail.com',
    actionRequested: 'solucion',
    issueType: 'pantalla_ocupada',
    description: 'El PIN de mi perfil decía bloqueado temporalmente por demasiados intentos. Requiero asistencia técnica.',
    status: 'resuelto',
    adminNotes: 'Se restableció el PIN a 4422 y se verificó el acceso.',
    solutionDetails: 'Se actualizó tu PIN de perfil a 4422. Acceso reactivado con éxito bajo tu garantía JENYX.',
    replacementProfilePin: '4422',
    warrantyValidUntil: '2026-11-25',
    isWithinWarranty: true,
    createdAt: '2026-10-28T14:20:00.000Z',
    resolvedAt: '2026-10-28T15:05:00.000Z'
  }
];
