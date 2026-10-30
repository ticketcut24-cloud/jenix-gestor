import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Category,
  Product,
  StreamingAccount,
  ProfileItem,
  Order,
  Client,
  BusinessSettings,
  AdminUser,
  DashboardMetrics,
  OrderStatus,
  WarrantyClaim,
  WarrantyClaimStatus,
  WarrantyClaimIssueType,
  WarrantyClaimActionRequested
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ACCOUNTS,
  INITIAL_ORDERS,
  INITIAL_CLIENTS,
  INITIAL_ADMIN_USERS,
  INITIAL_WARRANTY_CLAIMS
} from '../data/initialData';
import { db, auth, googleProvider } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const STORAGE_KEYS = {
  SETTINGS: 'jenyx_settings_v2',
  CATEGORIES: 'jenyx_categories_v2',
  PRODUCTS: 'jenyx_products_v2',
  ACCOUNTS: 'jenyx_accounts_v2',
  ORDERS: 'jenyx_orders_v2',
  CLIENTS: 'jenyx_clients_v2',
  ADMIN_USERS: 'jenyx_admin_users_v2',
  CURRENT_ADMIN: 'jenyx_current_admin_v2',
  CURRENT_CLIENT: 'jenyx_current_client_v2',
  WARRANTY_CLAIMS: 'jenyx_warranty_claims_v2',
};


function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error loading ${key} from localStorage:`, e);
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error saving ${key} to localStorage:`, e);
  }
}

interface StoreContextType {
  settings: BusinessSettings;
  categories: Category[];
  products: Product[];
  accounts: StreamingAccount[];
  orders: Order[];
  clients: Client[];
  adminUsers: AdminUser[];
  currentAdmin: AdminUser | null;
  currentClient: Client | null;
  metrics: DashboardMetrics;
  
  // Warranty & Technical Support Claims
  warrantyClaims: WarrantyClaim[];
  createWarrantyClaim: (data: {
    orderId: string;
    orderNumber: string;
    productId: string;
    productName: string;
    customerName: string;
    customerWhatsApp: string;
    customerEmail?: string;
    actionRequested: WarrantyClaimActionRequested;
    issueType: WarrantyClaimIssueType;
    description: string;
    evidenceUrl?: string;
  }) => { success: boolean; claim?: WarrantyClaim; message: string };
  resolveWarrantyClaim: (
    claimId: string,
    solutionText: string,
    options?: { autoReplaceProfile?: boolean; customCredentials?: string; replacementPin?: string }
  ) => { success: boolean; message: string; claim?: WarrantyClaim };
  updateWarrantyClaimStatus: (claimId: string, status: WarrantyClaimStatus, adminNotes?: string) => void;
  deleteWarrantyClaim: (claimId: string) => void;

  // Actions
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;
  // Categories CRUD
  addCategory: (cat: Omit<Category, 'id'>) => Category;
  updateCategory: (cat: Category) => void;
  deleteCategory: (id: string) => void;
  // Products CRUD
  addProduct: (prod: Omit<Product, 'id'>) => Product;
  updateProduct: (prod: Product) => void;
  deleteProduct: (id: string) => void;
  // Accounts CRUD
  addAccount: (acc: Omit<StreamingAccount, 'id' | 'createdAt'>) => StreamingAccount;
  updateAccount: (acc: StreamingAccount) => void;
  deleteAccount: (id: string) => void;
  freeProfile: (accountId: string, profileId: string) => void;
  updateProfile: (accountId: string, profileId: string, updates: Partial<ProfileItem>) => void;
  deleteProfileFromAccount: (accountId: string, profileId: string) => void;
  // Orders & Fulfillment
  createOrder: (orderData: Partial<Order>) => Order;
  updateOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  approveOrder: (orderId: string, preferredAccountId?: string, preferredProfileId?: string) => boolean;
  rejectOrder: (orderId: string, reason?: string) => void;
  deleteOrder: (id: string) => void;
  renewOrder: (orderId: string) => Order | null;
  // Clients CRUD & Balance
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  creditClientBalance: (clientId: string, amount: number, reason: string, type?: 'abono' | 'cargo') => void;
  // Client Authentication & Portal
  clientRegister: (name: string, whatsapp: string, email: string, password: string) => { success: boolean; message?: string; client?: Client };
  clientLogin: (identifier: string, password: string) => { success: boolean; message?: string; client?: Client };
  clientLogout: () => void;
  clientRecoverPassword: (identifier: string) => { success: boolean; message: string };
  // CSV Import / Export
  exportClientsCSV: () => string;
  importClientsCSV: (csvText: string) => { imported: number; errors: string[] };
  exportProductsCSV: () => string;
  importProductsCSV: (csvText: string) => { imported: number; errors: string[] };
  // Vault & High-Security Mother Accounts
  isVaultUnlocked: boolean;
  unlockVault: (pin: string) => boolean;
  lockVault: () => void;
  verifyAdminPin: (pin: string) => boolean;
  updateSecurityPins: (adminPin?: string, vaultPin?: string) => void;
  // Admin Auth
  currentAdminRole: 'admin' | 'vendedor' | null;
  adminLoginWithGoogle: () => Promise<boolean>;
  adminLoginQuick: (role: 'admin' | 'vendedor', email?: string) => void;
  adminLogout: () => void;
  addAdminUser: (user: Omit<AdminUser, 'id' | 'createdAt'>) => AdminUser;
  updateAdminUser: (user: AdminUser) => void;
  deleteAdminUser: (id: string) => void;
  // Reset
  resetToDefaultData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<BusinessSettings>(() => loadStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS));
  const [categories, setCategories] = useState<Category[]>(() => loadStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES));
  const [products, setProducts] = useState<Product[]>(() => loadStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS));
  const [accounts, setAccounts] = useState<StreamingAccount[]>(() => loadStorage(STORAGE_KEYS.ACCOUNTS, INITIAL_ACCOUNTS));
  const [orders, setOrders] = useState<Order[]>(() => loadStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS));
  const [clients, setClients] = useState<Client[]>(() => loadStorage(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS));
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => loadStorage(STORAGE_KEYS.ADMIN_USERS, INITIAL_ADMIN_USERS));
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => loadStorage(STORAGE_KEYS.CURRENT_ADMIN, INITIAL_ADMIN_USERS[0]));
  const [currentClient, setCurrentClient] = useState<Client | null>(() => loadStorage(STORAGE_KEYS.CURRENT_CLIENT, null));
  const [warrantyClaims, setWarrantyClaims] = useState<WarrantyClaim[]>(() => loadStorage(STORAGE_KEYS.WARRANTY_CLAIMS, INITIAL_WARRANTY_CLAIMS));


  // High-Security Mother Account Vault state (in-memory for security)
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);

  // Save to localStorage
  useEffect(() => saveStorage(STORAGE_KEYS.SETTINGS, settings), [settings]);
  useEffect(() => saveStorage(STORAGE_KEYS.CATEGORIES, categories), [categories]);
  useEffect(() => saveStorage(STORAGE_KEYS.PRODUCTS, products), [products]);
  useEffect(() => saveStorage(STORAGE_KEYS.ACCOUNTS, accounts), [accounts]);
  useEffect(() => saveStorage(STORAGE_KEYS.ORDERS, orders), [orders]);
  useEffect(() => saveStorage(STORAGE_KEYS.CLIENTS, clients), [clients]);
  useEffect(() => saveStorage(STORAGE_KEYS.ADMIN_USERS, adminUsers), [adminUsers]);
  useEffect(() => saveStorage(STORAGE_KEYS.CURRENT_ADMIN, currentAdmin), [currentAdmin]);
  useEffect(() => saveStorage(STORAGE_KEYS.CURRENT_CLIENT, currentClient), [currentClient]);
  useEffect(() => saveStorage(STORAGE_KEYS.WARRANTY_CLAIMS, warrantyClaims), [warrantyClaims]);

  // Auto lock vault after 15 minutes of inactivity
  useEffect(() => {
    if (isVaultUnlocked) {
      const timer = setTimeout(() => {
        setIsVaultUnlocked(false);
      }, 15 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [isVaultUnlocked]);

  // Sync with Firestore if available
  useEffect(() => {
    let unsubscribeAuth: (() => void) | undefined;
    try {
      unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          const found = adminUsers.find(u => u.email.toLowerCase() === user.email?.toLowerCase());
          if (found) {
            setCurrentAdmin(found);
          } else if (user.email === 'ticket.cut24@gmail.com') {
            const superUser: AdminUser = {
              id: user.uid,
              email: user.email,
              name: user.displayName || 'JENYX Super Admin',
              role: 'admin',
              avatar: user.photoURL || '/assets/aistudio/jenix_4fac0935.jpeg',
              active: true,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toLocaleString()
            };
            setCurrentAdmin(superUser);
          }
        }
      });
    } catch (e) {
      // offline fallback
    }
    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, [adminUsers]);

  // Background sync settings to Firestore
  useEffect(() => {
    try {
      const settingsRef = doc(db, 'settings', 'business_jenyx');
      setDoc(settingsRef, settings, { merge: true }).catch(() => {});
    } catch (e) {
      // offline silent
    }
  }, [settings]);

  // Auto-expire check for orders
  useEffect(() => {
    const now = new Date();
    let hasChanges = false;
    const updated = orders.map(ord => {
      if ((ord.status === 'aprobado' || ord.status === 'entregado') && ord.expiresAt) {
        const expDate = new Date(ord.expiresAt);
        if (now > expDate) {
          hasChanges = true;
          return { ...ord, status: 'vencido' as OrderStatus };
        }
      }
      return ord;
    });

    if (hasChanges) {
      setOrders(updated);
    }
  }, [orders]);

  // Live Metrics
  const metrics = useMemo<DashboardMetrics>(() => {
    const totalClients = clients.length;
    const totalProducts = products.length;
    const totalOrders = orders.length;

    const approvedOrders = orders.filter(o => o.status === 'aprobado' || o.status === 'entregado');
    const totalRevenue = approvedOrders.reduce((sum, o) => sum + (o.price || 0), 0);

    const pendingOrders = orders.filter(o => o.status === 'pendiente');
    const pendingPaymentsCount = pendingOrders.length;

    const revisionOrders = orders.filter(o => o.status === 'revision');
    const pendingReceiptsCount = revisionOrders.length;
    const pendingApprovalBalance = revisionOrders.reduce((sum, o) => sum + (o.price || 0), 0);

    const activeAccessesCount = approvedOrders.length;
    const totalAccounts = accounts.length;

    let freeProfilesCount = 0;
    accounts.forEach(acc => {
      acc.profiles.forEach(p => {
        if (p.status === 'libre') freeProfilesCount++;
      });
    });

    const expiredOrdersCount = orders.filter(o => o.status === 'vencido').length;

    const now = new Date().getTime();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const expiringSoonOrdersCount = orders.filter(o => {
      if ((o.status === 'aprobado' || o.status === 'entregado') && o.expiresAt) {
        const diff = new Date(o.expiresAt).getTime() - now;
        return diff > 0 && diff <= threeDays;
      }
      return false;
    }).length;

    const totalDigitalProducts = products.filter(p => p.type === 'digital' || p.itemCategory === 'apk' || p.itemCategory === 'drive' || p.itemCategory === 'metodo').length;

    const openClaimsCount = warrantyClaims.filter(c => c.status === 'abierto' || c.status === 'en_revision').length;

    return {
      totalClients,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingPaymentsCount,
      pendingReceiptsCount,
      pendingApprovalBalance,
      activeAccessesCount,
      totalAccounts,
      freeProfilesCount,
      expiredOrdersCount,
      expiringSoonOrdersCount,
      totalDigitalProducts,
      openClaimsCount
    };
  }, [clients, products, orders, accounts, warrantyClaims]);


  // CRUD Settings
  const updateSettings = useCallback((newSettings: Partial<BusinessSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // CRUD Categories
  const addCategory = useCallback((cat: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`
    };
    setCategories(prev => [...prev, newCat]);
    return newCat;
  }, []);

  const updateCategory = useCallback((cat: Category) => {
    setCategories(prev => prev.map(c => c.id === cat.id ? cat : c));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  // CRUD Products
  const addProduct = useCallback((prod: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prod,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [...prev, newProd]);
    return newProd;
  }, []);

  const updateProduct = useCallback((prod: Product) => {
    setProducts(prev => prev.map(p => p.id === prod.id ? prod : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  // CRUD Accounts
  const addAccount = useCallback((acc: Omit<StreamingAccount, 'id' | 'createdAt'>) => {
    const newAcc: StreamingAccount = {
      ...acc,
      id: `acc-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAccounts(prev => [...prev, newAcc]);
    return newAcc;
  }, []);

  const updateAccount = useCallback((acc: StreamingAccount) => {
    setAccounts(prev => prev.map(a => a.id === acc.id ? acc : a));
  }, []);

  const deleteAccount = useCallback((id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  }, []);

  const freeProfile = useCallback((accountId: string, profileId: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id !== accountId) return acc;
      return {
        ...acc,
        profiles: acc.profiles.map(prof => {
          if (prof.id !== profileId) return prof;
          return {
            ...prof,
            status: 'libre',
            assignedClientId: undefined,
            assignedClientName: undefined,
            assignedClientWhatsApp: undefined,
            assignedOrderId: undefined,
            assignedAt: undefined,
            expiresAt: undefined
          };
        })
      };
    }));
  }, []);

  const updateProfile = useCallback((accountId: string, profileId: string, updates: Partial<ProfileItem>) => {
    let orderToSync: string | undefined;
    let newName: string | undefined;
    let newPin: string | undefined;

    setAccounts(prev => prev.map(acc => {
      if (acc.id !== accountId) return acc;
      return {
        ...acc,
        profiles: acc.profiles.map(p => {
          if (p.id !== profileId) return p;
          const updated = { ...p, ...updates };
          orderToSync = updated.assignedOrderId;
          newName = updated.name;
          newPin = updated.pin;
          return updated;
        })
      };
    }));

    // If profile is assigned to an order, keep the order's profile credentials in sync
    if (orderToSync && (newName !== undefined || newPin !== undefined)) {
      setOrders(prev => prev.map(o => {
        if (o.orderNumber !== orderToSync && o.assignedProfileId !== profileId) return o;
        return {
          ...o,
          assignedProfileName: newName !== undefined ? newName : o.assignedProfileName,
          assignedProfilePin: newPin !== undefined ? newPin : o.assignedProfilePin,
          updatedAt: new Date().toISOString()
        };
      }));
    }
  }, []);

  const deleteProfileFromAccount = useCallback((accountId: string, profileId: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id !== accountId) return acc;
      const updatedProfiles = acc.profiles.filter(p => p.id !== profileId);
      return {
        ...acc,
        maxProfiles: Math.max(1, updatedProfiles.length),
        profiles: updatedProfiles
      };
    }));
  }, []);


  // Orders
  const createOrder = useCallback((orderData: Partial<Order>) => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `JNX-${randomDigits}`;
    const nowIso = new Date().toISOString();

    const isPaidWithBalance = orderData.paymentMethod === 'saldo';
    const initialStatus: OrderStatus = isPaidWithBalance ? 'aprobado' : (orderData.receiptUrl ? 'revision' : 'pendiente');

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    const expiryDateStr = expiryDate.toISOString();
    const expiryDateShort = expiryDateStr.split('T')[0];

    // Digital goods delivery info
    let deliveredUrl = orderData.deliveredDownloadUrl;
    let deliveredInst = orderData.deliveredInstructions;
    if (orderData.productId) {
      const prod = products.find(p => p.id === orderData.productId);
      if (prod) {
        if (prod.downloadUrl) deliveredUrl = prod.downloadUrl;
        if (prod.guideInstructions) deliveredInst = prod.guideInstructions;
      }
    }

    // Streaming profile auto-allocation if paid with balance
    let assignedAccId = orderData.assignedAccountId;
    let assignedAccEmail = orderData.assignedAccountEmail;
    let assignedAccPass = orderData.assignedAccountPassword;
    let assignedProfId = orderData.assignedProfileId;
    let assignedProfName = orderData.assignedProfileName;
    let assignedProfPin = orderData.assignedProfilePin;

    if (isPaidWithBalance && (!orderData.itemCategory || orderData.itemCategory === 'streaming')) {
      const matchingAcc = accounts.find(a => (orderData.categoryId ? a.categoryId === orderData.categoryId : true) && a.status === 'activa' && a.profiles.some(p => p.status === 'libre'));
      if (matchingAcc) {
        const freeProf = matchingAcc.profiles.find(p => p.status === 'libre');
        if (freeProf) {
          assignedAccId = matchingAcc.id;
          assignedAccEmail = matchingAcc.email;
          assignedAccPass = matchingAcc.password;
          assignedProfId = freeProf.id;
          assignedProfName = freeProf.name;
          assignedProfPin = freeProf.pin;

          // Mark profile as occupied
          setAccounts(prev => prev.map(a => {
            if (a.id !== matchingAcc.id) return a;
            return {
              ...a,
              profiles: a.profiles.map(p => p.id === freeProf.id ? {
                ...p,
                status: 'ocupado',
                assignedClientName: orderData.customerName,
                assignedClientWhatsApp: orderData.customerWhatsApp,
                assignedOrderId: orderNumber,
                assignedAt: nowIso,
                expiresAt: expiryDateStr
              } : p)
            };
          }));
        }
      }
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: orderData.customerName || 'Cliente JENYX',
      customerWhatsApp: orderData.customerWhatsApp || '',
      customerEmail: orderData.customerEmail || '',
      productId: orderData.productId || '',
      productName: orderData.productName || 'Suscripción Streaming',
      productType: orderData.productType || 'perfil',
      itemCategory: orderData.itemCategory,
      categoryId: orderData.categoryId || '',
      categoryName: orderData.categoryName || '',
      duration: orderData.duration || '1 Mes',
      price: orderData.price || 0,
      paymentMethod: orderData.paymentMethod || 'transferencia',
      receiptUrl: orderData.receiptUrl,
      receiptNote: orderData.receiptNote,
      status: initialStatus,
      createdAt: nowIso,
      updatedAt: nowIso,
      expiresAt: isPaidWithBalance ? expiryDateStr : undefined,
      deliveredDownloadUrl: deliveredUrl,
      deliveredInstructions: deliveredInst,
      assignedAccountId: assignedAccId,
      assignedAccountEmail: assignedAccEmail,
      assignedAccountPassword: assignedAccPass,
      assignedProfileId: assignedProfId,
      assignedProfileName: assignedProfName,
      assignedProfilePin: assignedProfPin,
      notes: orderData.notes || (isPaidWithBalance ? 'Pagado al instante con Saldo JENYX.' : 'Pedido creado desde la tienda web.')
    };

    setOrders(prev => [newOrder, ...prev]);

    // Upsert client record and deduct balance if paid with saldo
    setClients(prev => {
      const existing = prev.find(c => c.whatsapp === newOrder.customerWhatsApp);
      if (existing) {
        const currentBal = existing.balance || 0;
        const newBal = isPaidWithBalance ? Math.max(0, currentBal - newOrder.price) : currentBal;
        const newHistory = isPaidWithBalance ? [
          {
            id: `tx-${Date.now()}`,
            amount: newOrder.price,
            type: 'cargo' as const,
            reason: `Compra instantánea folio ${orderNumber} - ${newOrder.productName}`,
            date: nowIso,
            adminName: 'Sistema Automático'
          },
          ...(existing.balanceHistory || [])
        ] : existing.balanceHistory;

        const updatedClient: Client = {
          ...existing,
          totalOrders: existing.totalOrders + 1,
          totalSpent: existing.totalSpent + (isPaidWithBalance ? newOrder.price : 0),
          activeSubscriptions: isPaidWithBalance ? existing.activeSubscriptions + 1 : existing.activeSubscriptions,
          nextExpirationDate: isPaidWithBalance ? expiryDateShort : existing.nextExpirationDate,
          name: newOrder.customerName || existing.name,
          email: newOrder.customerEmail || existing.email,
          balance: newBal,
          balanceHistory: newHistory,
          lastOrderDate: nowIso.split('T')[0]
        };

        if (currentClient?.id === existing.id) {
          setCurrentClient(updatedClient);
        }

        return prev.map(c => c.id === existing.id ? updatedClient : c);
      } else {
        const newClient: Client = {
          id: `cli-${Date.now()}`,
          name: newOrder.customerName,
          whatsapp: newOrder.customerWhatsApp,
          email: newOrder.customerEmail,
          totalOrders: 1,
          activeSubscriptions: isPaidWithBalance ? 1 : 0,
          totalSpent: isPaidWithBalance ? newOrder.price : 0,
          lastOrderDate: nowIso.split('T')[0],
          nextExpirationDate: isPaidWithBalance ? expiryDateShort : undefined,
          status: 'activo',
          createdAt: nowIso.split('T')[0]
        };
        return [newClient, ...prev];
      }
    });

    if (isPaidWithBalance) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#FF2E93', '#3DDC97', '#FF8CC6', '#FFFFFF']
        });
      } catch (e) {
        // ignore
      }
    }

    return newOrder;
  }, [accounts, products, currentClient]);

  const updateOrder = useCallback((order: Order) => {
    setOrders(prev => prev.map(o => o.id === order.id ? { ...order, updatedAt: new Date().toISOString() } : o));
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, note?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        status,
        updatedAt: new Date().toISOString(),
        notes: note ? `${o.notes || ''} [${status.toUpperCase()}: ${note}]` : o.notes
      };
    }));
  }, []);

  // APPROVE ORDER & FULFILLMENT
  const approveOrder = useCallback((orderId: string, preferredAccountId?: string, preferredProfileId?: string): boolean => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return false;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    const expiryDateStr = expiryDate.toISOString();
    const expiryDateShort = expiryDateStr.split('T')[0];

    // Check if product is digital (APK, Google Drive, Método)
    const targetProduct = products.find(p => p.id === targetOrder.productId);
    const isDigital = targetOrder.productType === 'digital' || 
                      targetOrder.itemCategory === 'apk' || 
                      targetOrder.itemCategory === 'drive' || 
                      targetOrder.itemCategory === 'metodo' ||
                      targetProduct?.type === 'digital';

    if (isDigital) {
      // Deliver digital item link
      const downloadUrl = targetProduct?.downloadUrl || 'https://drive.google.com/drive/folders/jenyx-vip';
      const instructions = targetProduct?.guideInstructions || 'Enlace directo de descarga y acceso exclusivo otorgado.';

      setOrders(prev => prev.map(o => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: 'entregado',
          deliveredDownloadUrl: downloadUrl,
          deliveredInstructions: instructions,
          expiresAt: expiryDateStr,
          updatedAt: new Date().toISOString()
        };
      }));

      // Update client stats
      setClients(prev => prev.map(c => {
        if (c.whatsapp !== targetOrder.customerWhatsApp) return c;
        return {
          ...c,
          activeSubscriptions: c.activeSubscriptions + 1,
          totalSpent: c.totalSpent + targetOrder.price,
          status: 'activo',
          nextExpirationDate: expiryDateShort
        };
      }));

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF2E93', '#FF8CC6', '#3DDC97', '#C9C4D4']
        });
      } catch (e) {
        // ignore
      }

      return true;
    }

    // Streaming profile auto-allocation
    let allocatedAccount: StreamingAccount | null = null;
    let allocatedProfile: ProfileItem | null = null;

    if (preferredAccountId && preferredProfileId) {
      allocatedAccount = accounts.find(a => a.id === preferredAccountId) || null;
      if (allocatedAccount) {
        allocatedProfile = allocatedAccount.profiles.find(p => p.id === preferredProfileId) || null;
      }
    } else {
      const matchingAccounts = accounts.filter(a => {
        if (targetOrder.categoryId && a.categoryId !== targetOrder.categoryId) return false;
        return a.status === 'activa';
      });

      for (const acc of matchingAccounts) {
        const freeProf = acc.profiles.find(p => p.status === 'libre');
        if (freeProf) {
          allocatedAccount = acc;
          allocatedProfile = freeProf;
          break;
        }
      }

      if (!allocatedAccount || !allocatedProfile) {
        for (const acc of accounts) {
          if (acc.status === 'activa') {
            const freeProf = acc.profiles.find(p => p.status === 'libre');
            if (freeProf) {
              allocatedAccount = acc;
              allocatedProfile = freeProf;
              break;
            }
          }
        }
      }
    }

    if (!allocatedAccount) {
      setOrders(prev => prev.map(o => o.id === orderId ? {
        ...o,
        status: 'aprobado',
        expiresAt: expiryDateStr,
        updatedAt: new Date().toISOString()
      } : o));
      return false;
    }

    const assignedProfName = allocatedProfile ? allocatedProfile.name : 'Perfil 1 (Completo)';
    const assignedProfPin = allocatedProfile?.pin || allocatedAccount.masterPin || '0000';

    // Mark profile occupied
    setAccounts(prev => prev.map(acc => {
      if (acc.id !== allocatedAccount!.id) return acc;
      return {
        ...acc,
        profiles: acc.profiles.map(p => {
          if (allocatedProfile && p.id === allocatedProfile.id) {
            return {
              ...p,
              status: 'ocupado',
              assignedClientId: targetOrder.customerWhatsApp,
              assignedClientName: targetOrder.customerName,
              assignedClientWhatsApp: targetOrder.customerWhatsApp,
              assignedOrderId: targetOrder.orderNumber,
              assignedAt: new Date().toISOString(),
              expiresAt: expiryDateStr
            };
          }
          return p;
        })
      };
    }));

    // Update order with credentials
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        status: 'entregado',
        assignedAccountId: allocatedAccount!.id,
        assignedAccountEmail: allocatedAccount!.email,
        assignedAccountPassword: allocatedAccount!.password,
        assignedProfileId: allocatedProfile?.id,
        assignedProfileName: assignedProfName,
        assignedProfilePin: assignedProfPin,
        expiresAt: expiryDateStr,
        updatedAt: new Date().toISOString()
      };
    }));

    // Update client stats
    setClients(prev => prev.map(c => {
      if (c.whatsapp !== targetOrder.customerWhatsApp) return c;
      return {
        ...c,
        activeSubscriptions: c.activeSubscriptions + 1,
        totalSpent: c.totalSpent + targetOrder.price,
        status: 'activo',
        nextExpirationDate: expiryDateShort
      };
    }));

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF2E93', '#FF8CC6', '#3DDC97', '#C9C4D4']
      });
    } catch (e) {
      // ignore
    }

    return true;
  }, [orders, accounts, products]);

  const rejectOrder = useCallback((orderId: string, reason?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        status: 'cancelado',
        notes: reason ? `Cancelado: ${reason}` : o.notes,
        updatedAt: new Date().toISOString()
      };
    }));
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  }, []);

  const renewOrder = useCallback((orderId: string): Order | null => {
    const original = orders.find(o => o.id === orderId);
    if (!original) return null;

    return createOrder({
      customerName: original.customerName,
      customerWhatsApp: original.customerWhatsApp,
      customerEmail: original.customerEmail,
      productId: original.productId,
      productName: original.productName,
      productType: original.productType,
      categoryId: original.categoryId,
      categoryName: original.categoryName,
      duration: original.duration,
      price: original.price,
      paymentMethod: original.paymentMethod,
      notes: `Renovación para pedido anterior ${original.orderNumber}.`
    });
  }, [orders, createOrder]);

  // ==========================================
  // WARRANTY & TECHNICAL SUPPORT CLAIMS
  // ==========================================
  const createWarrantyClaim = useCallback((data: {
    orderId: string;
    orderNumber: string;
    productId: string;
    productName: string;
    customerName: string;
    customerWhatsApp: string;
    customerEmail?: string;
    actionRequested: WarrantyClaimActionRequested;
    issueType: WarrantyClaimIssueType;
    description: string;
    evidenceUrl?: string;
  }) => {
    const targetOrder = orders.find(o => o.id === data.orderId || o.orderNumber === data.orderNumber);
    
    // Calculate warranty validity (30 days from creation or order expiration)
    let validUntil = '';
    let isWithinWarranty = true;

    if (targetOrder?.expiresAt) {
      validUntil = targetOrder.expiresAt.split('T')[0];
      const expiry = new Date(targetOrder.expiresAt).getTime();
      isWithinWarranty = expiry > Date.now();
    } else if (targetOrder?.createdAt) {
      const exp = new Date(targetOrder.createdAt);
      exp.setDate(exp.getDate() + 30);
      validUntil = exp.toISOString().split('T')[0];
      isWithinWarranty = exp.getTime() > Date.now();
    } else {
      const exp = new Date();
      exp.setDate(exp.getDate() + 30);
      validUntil = exp.toISOString().split('T')[0];
      isWithinWarranty = true;
    }

    const claimNumber = `GAR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newClaim: WarrantyClaim = {
      id: `claim-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      claimNumber,
      orderId: targetOrder?.id || data.orderId,
      orderNumber: targetOrder?.orderNumber || data.orderNumber,
      productId: targetOrder?.productId || data.productId,
      productName: targetOrder?.productName || data.productName,
      customerName: data.customerName.trim() || targetOrder?.customerName || 'Cliente JENYX',
      customerWhatsApp: data.customerWhatsApp.trim() || targetOrder?.customerWhatsApp || '',
      customerEmail: data.customerEmail?.trim() || targetOrder?.customerEmail || '',
      actionRequested: data.actionRequested,
      issueType: data.issueType,
      description: data.description.trim(),
      evidenceUrl: data.evidenceUrl,
      status: 'abierto',
      warrantyValidUntil: validUntil,
      isWithinWarranty,
      createdAt: new Date().toISOString()
    };

    setWarrantyClaims(prev => [newClaim, ...prev]);

    return {
      success: true,
      claim: newClaim,
      message: `Reporte ${claimNumber} creado correctamente. Tu solicitud está en revisión prioritaria.`
    };
  }, [orders]);

  const resolveWarrantyClaim = useCallback((
    claimId: string,
    solutionText: string,
    options?: { autoReplaceProfile?: boolean; customCredentials?: string; replacementPin?: string }
  ) => {
    const claim = warrantyClaims.find(c => c.id === claimId);
    if (!claim) return { success: false, message: 'Reporte no encontrado' };

    let replacementAccId: string | undefined;
    let replacementEmail: string | undefined;
    let replacementPass: string | undefined;
    let replacementProfName: string | undefined;
    let replacementPin: string | undefined = options?.replacementPin;

    // If auto-replace profile requested (Renovación de perfil en garantía)
    if (options?.autoReplaceProfile) {
      const targetOrder = orders.find(o => o.id === claim.orderId || o.orderNumber === claim.orderNumber);
      
      // Look for active mother account with free profiles
      let chosenAccount: StreamingAccount | null = null;
      let chosenProfile: ProfileItem | null = null;

      if (targetOrder?.categoryId) {
        const catAccounts = accounts.filter(a => a.categoryId === targetOrder.categoryId && a.status === 'activa');
        for (const acc of catAccounts) {
          const free = acc.profiles.find(p => p.status === 'libre');
          if (free) {
            chosenAccount = acc;
            chosenProfile = free;
            break;
          }
        }
      }

      if (!chosenAccount || !chosenProfile) {
        for (const acc of accounts) {
          if (acc.status === 'activa') {
            const free = acc.profiles.find(p => p.status === 'libre');
            if (free) {
              chosenAccount = acc;
              chosenProfile = free;
              break;
            }
          }
        }
      }

      if (chosenAccount && chosenProfile) {
        replacementAccId = chosenAccount.id;
        replacementEmail = chosenAccount.email;
        replacementPass = chosenAccount.password;
        replacementProfName = chosenProfile.name;
        replacementPin = chosenProfile.pin || chosenAccount.masterPin || '0000';

        const newExpiry = new Date();
        newExpiry.setDate(newExpiry.getDate() + 30);
        const newExpiryStr = newExpiry.toISOString();

        // Mark chosen profile as occupied
        setAccounts(prev => prev.map(a => {
          if (a.id !== chosenAccount!.id) return a;
          return {
            ...a,
            profiles: a.profiles.map(p => {
              if (p.id === chosenProfile!.id) {
                return {
                  ...p,
                  status: 'ocupado',
                  assignedClientName: claim.customerName,
                  assignedClientWhatsApp: claim.customerWhatsApp,
                  assignedOrderId: claim.orderNumber,
                  assignedAt: new Date().toISOString(),
                  expiresAt: newExpiryStr
                };
              }
              return p;
            })
          };
        }));

        // Update target order with fresh credentials
        setOrders(prev => prev.map(o => {
          if (o.id !== claim.orderId && o.orderNumber !== claim.orderNumber) return o;
          return {
            ...o,
            assignedAccountId: chosenAccount!.id,
            assignedAccountEmail: chosenAccount!.email,
            assignedAccountPassword: chosenAccount!.password,
            assignedProfileId: chosenProfile!.id,
            assignedProfileName: chosenProfile!.name,
            assignedProfilePin: chosenProfile!.pin,
            notes: `${o.notes || ''} [Garantía aplicada ${claim.claimNumber} con reemplazo]`,
            updatedAt: new Date().toISOString()
          };
        }));
      }
    }

    const updatedClaim: WarrantyClaim = {
      ...claim,
      status: 'resuelto',
      solutionDetails: solutionText,
      replacementAccountId: replacementAccId,
      replacementAccountEmail: replacementEmail,
      replacementAccountPassword: replacementPass,
      replacementProfileName: replacementProfName,
      replacementProfilePin: replacementPin,
      resolvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setWarrantyClaims(prev => prev.map(c => c.id === claimId ? updatedClaim : c));

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#3DDC97', '#FF2E93', '#FF8CC6']
      });
    } catch (e) {}

    return {
      success: true,
      message: 'Garantía resuelta y aplicada exitosamente.',
      claim: updatedClaim
    };
  }, [warrantyClaims, orders, accounts]);

  const updateWarrantyClaimStatus = useCallback((claimId: string, status: WarrantyClaimStatus, adminNotes?: string) => {
    setWarrantyClaims(prev => prev.map(c => {
      if (c.id !== claimId) return c;
      return {
        ...c,
        status,
        adminNotes: adminNotes !== undefined ? adminNotes : c.adminNotes,
        updatedAt: new Date().toISOString()
      };
    }));
  }, []);

  const deleteWarrantyClaim = useCallback((claimId: string) => {
    setWarrantyClaims(prev => prev.filter(c => c.id !== claimId));
  }, []);

  // Clients CRUD
  const updateClient = useCallback((client: Client) => {

    setClients(prev => prev.map(c => c.id === client.id ? client : c));
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  }, []);

  // ACREDITAR O DEDUCIR SALDO DE CLIENTE
  const creditClientBalance = useCallback((clientId: string, amount: number, reason: string, type: 'abono' | 'cargo' = 'abono') => {
    setClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      const currentBal = c.balance || 0;
      const cleanAmt = Math.abs(amount);
      const newBal = type === 'abono' ? currentBal + cleanAmt : Math.max(0, currentBal - cleanAmt);
      const tx = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        amount: cleanAmt,
        type,
        reason: reason.trim() || (type === 'abono' ? 'Abono de saldo administrativo' : 'Cargo por pedido'),
        date: new Date().toISOString(),
        adminName: currentAdmin?.name || 'Administración'
      };
      const updatedClient: Client = {
        ...c,
        balance: newBal,
        balanceHistory: [tx, ...(c.balanceHistory || [])]
      };
      if (currentClient?.id === clientId) {
        setCurrentClient(updatedClient);
      }
      return updatedClient;
    }));
  }, [currentAdmin, currentClient]);

  // CLIENT PORTAL: Register, Login, Logout, Password Recovery
  const clientRegister = useCallback((name: string, whatsapp: string, email: string, password: string) => {
    const cleanWhatsapp = whatsapp.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Check if client already exists
    const existing = clients.find(c => 
      c.whatsapp === cleanWhatsapp || 
      (cleanEmail && c.email?.toLowerCase() === cleanEmail)
    );

    if (existing && existing.password) {
      return { success: false, message: 'Ya existe una cuenta con este WhatsApp o correo. Por favor inicia sesión.' };
    }

    const nowIso = new Date().toISOString().split('T')[0];
    let clientObj: Client;

    if (existing) {
      // Upgrade existing client to registered
      clientObj = {
        ...existing,
        name: name.trim() || existing.name,
        email: cleanEmail || existing.email,
        password: password.trim(),
        registered: true
      };
      setClients(prev => prev.map(c => c.id === existing.id ? clientObj : c));
    } else {
      clientObj = {
        id: `cli-${Date.now()}`,
        name: name.trim(),
        whatsapp: cleanWhatsapp,
        email: cleanEmail,
        password: password.trim(),
        registered: true,
        totalOrders: 0,
        activeSubscriptions: 0,
        totalSpent: 0,
        lastOrderDate: nowIso,
        status: 'activo',
        createdAt: nowIso
      };
      setClients(prev => [clientObj, ...prev]);
    }

    setCurrentClient(clientObj);
    return { success: true, client: clientObj };
  }, [clients]);

  const clientLogin = useCallback((identifier: string, password: string) => {
    const clean = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    const found = clients.find(c => {
      const matchEmail = c.email?.toLowerCase() === clean;
      const matchPhone = c.whatsapp.replace(/\D/g, '').includes(cleanDigits) && cleanDigits.length >= 8;
      return matchEmail || matchPhone;
    });

    if (!found) {
      return { success: false, message: 'No encontramos ninguna cuenta con ese número o correo.' };
    }

    if (found.password && found.password !== password.trim()) {
      return { success: false, message: 'La contraseña ingresada es incorrecta.' };
    }

    setCurrentClient(found);
    return { success: true, client: found };
  }, [clients]);

  const clientLogout = useCallback(() => {
    setCurrentClient(null);
  }, []);

  const clientRecoverPassword = useCallback((identifier: string) => {
    const clean = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    const found = clients.find(c => {
      const matchEmail = c.email?.toLowerCase() === clean;
      const matchPhone = c.whatsapp.replace(/\D/g, '').includes(cleanDigits) && cleanDigits.length >= 8;
      return matchEmail || matchPhone;
    });

    if (!found) {
      return { success: false, message: 'No existe ninguna cuenta asociada a este correo o WhatsApp.' };
    }

    const passToRecover = found.password || 'jenyx123';
    return {
      success: true,
      message: `Tu contraseña registrada es: "${passToRecover}". También puedes cambiarla ingresando a tu cuenta.`
    };
  }, [clients]);

  // CSV EXPORT & IMPORT UTILITIES
  const exportClientsCSV = useCallback((): string => {
    const headers = ['ID', 'Nombre', 'WhatsApp', 'Email', 'Total_Pedidos', 'Suscripciones_Activas', 'Total_Gastado_MXN', 'Estado', 'Proximo_Vencimiento', 'Notas', 'Fecha_Registro'];
    const rows = clients.map(c => [
      c.id,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${c.whatsapp}"`,
      `"${c.email || ''}"`,
      c.totalOrders,
      c.activeSubscriptions,
      c.totalSpent,
      c.status,
      c.nextExpirationDate || '',
      `"${(c.notes || '').replace(/"/g, '""')}"`,
      c.createdAt
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }, [clients]);

  const importClientsCSV = useCallback((csvText: string) => {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) return { imported: 0, errors: ['El archivo está vacío o solo contiene encabezados'] };

    let importedCount = 0;
    const errors: string[] = [];
    const newClients: Client[] = [];

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Basic CSV splitter respecting quotes
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
      const cleanVal = (val?: string) => val ? val.replace(/^"|"$/g, '').trim() : '';

      const name = cleanVal(values[1] || values[0]);
      const whatsapp = cleanVal(values[2] || values[1]);
      const email = cleanVal(values[3] || values[2]);

      if (!name || !whatsapp) {
        errors.push(`Línea ${i + 1}: Faltan nombre o WhatsApp`);
        continue;
      }

      newClients.push({
        id: `cli-csv-${Date.now()}-${i}`,
        name,
        whatsapp,
        email: email || undefined,
        totalOrders: parseInt(cleanVal(values[4])) || 0,
        activeSubscriptions: parseInt(cleanVal(values[5])) || 0,
        totalSpent: parseFloat(cleanVal(values[6])) || 0,
        status: (cleanVal(values[7]) as Client['status']) || 'activo',
        lastOrderDate: cleanVal(values[8]) || undefined,
        nextExpirationDate: cleanVal(values[8]) || undefined,
        notes: cleanVal(values[9]) || 'Importado vía CSV',
        createdAt: cleanVal(values[10]) || new Date().toISOString().split('T')[0]
      });
      importedCount++;
    }

    if (newClients.length > 0) {
      setClients(prev => {
        // Merge or append
        const existingPhones = new Set(prev.map(c => c.whatsapp));
        const added = newClients.filter(c => !existingPhones.has(c.whatsapp));
        return [...added, ...prev];
      });
    }

    return { imported: importedCount, errors };
  }, []);

  const exportProductsCSV = useCallback((): string => {
    const headers = ['ID', 'Nombre', 'Categoria_ID', 'Categoria_Nombre', 'Tipo', 'Modalidad_Digital', 'Duracion', 'Precio_MXN', 'Precio_Original_MXN', 'Badge', 'Activo', 'URL_Imagen', 'URL_Descarga_Drive', 'Descripcion'];
    const rows = products.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.categoryId,
      `"${(p.categoryName || '').replace(/"/g, '""')}"`,
      p.type,
      p.itemCategory || 'streaming',
      `"${p.duration}"`,
      p.price,
      p.originalPrice || '',
      `"${(p.badge || '').replace(/"/g, '""')}"`,
      p.active ? '1' : '0',
      `"${p.image || ''}"`,
      `"${p.downloadUrl || ''}"`,
      `"${(p.description || '').replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }, [products]);

  const importProductsCSV = useCallback((csvText: string) => {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) return { imported: 0, errors: ['El archivo está vacío o solo contiene encabezados'] };

    let importedCount = 0;
    const errors: string[] = [];
    const newProducts: Product[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
      const cleanVal = (val?: string) => val ? val.replace(/^"|"$/g, '').trim() : '';

      const name = cleanVal(values[1]);
      const catId = cleanVal(values[2]) || categories[0]?.id || 'cat-netflix';
      const catName = cleanVal(values[3]) || categories.find(c => c.id === catId)?.name || 'Streaming';
      const type = (cleanVal(values[4]) as Product['type']) || 'perfil';
      const itemCategory = (cleanVal(values[5]) as Product['itemCategory']) || 'streaming';
      const duration = cleanVal(values[6]) || '1 Mes';
      const price = parseFloat(cleanVal(values[7])) || 50;

      if (!name) {
        errors.push(`Línea ${i + 1}: Nombre de producto requerido`);
        continue;
      }

      newProducts.push({
        id: `prod-csv-${Date.now()}-${i}`,
        categoryId: catId,
        categoryName: catName,
        name,
        type,
        itemCategory,
        duration,
        price,
        originalPrice: parseFloat(cleanVal(values[8])) || undefined,
        badge: cleanVal(values[9]) || undefined,
        active: cleanVal(values[10]) !== '0',
        image: cleanVal(values[11]) || undefined,
        downloadUrl: cleanVal(values[12]) || undefined,
        description: cleanVal(values[13]) || 'Producto importado por CSV.',
        features: ['Garantía oficial JENYX', 'Entrega inmediata']
      });
      importedCount++;
    }

    if (newProducts.length > 0) {
      setProducts(prev => [...newProducts, ...prev]);
    }

    return { imported: importedCount, errors };
  }, [categories]);

  // EXTRA SECURITY VAULT & PIN VERIFICATION
  const unlockVault = useCallback((pin: string): boolean => {
    if (pin.trim() === settings.vaultMasterPin) {
      setIsVaultUnlocked(true);
      return true;
    }
    return false;
  }, [settings.vaultMasterPin]);

  const lockVault = useCallback(() => {
    setIsVaultUnlocked(false);
  }, []);

  const verifyAdminPin = useCallback((pin: string): boolean => {
    return pin.trim() === settings.adminPin;
  }, [settings.adminPin]);

  const updateSecurityPins = useCallback((adminPin?: string, vaultPin?: string) => {
    setSettings(prev => ({
      ...prev,
      adminPin: adminPin ? adminPin.trim() : prev.adminPin,
      vaultMasterPin: vaultPin ? vaultPin.trim() : prev.vaultMasterPin
    }));
  }, []);

  // Admin Auth
  const currentAdminRole = currentAdmin?.role || null;

  const adminLoginWithGoogle = useCallback(async (): Promise<boolean> => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        const email = res.user.email?.toLowerCase() || '';
        const found = adminUsers.find(u => u.email.toLowerCase() === email);
        if (found) {
          setCurrentAdmin({ ...found, lastLogin: new Date().toLocaleString() });
          return true;
        } else {
          const newOp: AdminUser = {
            id: res.user.uid,
            email: res.user.email || 'admin@jenyx.com',
            name: res.user.displayName || 'Operador JENYX',
            role: email === 'ticket.cut24@gmail.com' ? 'admin' : 'vendedor',
            avatar: res.user.photoURL || '/assets/aistudio/jenix_4fac0935.jpeg',
            active: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toLocaleString()
          };
          setAdminUsers(prev => [newOp, ...prev]);
          setCurrentAdmin(newOp);
          return true;
        }
      }
    } catch (err) {
      console.warn('Google sign-in skipped or cancelled:', err);
    }
    return false;
  }, [adminUsers]);

  const adminLoginQuick = useCallback((role: 'admin' | 'vendedor', email?: string) => {
    const target = adminUsers.find(u => (email ? u.email === email : u.role === role)) || adminUsers[0];
    if (target) {
      setCurrentAdmin({ ...target, lastLogin: new Date().toLocaleString() });
    }
  }, [adminUsers]);

  const adminLogout = useCallback(() => {
    setCurrentAdmin(null);
    setIsVaultUnlocked(false);
    try {
      signOut(auth).catch(() => {});
    } catch (e) {
      // ignore
    }
  }, []);

  const addAdminUser = useCallback((user: Omit<AdminUser, 'id' | 'createdAt'>) => {
    const newUser: AdminUser = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAdminUsers(prev => [...prev, newUser]);
    return newUser;
  }, []);

  const updateAdminUser = useCallback((user: AdminUser) => {
    setAdminUsers(prev => prev.map(u => u.id === user.id ? user : u));
    if (currentAdmin?.id === user.id) {
      setCurrentAdmin(user);
    }
  }, [currentAdmin]);

  const deleteAdminUser = useCallback((id: string) => {
    setAdminUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  const resetToDefaultData = useCallback(() => {
    setSettings(INITIAL_SETTINGS);
    setCategories(INITIAL_CATEGORIES);
    setProducts(INITIAL_PRODUCTS);
    setAccounts(INITIAL_ACCOUNTS);
    setOrders(INITIAL_ORDERS);
    setClients(INITIAL_CLIENTS);
    setAdminUsers(INITIAL_ADMIN_USERS);
    setCurrentAdmin(INITIAL_ADMIN_USERS[0]);
    setCurrentClient(null);
    setWarrantyClaims(INITIAL_WARRANTY_CLAIMS);
    setIsVaultUnlocked(false);
    localStorage.clear();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        settings,
        categories,
        products,
        accounts,
        orders,
        clients,
        adminUsers,
        currentAdmin,
        currentClient,
        metrics,
        warrantyClaims,
        createWarrantyClaim,
        resolveWarrantyClaim,
        updateWarrantyClaimStatus,
        deleteWarrantyClaim,
        updateSettings,
        addCategory,
        updateCategory,
        deleteCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        addAccount,
        updateAccount,
        deleteAccount,
        freeProfile,
        updateProfile,
        deleteProfileFromAccount,
        createOrder,
        updateOrder,
        updateOrderStatus,
        approveOrder,
        rejectOrder,
        deleteOrder,
        renewOrder,
        updateClient,
        deleteClient,
        creditClientBalance,
        clientRegister,
        clientLogin,
        clientLogout,
        clientRecoverPassword,
        exportClientsCSV,
        importClientsCSV,
        exportProductsCSV,
        importProductsCSV,
        isVaultUnlocked,
        unlockVault,
        lockVault,
        verifyAdminPin,
        updateSecurityPins,
        currentAdminRole,
        adminLoginWithGoogle,
        adminLoginQuick,
        adminLogout,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        resetToDefaultData
      }}

    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
