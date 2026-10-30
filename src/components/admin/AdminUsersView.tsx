import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminUser, AdminRole } from '../../types';
import { 
  Users, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  UserCheck, 
  Mail, 
  Clock 
} from 'lucide-react';

export const AdminUsersView: React.FC = () => {
  const { adminUsers, addAdminUser, updateAdminUser, deleteAdminUser, currentAdmin } = useStore();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('vendedor');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    addAdminUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      active: true
    });

    setName('');
    setEmail('');
    setRole('vendedor');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF8CC6]">
            ✦ Configuración &bull; Permisos y Roles
          </span>
          <h2 className="text-2xl font-bold font-cinzel text-white mt-1">
            Usuarios y Operadores del Panel ({adminUsers.length})
          </h2>
          <p className="text-xs text-[#A394AE]">
            Control de accesos para administradores totales y personal de ventas.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider neon-btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Operador</span>
        </button>
      </div>

      {/* Users List */}
      <div className="goth-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0612] text-[#FF8CC6] uppercase font-bold tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Operador</th>
                <th className="py-3.5 px-4">Correo</th>
                <th className="py-3.5 px-4">Rol Asignado</th>
                <th className="py-3.5 px-4">Última Sesión</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {adminUsers.map((u) => {
                const isCurrent = currentAdmin?.id === u.id || currentAdmin?.email === u.email;

                return (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-[#FF2E93] bg-black shrink-0">
                          <img
                            src={u.avatar || '/assets/aistudio/jenix_4fac0935.jpeg'}
                            alt={u.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <strong className="text-white block text-sm">{u.name}</strong>
                          {isCurrent && (
                            <span className="text-[10px] text-[#3DDC97] font-semibold">
                              (Sesión Activa Ahora)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-gray-300">
                      {u.email}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-[#FF2E93]/20 text-[#FF8CC6] border border-[#FF2E93]/40'
                          : 'bg-purple-950/70 text-purple-300 border border-purple-500/40'
                      }`}>
                        {u.role === 'admin' ? 'Administrador' : 'Vendedor'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-400 text-[11px]">
                      {u.lastLogin || 'Reciente'}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => updateAdminUser({ ...u, active: !u.active })}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.active ? 'bg-[#3DDC97]/20 text-[#3DDC97]' : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {u.active ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {!isCurrent && (
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar al operador ${u.name}?`)) {
                              deleteAdminUser(u.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/40"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD USER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#12091A] border-2 border-[#FF2E93] rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">
              Registrar Nuevo Operador
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Valeria Luna"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  placeholder="operador@jenyx.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#FF8CC6] font-semibold mb-1">Rol en el Panel</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRole)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0612] border border-[#FF2E93]/30 text-white focus:outline-none"
                >
                  <option value="admin">Administrador (Acceso total)</option>
                  <option value="vendedor">Vendedor (Atención, pedidos y comprobantes)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0B0612] text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold neon-btn-primary"
                >
                  Guardar Operador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
