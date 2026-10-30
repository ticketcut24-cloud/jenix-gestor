export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  color: string;
  description: string;
  active: boolean;
  order: number;
}

export type ProductType = 'perfil' | 'cuenta_completa' | 'digital';
export type ItemCategoryType = 'streaming' | 'metodo' | 'apk' | 'drive';

export interface Product {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  type: ProductType;
  itemCategory?: ItemCategoryType; // 'streaming' | 'metodo' | 'apk' | 'drive'
  duration: string; // e.g. "1 Mes", "3 Meses", "6 Meses", "1 Año", "Permanente / Vitalicio"
  price: number; // in MXN
  originalPrice?: number;
  description: string;
  features: string[];
  badge?: string; // e.g. "Más vendido", "Promo Neón", "Familiar", "Método VIP", "APK Mod"
  active: boolean;
  image?: string; // photo / logo url
  iconName?: string;
  // Digital goods specific (Drive / APK / Métodos)
  downloadUrl?: string; // Google Drive link, APK direct download, etc.
  guideInstructions?: string; // Instructions or delivery details
  version?: string; // For APKs e.g. v4.2.1
  fileSize?: string; // e.g. "35 MB", "1.2 GB"
}

export interface ProfileItem {
  id: string;
  profileNumber: number;
  name: string;
  pin: string;
  status: 'libre' | 'ocupado';
  assignedClientId?: string;
  assignedClientName?: string;
  assignedClientWhatsApp?: string;
  assignedOrderId?: string;
  assignedAt?: string;
  expiresAt?: string;
}

export interface StreamingAccount {
  id: string;
  categoryId: string;
  serviceName: string;
  email: string;
  password: string;
  masterPin?: string;
  maxProfiles: number;
  status: 'activa' | 'suspendida' | 'por_renovar' | 'vencida';
  expirationDate: string; // YYYY-MM-DD
  notes?: string;
  profiles: ProfileItem[];
  createdAt: string;
  // Extra security flags
  isVaultLocked?: boolean;
}

export type OrderStatus = 'pendiente' | 'revision' | 'aprobado' | 'entregado' | 'cancelado' | 'vencido';
export type PaymentMethod = 'transferencia' | 'deposito' | 'oxxo' | 'saldo' | 'whatsapp';

export interface Order {
  id: string;
  orderNumber: string; // e.g. "JNX-8492"
  customerName: string;
  customerWhatsApp: string;
  customerEmail?: string;
  productId: string;
  productName: string;
  productType: ProductType;
  itemCategory?: ItemCategoryType;
  categoryId: string;
  categoryName?: string;
  duration: string;
  price: number;
  paymentMethod: PaymentMethod;
  receiptUrl?: string; // Image base64 or URL
  receiptNote?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string;
  // Fulfillment details (Streaming)
  assignedAccountId?: string;
  assignedAccountEmail?: string;
  assignedAccountPassword?: string;
  assignedProfileId?: string;
  assignedProfileName?: string;
  assignedProfilePin?: string;
  // Fulfillment details (Drive / APK / Método)
  deliveredDownloadUrl?: string;
  deliveredInstructions?: string;
  notes?: string;
  renewalReminderSent?: boolean;
}

export interface BalanceTransaction {
  id: string;
  amount: number;
  type: 'abono' | 'cargo';
  reason: string;
  date: string;
  adminName?: string;
}

export interface Client {
  id: string;
  name: string;
  whatsapp: string;
  email?: string;
  password?: string; // Client account password
  registered?: boolean; // True if created account in client portal
  balance?: number; // Saldo a favor disponible en MXN
  balanceHistory?: BalanceTransaction[];
  totalOrders: number;
  activeSubscriptions: number;
  totalSpent: number;
  lastOrderDate?: string;
  nextExpirationDate?: string;
  status: 'activo' | 'por_vencer' | 'vencido' | 'inactivo';
  notes?: string;
  createdAt: string;
}

export interface PaymentSettings {
  clabe: string;
  bank: string;
  beneficiary: string;
  oxxoCardNumber: string;
  oxxoBeneficiary: string;
  whatsappSupportNumber: string;
  instructions: string;
}

export interface BusinessSettings {
  id: string;
  businessName: string;
  motto: string;
  logoUrl: string;
  primaryColor: string;
  accentSoftColor: string;
  wineColor: string;
  currency: string;
  whatsappSupport: string;
  payment: PaymentSettings;
  announcement?: string;
  // Security
  adminPin: string; // Master PIN for admin panel login (default "2026")
  vaultMasterPin: string; // Extreme security PIN for Cuentas Madre vault (default "7799")
}

export type AdminRole = 'admin' | 'vendedor';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  avatar?: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

export type WarrantyClaimIssueType = 
  | 'credenciales_incorrectas' 
  | 'pantalla_ocupada' 
  | 'enlace_caido' 
  | 'geobloqueo' 
  | 'cuenta_suspendida'
  | 'otro';

export type WarrantyClaimStatus = 'abierto' | 'en_revision' | 'resuelto' | 'rechazado';
export type WarrantyClaimActionRequested = 'renovacion' | 'solucion';

export interface WarrantyClaim {
  id: string;
  claimNumber: string; // e.g. "GAR-4921"
  orderId: string;
  orderNumber: string; // e.g. "JNX-8492"
  productId: string;
  productName: string;
  customerName: string;
  customerWhatsApp: string;
  customerEmail?: string;
  actionRequested: WarrantyClaimActionRequested; // 'renovacion' | 'solucion'
  issueType: WarrantyClaimIssueType;
  description: string;
  evidenceUrl?: string; // Screenshot base64 or URL
  status: WarrantyClaimStatus;
  adminNotes?: string;
  solutionDetails?: string; // Solution instructions sent back to client
  replacementAccountId?: string;
  replacementAccountEmail?: string;
  replacementAccountPassword?: string;
  replacementProfileName?: string;
  replacementProfilePin?: string;
  warrantyValidUntil: string;
  isWithinWarranty: boolean;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
}

export interface DashboardMetrics {
  totalClients: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingPaymentsCount: number;
  pendingReceiptsCount: number;
  pendingApprovalBalance: number;
  activeAccessesCount: number;
  totalAccounts: number;
  freeProfilesCount: number;
  expiredOrdersCount: number;
  expiringSoonOrdersCount: number;
  totalDigitalProducts: number;
  openClaimsCount: number;
}

