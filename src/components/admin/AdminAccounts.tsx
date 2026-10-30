import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { StreamingAccount, ProfileItem } from '../../types';
import { 
  Tv, 
  Plus, 
  Key, 
  Mail, 
  Lock, 
  Users, 
  Calendar, 
  Check, 
  Copy, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ShieldAlert,
  Unlock,
  AlertCircle,
  X,
  RefreshCw
} from 'lucide-react';

export const AdminAccounts: React.FC = () => {
  const { 
    accounts, 
    categories, 
    addAccount, 
    updateAccount, 
    deleteAccount, 
    freeProfile,
    updateProfile,
    deleteProfileFromAccount,
    isVaultUnlocked,
    unlockVault,
    lockVault
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<StreamingAccount | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [id: string]: boolean }>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Profile Edit Modal State
  const [editingProfileData, setEditingProfileData] = useState<{
    accountId: string;
    accountServiceName: string;
    accountEmail: string;
    profileId: string;
    profileNumber: number;
    name: string;
    pin: string;
    status: 'libre' | 'ocupado';
    assignedClientName?: string;
    assignedClientWhatsApp?: string;
    assignedOrderId?: string;
    expiresAt?: string;
  } | null>(null);

  // Vault Unlock Modal
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [vaultPinInput, setVaultPinInput] = useState('');
  const [vaultError, setVaultError] = useState<string | null>(null);

  // New account form state
  const [formService, setFormService] = useState('Netflix 4K Ultra HD');
  const [formCatId, setFormCatId] = useState(categories[0]?.id || 'cat-netflix');
  const [formEmail, setFormEmail] = useState('');
  const [formPass, setFormPass] = useState('');
  const [formMasterPin, setFormMasterPin] = useState('1234');
  const [formMaxProfiles, setFormMaxProfiles] = useState(5);
  const [formExpiration, setFormExpiration] = useState('2026-12-31');
  const [formNotes, setFormNotes] = useState('');
  const [formProfiles, setFormProfiles] = useState<ProfileItem[]>([]);


  const togglePassword = (accId: string) => {
    if (!isVaultUnlocked) {
      setShowVaultModal(true);
      return;
    }
    setVisiblePasswords(prev => ({ ...prev, [accId]: !prev[accId] }));
  };

  const copyText = (txt: string, keyName: string) => {
    if (!isVaultUnlocked) {
      setShowVaultModal(true);
      return;
    }
    navigator.clipboard.writeText(txt);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleUnlockVault = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockVault(vaultPinInput)) {
      setShowVaultModal(false);
      setVaultPinInput('');
      setVaultError(null);
    } else {
      setVaultError('PIN de Bóveda incorrecto. Intenta de nuevo.');
    }
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail.trim() || !formPass.trim()) return;

    if (editingAccount) {
      updateAccount({
        ...editingAccount,
        categoryId: formCatId,
        serviceName: formService,
        email: formEmail.trim(),
        password: formPass.trim(),
        masterPin: formMasterPin.trim(),
        maxProfiles: formProfiles.length,
        expirationDate: formExpiration,
        notes: formNotes,
        profiles: formProfiles
      });
      setEditingAccount(null);
    } else {
      const generatedProfiles: ProfileItem[] = formProfiles.length > 0
        ? formProfiles
        : Array.from({ length: formMaxProfiles }, (_, idx) => ({
            id: `prof-${Date.now()}-${idx + 1}`,
            profileNumber: idx + 1,
            name: `Perfil ${idx + 1}`,
            pin: Math.floor(1000 + Math.random() * 9000).toString(),
            status: 'libre'
          }));

      addAccount({
        categoryId: formCatId,
        serviceName: formService,
        email: formEmail.trim(),
        password: formPass.trim(),
        masterPin: formMasterPin.trim(),
        maxProfiles: generatedProfiles.length,
        status: 'activa',
        expirationDate: formExpiration,
        notes: formNotes,
        profiles: generatedProfiles
      });
    }

    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormService('Netflix 4K Ultra HD');
    setFormEmail('');
    setFormPass('');
    setFormMasterPin('1234');
    setFormMaxProfiles(5);
    setFormExpiration('2026-12-31');
    setFormNotes('');
    setFormProfiles(Array.from({ length: 5 }, (_, idx) => ({
      id: `prof-${Date.now()}-${idx + 1}`,
      profileNumber: idx + 1,
      name: `Perfil ${idx + 1}`,
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
      status: 'libre'
    })));
  };

  const openEdit = (acc: StreamingAccount) => {
    if (!isVaultUnlocked) {
      setShowVaultModal(true);
      return;
    }
    setEditingAccount(acc);
    setFormService(acc.serviceName);
    setFormCatId(acc.categoryId);
    setFormEmail(acc.email);
    setFormPass(acc.password);
    setFormMasterPin(acc.masterPin || '1234');
    setFormMaxProfiles(acc.profiles.length);
    setFormExpiration(acc.expirationDate);
    setFormNotes(acc.notes || '');
    setFormProfiles(acc.profiles);
    setShowAddModal(true);
  };

  const openEditProfile = (acc: StreamingAccount, prof: ProfileItem) => {
    setEditingProfileData({
      accountId: acc.id,
      accountServiceName: acc.serviceName,
      accountEmail: acc.email,
      profileId: prof.id,
      profileNumber: prof.profileNumber,
      name: prof.name,
      pin: prof.pin,
      status: prof.status,
      assignedClientName: prof.assignedClientName,
      assignedClientWhatsApp: prof.assignedClientWhatsApp,
      assignedOrderId: prof.assignedOrderId,
      expiresAt: prof.expiresAt
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfileData) return;
    if (!editingProfileData.name.trim() || !editingProfileData.pin.trim()) {
      alert('El nombre y el PIN del perfil no pueden estar vacíos.');
      return;
    }
    updateProfile(editingProfileData.accountId, editingProfileData.profileId, {
      name: editingProfileData.name.trim(),
      pin: editingProfileData.pin.trim(),
      status: editingProfileData.status
    });
    setEditingProfileData(null);
  };

  const generateRandomPin = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };


  const handleAddProfileToAcc = (acc: StreamingAccount) => {
    const nextNum = acc.profiles.length + 1;
    const newProf: ProfileItem = {
      id: `prof-${Date.now()}-${nextNum}`,
      profileNumber: nextNum,
      name: `Perfil ${nextNum}`,
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
      status: 'libre'
    };
    updateAccount({
      ...acc,
      maxProfiles: acc.maxProfiles + 1,
      profiles: [...acc.profiles, newProf]
    });
  };

  const filteredAccounts = accounts.filter(a => {
    if (selectedCategory !== 'all' && a.categoryId !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8CC6]">
            ✦ Operación &bull; Inventario Streaming & Cuentas Madre
          </span>
          <h2 className="text-2xl font-bold font-cinzel text-white mt-1">
            Cuentas Madre y Perfiles ({accounts.length})
          </h2>
          <p className="text-xs text-[#A394AE]">
            Bóveda de máxima seguridad para credenciales maestras y gestión de perfiles con PIN.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {isVaultUnlocked ? (
            <button
              onClick={lockVault}
              className="py-2 px-3.5 rounded-xl font-bold text-xs bg-red-950/60 border border-red-500/50 text-red-300 hover:bg-red-900/60 flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Bloquear Bóveda</span>
            </button>
          ) : (
            <button
              onClick={() => setShowVaultModal(true)}
              className="py-2 px-3.5 rounded-xl font-bold text-xs bg-[#FF2E93]/20 border border-[#FF2E93] text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,46,147,0.3)] transition-all"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Desbloquear Bóveda con PIN</span>
            </button>
          )}

          <button
            onClick={() => {
              if (!isVaultUnlocked) {
                setShowVaultModal(true);
                return;
              }
              resetForm();
              setEditingAccount(null);
              setShowAddModal(true);
            }}
            className="py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider neon-btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Cuenta Madre</span>
          </button>
        </div>
      </div>

      {/* SECURITY VAULT BANNER */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isVaultUnlocked 
          ? 'bg-[#3DDC97]/10 border-[#3DDC97]/40 text-[#3DDC97]'
          : 'bg-[#12091A] border-[#FF2E93]/50 text-[#FF8CC6] shadow-[0_0_20px_rgba(255,46,147,0.2)]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isVaultUnlocked ? 'bg-[#3DDC97]/20 text-[#3DDC97]' : 'bg-[#FF2E93]/20 text-[#FF2E93]'}`}>
            {isVaultUnlocked ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <div className="font-bold text-sm text-white flex items-center gap-2">
              <span>{isVaultUnlocked ? 'Bóveda de Cuentas Madre: DESBLOQUEADA' : 'Bóveda de Cuentas Madre: PROTEGIDA CON MÁXIMA SEGURIDAD'}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${isVaultUnlocked ? 'bg-[#3DDC97]/30 text-[#3DDC97]' : 'bg-[#FF2E93]/30 text-[#FF8CC6]'}`}>
                {isVaultUnlocked ? 'Sesión Abierta' : 'Credenciales Ocultas'}
              </span>
            </div>
            <p className="text-xs text-[#A394AE] mt-0.5">
              {isVaultUnlocked 
                ? 'Las contraseñas de las cuentas madre son visibles y editables. Se cerrará automáticamente por seguridad tras 15 min.' 
                : 'Las contraseñas maestras y correos de tus cuentas están cifrados y enmascarados hasta que ingreses tu PIN de Bóveda.'}
            </p>
          </div>
        </div>

        {!isVaultUnlocked && (
          <button
            onClick={() => setShowVaultModal(true)}
            className="py-2 px-4 rounded-xl text-xs font-bold bg-[#FF2E93] text-white hover:bg-[#FF45A2] shadow-[0_0_12px_rgba(255,46,147,0.6)] whitespace-nowrap"
          >
            Ingresar PIN de Bóveda
          </button>
        )}
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'neon-btn-primary'
              : 'bg-[#12091A] text-[#C9C4D4] border border-white/10'
          }`}
        >
          Todas ({accounts.length})
        </button>
        {categories.map(c => {
          const count = accounts.filter(a => a.categoryId === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === c.id
                  ? 'neon-btn-primary'
                  : 'bg-[#12091A] text-[#C9C4D4] border border-white/10'
              }`}
            >
              <span>{c.name}</span>
              <span className="text-[10px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* ACCOUNTS LIST */}
      <div className="space-y-6">
        {filteredAccounts.map((acc) => {
          const freeCount = acc.profiles.filter(p => p.status === 'libre').length;
          const occupiedCount = acc.profiles.filter(p => p.status === 'ocupado').length;
          const isShowPass = visiblePasswords[acc.id] && isVaultUnlocked;

          return (
            <div
              key={acc.id}
              className="goth-card rounded-2xl p-6 space-y-5 border-[#FF2E93]/35 shadow-[0_0_25px_rgba(255,46,147,0.1)]"
            >
              {/* Account Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-xl bg-[#FF2E93]/15 text-[#FF2E93] border border-[#FF2E93]/30 shrink-0">
                    <Tv className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg font-bold text-white">{acc.serviceName}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#3DDC97]/20 text-[#3DDC97] border border-[#3DDC97]/40 uppercase">
                        {acc.status}
                      </span>
                      {!isVaultUnlocked && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950/70 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Protegida
                        </span>
                      )}
                    </div>

                    {/* Master Credentials */}
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs">
                      {/* Email */}
                      <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
                        <Mail className="w-3.5 h-3.5 text-[#FF8CC6]" />
                        <span className="font-mono text-white select-all">
                          {isVaultUnlocked ? acc.email : acc.email.replace(/(.{2})(.*)(@.*)/, '$1••••$3')}
                        </span>
                        <button
                          onClick={() => copyText(acc.email, `mail-${acc.id}`)}
                          className="text-gray-400 hover:text-white ml-1"
                          title="Copiar correo"
                        >
                          {copiedKey === `mail-${acc.id}` ? <Check className="w-3 h-3 text-[#3DDC97]" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      {/* Password */}
                      <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
                        <Lock className="w-3.5 h-3.5 text-[#FF8CC6]" />
                        <span className="font-mono text-white">
                          {isShowPass ? acc.password : '••••••••••••'}
                        </span>
                        <button
                          onClick={() => togglePassword(acc.id)}
                          className="text-gray-400 hover:text-white ml-1"
                          title={isVaultUnlocked ? 'Ver u ocultar' : 'Desbloquear bóveda para ver'}
                        >
                          {isShowPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => copyText(acc.password, `pass-${acc.id}`)}
                          className="text-gray-400 hover:text-white ml-1"
                          title="Copiar contraseña"
                        >
                          {copiedKey === `pass-${acc.id}` ? <Check className="w-3 h-3 text-[#3DDC97]" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      {/* Master PIN */}
                      {acc.masterPin && (
                        <div className="flex items-center gap-1 text-[11px] text-[#A394AE]">
                          <span>PIN Titular:</span>
                          <strong className="font-mono text-white">
                            {isVaultUnlocked ? acc.masterPin : '••••'}
                          </strong>
                        </div>
                      )}

                      {/* Expiration date */}
                      <div className="flex items-center gap-1 text-[11px] text-[#A394AE]">
                        <Calendar className="w-3 h-3 text-[#FF2E93]" />
                        <span>Vence cuenta:</span>
                        <strong className="text-white">{acc.expirationDate}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Summary & Edit */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] text-[#A394AE] block">Perfiles:</span>
                    <span className="text-xs font-bold text-white">
                      <strong className="text-[#3DDC97]">{freeCount} Libres</strong> / <strong className="text-[#FF8CC6]">{occupiedCount} Ocupados</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => openEdit(acc)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#C9C4D4] hover:text-white border border-white/10"
                    title="Editar cuenta master"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (!isVaultUnlocked) {
                        setShowVaultModal(true);
                        return;
                      }
                      if (confirm(`¿Eliminar la cuenta ${acc.email} y todos sus perfiles?`)) {
                        deleteAccount(acc.id);
                      }
                    }}
                    className="p-2 rounded-xl text-red-400 hover:bg-red-950/40 border border-red-500/20"
                    title="Eliminar cuenta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Profiles Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF8CC6] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Perfiles Configurados ({acc.profiles.length})</span>
                  </h4>
                  <button
                    onClick={() => handleAddProfileToAcc(acc)}
                    className="text-[11px] font-semibold text-[#FF8CC6] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Agregar Perfil Extra</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                  {acc.profiles.map((p) => {
                    const isOccupied = p.status === 'ocupado';
                    return (
                      <div
                        key={p.id}
                        className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                          isOccupied
                            ? 'bg-gradient-to-b from-[#1C0E28] to-[#12091A] border-[#FF2E93]/40 shadow-[0_0_10px_rgba(255,46,147,0.15)]'
                            : 'bg-[#0B0612] border-[#3DDC97]/30 hover:border-[#3DDC97]'
                        }`}
                      >
                        <div className="space-y-2">
                          {/* Header with Name, Status and Edit button */}
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5 truncate flex-1">
                              <span className="font-bold text-white text-xs truncate" title={p.name}>
                                {p.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => openEditProfile(acc, p)}
                                className="p-1 rounded text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white transition-colors shrink-0"
                                title="Editar nombre y PIN de este perfil"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>

                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                              isOccupied ? 'bg-[#FF2E93]/20 text-[#FF8CC6] border border-[#FF2E93]/30' : 'bg-[#3DDC97]/20 text-[#3DDC97] border border-[#3DDC97]/30'
                            }`}>
                              {p.status}
                            </span>
                          </div>

                          {/* PIN Display & Edit */}
                          <div className="flex items-center justify-between bg-black/50 px-2.5 py-1.5 rounded-lg border border-white/5">
                            <span className="text-[10px] text-[#A394AE]">PIN:</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-[#3DDC97] text-sm tracking-wider">{p.pin}</span>
                              <button
                                type="button"
                                onClick={() => openEditProfile(acc, p)}
                                className="p-1 rounded text-[#FF8CC6] hover:text-white hover:bg-white/10 transition-colors"
                                title="Modificar PIN o Nombre"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {isOccupied && (
                            <div className="text-[11px] text-[#C9C4D4] space-y-0.5 pt-1 border-t border-white/5">
                              <div className="truncate">Cliente: <strong className="text-white">{p.assignedClientName}</strong></div>
                              {p.assignedOrderId && (
                                <div className="text-[10px] text-gray-400 font-mono">Folio: {p.assignedOrderId}</div>
                              )}
                              {p.expiresAt && (
                                <div className="text-[10px] text-[#FFB020]">
                                  Vence: {new Date(p.expiresAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Profile Action buttons */}
                        <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between gap-1.5">
                          {isOccupied ? (
                            <>
                              <button
                                type="button"
                                onClick={() => freeProfile(acc.id, p.id)}
                                className="flex-1 py-1 px-2 rounded-lg text-[10px] font-bold bg-[#FF2E93]/15 text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white transition-colors flex items-center justify-center gap-1"
                                title="Liberar para que otro cliente pueda comprarlo"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Liberar</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditProfile(acc, p)}
                                className="py-1 px-2 rounded-lg text-[10px] font-semibold bg-[#12091A] border border-[#FF2E93]/40 text-[#FF8CC6] hover:bg-[#FF2E93] hover:text-white transition-colors flex items-center gap-1"
                                title="Editar nombre y PIN del perfil"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Editar</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="text-[10px] text-[#3DDC97] font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Disponible
                              </span>
                              <button
                                type="button"
                                onClick={() => openEditProfile(acc, p)}
                                className="py-1 px-2 rounded-lg text-[10px] font-semibold bg-[#12091A] border border-[#3DDC97]/40 text-[#3DDC97] hover:bg-[#3DDC97] hover:text-[#07040C] transition-colors flex items-center gap-1"
                                title="Editar nombre y PIN de este perfil"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Editar Perfil</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* VAULT PIN UNLOCK MODAL */}
      {showVaultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-[#12091A] border-2 border-[#FF2E93] rounded-3xl p-6 space-y-4 shadow-[0_0_50px_rgba(255,46,147,0.5)]">
            <div className="w-14 h-14 rounded-full bg-[#FF2E93]/20 border-2 border-[#FF2E93] flex items-center justify-center mx-auto text-[#FF2E93] shadow-[0_0_20px_rgba(255,46,147,0.5)]">
              <Lock className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold font-cinzel text-white">
                Bóveda de Cuentas Madre
              </h3>
              <p className="text-xs text-[#A394AE]">
                Ingresa tu PIN de Seguridad de Bóveda para acceder a las credenciales maestras.
              </p>
            </div>

            {vaultError && (
              <div className="p-2.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{vaultError}</span>
              </div>
            )}

            <form onSubmit={handleUnlockVault} className="space-y-4">
              <div className="max-w-[180px] mx-auto">
                <input
                  type="password"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="••••"
                  value={vaultPinInput}
                  onChange={(e) => setVaultPinInput(e.target.value)}
                  className="w-full text-center tracking-[0.4em] font-mono text-2xl py-2.5 rounded-xl bg-[#0B0612] border-2 border-[#FF2E93] text-white focus:outline-none"
                />
              </div>

              <div className="text-[10px] text-gray-500 text-center">
                (PIN predeterminado: <strong>7799</strong> - configurable en Ajustes)
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowVaultModal(false); setVaultError(null); }}
                  className="w-1/2 py-2.5 rounded-xl bg-[#0B0612] text-xs font-semibold text-white border border-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider neon-btn-primary"
                >
                  Desbloquear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT STREAMING ACCOUNT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#12091A] border-2 border-[#FF2E93] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold font-cinzel text-white">
                {editingAccount ? 'Editar Cuenta Madre' : 'Registrar Nueva Cuenta Madre'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#FF8CC6] font-semibold mb-1">Categoría</label>
                  <select
                    value={formCatId}
                    onChange={(e) => {
                      setFormCatId(e.target.value);
                      const cat = categories.find(c => c.id === e.target.value);
                      if (cat) setFormService(cat.name);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#FF8CC6] font-semibold mb-1">Nombre del Servicio</label>
                  <input
                    type="text"
                    required
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Correo Electrónico de la Cuenta Madre *</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo.streaming@gmail.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#FF8CC6] font-semibold mb-1">Contraseña Maestra *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contraseña segura"
                    value={formPass}
                    onChange={(e) => setFormPass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#FF8CC6] font-semibold mb-1">PIN Titular / Master</label>
                  <input
                    type="text"
                    placeholder="8899"
                    value={formMasterPin}
                    onChange={(e) => setFormMasterPin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#FF8CC6] font-semibold mb-1">Número de Perfiles</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formProfiles.length}
                    onChange={(e) => {
                      const newCount = Math.max(1, Math.min(10, parseInt(e.target.value) || 1));
                      setFormMaxProfiles(newCount);
                      if (newCount > formProfiles.length) {
                        const added: ProfileItem[] = Array.from({ length: newCount - formProfiles.length }, (_, idx) => {
                          const num = formProfiles.length + idx + 1;
                          return {
                            id: `prof-${Date.now()}-${num}`,
                            profileNumber: num,
                            name: `Perfil ${num}`,
                            pin: Math.floor(1000 + Math.random() * 9000).toString(),
                            status: 'libre'
                          };
                        });
                        setFormProfiles([...formProfiles, ...added]);
                      } else if (newCount < formProfiles.length) {
                        setFormProfiles(formProfiles.slice(0, newCount));
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#FF8CC6] font-semibold mb-1">Fecha Vencimiento Proveedor</label>
                  <input
                    type="date"
                    value={formExpiration}
                    onChange={(e) => setFormExpiration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Notas internas (Opcional)</label>
                <input
                  type="text"
                  placeholder="Proveedor, tarjeta asociada, etc."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none"
                />
              </div>

              {/* PROFILES EDITING LIST INSIDE ACCOUNT MODAL */}
              <div className="pt-2 border-t border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[#FF8CC6] font-semibold text-xs flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Perfiles de la Cuenta Madre ({formProfiles.length}) &bull; Nombres y PINs</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const num = formProfiles.length + 1;
                      const newP: ProfileItem = {
                        id: `prof-${Date.now()}-${num}`,
                        profileNumber: num,
                        name: `Perfil ${num}`,
                        pin: Math.floor(1000 + Math.random() * 9000).toString(),
                        status: 'libre'
                      };
                      setFormProfiles([...formProfiles, newP]);
                      setFormMaxProfiles(num);
                    }}
                    className="text-[11px] text-[#3DDC97] hover:underline font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Añadir perfil</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {formProfiles.map((p, idx) => (
                    <div key={p.id} className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#FF2E93]/20 text-[#FF8CC6] flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => {
                          const updated = [...formProfiles];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setFormProfiles(updated);
                        }}
                        placeholder="Nombre del perfil"
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#0B0612] border border-white/10 text-white text-xs focus:border-[#FF2E93] focus:outline-none"
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] text-[#A394AE]">PIN:</span>
                        <input
                          type="text"
                          value={p.pin}
                          maxLength={8}
                          onChange={(e) => {
                            const updated = [...formProfiles];
                            updated[idx] = { ...updated[idx], pin: e.target.value };
                            setFormProfiles(updated);
                          }}
                          placeholder="PIN"
                          className="w-16 px-2 py-1.5 rounded-lg bg-[#0B0612] border border-[#3DDC97]/40 text-[#3DDC97] font-mono text-xs font-bold text-center focus:border-[#3DDC97] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formProfiles];
                            updated[idx] = { ...updated[idx], pin: generateRandomPin() };
                            setFormProfiles(updated);
                          }}
                          className="p-1 text-[#3DDC97] hover:text-white"
                          title="Generar PIN aleatorio"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      </div>
                      {formProfiles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formProfiles.filter((_, i) => i !== idx);
                            setFormProfiles(updated);
                            setFormMaxProfiles(updated.length);
                          }}
                          className="p-1 text-gray-500 hover:text-red-400"
                          title="Quitar este perfil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0B0612] text-white hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold neon-btn-primary shadow-[0_0_15px_rgba(255,46,147,0.4)]"
                >
                  Guardar Cuenta Madre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEDICATED PROFILE EDIT MODAL (NOMBRE Y PIN) */}
      {editingProfileData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#12091A] border-2 border-[#FF2E93] rounded-3xl p-6 space-y-5 shadow-[0_0_50px_rgba(255,46,147,0.35)]">
            {/* Top neon strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#7A1236] via-[#FF2E93] to-[#FF8CC6] absolute top-0 left-0 rounded-t-3xl" />

            <button
              onClick={() => setEditingProfileData(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-[#0B0612] border border-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="border-b border-white/10 pb-3 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF8CC6] flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-[#FF2E93]" />
                Edición de Perfil de Streaming
              </span>
              <h3 className="text-xl font-bold font-cinzel text-white mt-1">
                Editar {editingProfileData.name}
              </h3>
              <p className="text-xs text-[#A394AE] truncate">
                {editingProfileData.accountServiceName} &bull; <span className="font-mono text-white/90">{editingProfileData.accountEmail}</span>
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* Profile Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  Nombre del Perfil *
                </label>
                <input
                  type="text"
                  required
                  value={editingProfileData.name}
                  onChange={(e) => setEditingProfileData({ ...editingProfileData, name: e.target.value })}
                  placeholder="ej. Perfil 1 (4K), Perfil Niños, VIP Santiago"
                  className="w-full py-2.5 px-3.5 rounded-xl bg-[#0B0612] border border-[#FF2E93]/40 text-white font-medium focus:outline-none focus:border-[#FF2E93]"
                />
                <span className="text-[10px] text-[#A394AE]">
                  Este es el nombre con el que el cliente identificará su pantalla en la plataforma.
                </span>
              </div>

              {/* PIN Input with Random Generator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    PIN de Acceso al Perfil *
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditingProfileData({ ...editingProfileData, pin: generateRandomPin() })}
                    className="text-[10px] text-[#3DDC97] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Generar PIN aleatorio
                  </button>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={editingProfileData.pin}
                    onChange={(e) => setEditingProfileData({ ...editingProfileData, pin: e.target.value })}
                    placeholder="1234"
                    className="w-full py-2.5 pl-3.5 pr-20 rounded-xl bg-[#0B0612] border border-[#3DDC97]/40 text-[#3DDC97] font-mono text-base font-bold tracking-widest focus:outline-none focus:border-[#3DDC97]"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => copyText(editingProfileData.pin, 'edit-pin')}
                      className="p-1 rounded bg-[#12091A] text-[#FF8CC6] hover:text-white"
                      title="Copiar PIN"
                    >
                      {copiedKey === 'edit-pin' ? <Check className="w-3.5 h-3.5 text-[#3DDC97]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <span className="text-[10px] text-[#A394AE]">
                  PIN numérico para proteger y bloquear el perfil del cliente.
                </span>
              </div>

              {/* Status Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  Estado de Ocupación
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProfileData({ ...editingProfileData, status: 'libre' })}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      editingProfileData.status === 'libre'
                        ? 'bg-[#3DDC97]/20 border-[#3DDC97] text-[#3DDC97]'
                        : 'bg-[#0B0612] border-white/10 text-gray-400'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Libre (Disponible)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingProfileData({ ...editingProfileData, status: 'ocupado' })}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      editingProfileData.status === 'ocupado'
                        ? 'bg-[#FF2E93]/20 border-[#FF2E93] text-[#FF8CC6]'
                        : 'bg-[#0B0612] border-white/10 text-gray-400'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Ocupado (Asignado)</span>
                  </button>
                </div>
              </div>

              {/* Assignment details if occupied */}
              {editingProfileData.status === 'ocupado' && editingProfileData.assignedClientName && (
                <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1 text-[11px] text-[#C9C4D4]">
                  <div className="text-[#FF8CC6] font-semibold flex items-center justify-between">
                    <span>Cliente: {editingProfileData.assignedClientName}</span>
                    {editingProfileData.assignedOrderId && (
                      <span className="font-mono text-white text-[10px]">{editingProfileData.assignedOrderId}</span>
                    )}
                  </div>
                  {editingProfileData.assignedClientWhatsApp && (
                    <div>WhatsApp: <strong className="text-white">{editingProfileData.assignedClientWhatsApp}</strong></div>
                  )}
                  {editingProfileData.expiresAt && (
                    <div className="text-[#FFB020]">Vence: {new Date(editingProfileData.expiresAt).toLocaleDateString()}</div>
                  )}
                  <p className="text-[10px] text-[#A394AE] pt-1">
                    ✦ Al guardar, los nuevos datos se sincronizan al instante en el portal del cliente.
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`¿Eliminar este perfil (${editingProfileData.name}) de la cuenta madre?`)) {
                      deleteProfileFromAccount(editingProfileData.accountId, editingProfileData.profileId);
                      setEditingProfileData(null);
                    }
                  }}
                  className="py-2 px-3 rounded-xl text-red-400 hover:bg-red-950/40 border border-red-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar Perfil</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProfileData(null)}
                    className="py-2.5 px-4 rounded-xl font-semibold bg-[#0B0612] border border-white/10 text-white hover:border-white/20 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl font-bold neon-btn-primary flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,46,147,0.4)]"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

