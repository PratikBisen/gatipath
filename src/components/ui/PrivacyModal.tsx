import React from 'react';
import { ShieldCheck, X, CheckCircle2, Lock, EyeOff, Server, FileText } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-[#E0D8CC] max-w-2xl w-full p-6 sm:p-8 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#EAF2ED] text-[#1B4332] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#1A1817]">
                Child Data Safety & Privacy Disclosure
              </h3>
              <p className="text-xs font-mono text-[#7A7265]">
                Statutory Alignment: India DPDP Act 2023 & COPPA Standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#7A7265] hover:text-[#1A1817] hover:bg-[#F2EDE4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#4A453D] leading-relaxed">
          <div className="p-3.5 bg-[#F9F7F2] rounded-lg border border-[#EAE3D6] space-y-1">
            <span className="font-bold text-[#1A1817] font-mono text-xs uppercase block">
              1. Minimization of Student Personal Identifiable Information (PII)
            </span>
            <p>
              GatiPath only retains a pseudonym display name, class level, and academic progress state. We never collect Aadhaar numbers, phone numbers, home addresses, biometric markers, or private contact details.
            </p>
          </div>

          <div className="p-3.5 bg-[#F9F7F2] rounded-lg border border-[#EAE3D6] space-y-1">
            <span className="font-bold text-[#1A1817] font-mono text-xs uppercase block">
              2. Student Record Isolation & Role-Based Access Shields
            </span>
            <p>
              Students have zero visibility into other students' attempt histories, diagnostic results, or teacher intervention directives. Teacher dossiers are strictly access-controlled via authorized role guards.
            </p>
          </div>

          <div className="p-3.5 bg-[#F9F7F2] rounded-lg border border-[#EAE3D6] space-y-1">
            <span className="font-bold text-[#1A1817] font-mono text-xs uppercase block">
              3. Zero Commercial Tracking or Advertising Beacons
            </span>
            <p>
              GatiPath has zero third-party advertising SDKs, zero behavioral trackers, and zero external telemetry cookies. Learner assessment data is never sold, shared, or monetized.
            </p>
          </div>

          <div className="p-3.5 bg-[#FAF3EB] rounded-lg border border-[#E8D4BE] space-y-1 text-[#8C6239]">
            <span className="font-bold text-[#1A1817] font-mono text-xs uppercase block">
              4. Honest Architecture & Sandbox Limitations
            </span>
            <p className="text-xs">
              This demonstration build runs a deterministic, client-persistent simulation environment (IndexedDB / LocalStorage) to enable offline execution without cloud database failure risks. In an institutional school deployment, cryptographic token-based server session authentication (JWT with HTTP-only cookies and Row-Level Security in PostgreSQL) will safeguard production records.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E8E2D8] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#112F23] transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
