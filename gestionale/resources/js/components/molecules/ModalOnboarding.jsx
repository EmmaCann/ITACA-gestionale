import React, { useMemo, useState } from "react";
import { Link, router } from "@inertiajs/react";
import CustomModal from "../customModal.jsx";
import { acceptLegal } from "../../data/api/auth.js";

const ModalOnboarding = ({ isOpen, onboarding, onAccepted }) => {
    const [privacyOk, setPrivacyOk] = useState(false);
    const [termsOk, setTermsOk] = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    const canContinue = useMemo(() => privacyOk && termsOk, [privacyOk, termsOk]);

    const handleReject = () => {
        sessionStorage.removeItem("onboarding");
        router.post("/logout");
    };

    const handleAccept = async () => {
        setErr(null);
        setLoading(true);
        try {
            await acceptLegal();

            // aggiorna onboarding in sessionStorage: privacy ora ok
            const updated = {
                ...onboarding,
                needs_privacy: false,
            };
            sessionStorage.setItem("onboarding", JSON.stringify(updated));
            onAccepted?.(updated);
        } catch (e) {
            setErr("Errore durante il salvataggio dell'accettazione.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onRequestClose={() => {}}
            title="Privacy e Termini"
            className="modal-onboarding"
        >
            <div className="flex flex-col h-full">
                <h2 className="font-marcellusSC font-bold text-center text-[22px] mb-4">
                    Prima di continuare
                </h2>

                <p className="text-sm text-gray-600 font-marcellus mb-4">
                    Per accedere al gestionale devi accettare Privacy Policy e Termini e condizioni.
                </p>

                {err && (
                    <div className="p-2 text-sm bg-red-100 text-red-700 rounded mb-3">
                        {err}
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <label className="flex items-start gap-3 text-sm font-marcellus text-gray-700">
                        <input
                            type="checkbox"
                            checked={privacyOk}
                            onChange={(e) => setPrivacyOk(e.target.checked)}
                            className="mt-1"
                        />
                        <span>
                            Accetto la{" "}
                            <Link href="/privacy" className="text-bluPrimary hover:underline">
                                Privacy Policy
                            </Link>
                        </span>
                    </label>

                    <label className="flex items-start gap-3 text-sm font-marcellus text-gray-700">
                        <input
                            type="checkbox"
                            checked={termsOk}
                            onChange={(e) => setTermsOk(e.target.checked)}
                            className="mt-1"
                        />
                        <span>
                            Accetto i{" "}
                            <Link href="/termini-e-condizioni" className="text-bluPrimary hover:underline">
                                Termini e condizioni
                            </Link>
                        </span>
                    </label>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between">
                    <button
                        onClick={handleReject}
                        className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-[12px] font-marcellus text-gray-700 transition-colors duration-200"
                        disabled={loading}
                    >
                        Rifiuta
                    </button>

                    <button
                        onClick={handleAccept}
                        disabled={!canContinue || loading}
                        className={`px-6 py-2 rounded-[12px] font-marcellus text-white transition
                            ${canContinue && !loading ? "bg-bluPrimary hover:bg-bluSecondary" : "bg-gray-400 cursor-not-allowed"}
                        `}
                    >
                        {loading ? "Salvataggio..." : "Accetta e continua"}
                    </button>
                </div>
            </div>
        </CustomModal>
    );
};

export default ModalOnboarding;
