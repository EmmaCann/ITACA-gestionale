import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import CustomModal from "../customModal.jsx";
import { acceptLegal } from "../../data/api/auth.js";
import { cambiaPassword } from "../../data/api/utenti.js";

const ModalOnboarding = ({ isOpen, onboarding, onAccepted }) => {
    const [privacyOk, setPrivacyOk] = useState(false);
    const [termsOk, setTermsOk] = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    const canContinue = useMemo(
        () => privacyOk && termsOk,
        [privacyOk, termsOk]
    );
    const [step, setStep] = useState("legal");

    useEffect(() => {
    if (!onboarding) return;

    if (onboarding.needs_privacy === true) {
        setStep("legal");
        return;
    }

    if (
        onboarding.needs_privacy === false &&
        onboarding.needs_password_change === true
    ) {
        setStep("password");
    }
}, [onboarding]);


    const handleReject = () => {
        sessionStorage.removeItem("onboarding");
        router.post("/logout");
    };

    const handleAccept = async () => {
    setErr(null);
    setLoading(true);

    try {
        await acceptLegal();

        const updated = {
            ...onboarding,
            needs_privacy: false, 
        };

        sessionStorage.setItem("onboarding", JSON.stringify(updated));
        onAccepted(updated); // farà partire lo step password
    } catch (e) {
        setErr("Errore durante il salvataggio dell'accettazione.");
    } finally {
        setLoading(false);
    }
};

    const [passwords, setPasswords] = useState({
        old: "",
        new: "",
        confirm: "",
    });
    const [pwdError, setPwdError] = useState(null);

    const handleChangePassword = async () => {
        setPwdError(null);

        if (!passwords.old || !passwords.new || !passwords.confirm) {
            setPwdError("Compila tutti i campi");
            return;
        }
        if (passwords.new !== passwords.confirm) {
            setPwdError("Le nuove password non coincidono");
            return;
        }

        try {
            const res = await cambiaPassword({
                password_attuale: passwords.old,
                nuova_password: passwords.new,
                conferma_password: passwords.confirm,
            });

            if (res.data?.success) {
                const updated = {
                    ...onboarding,
                    needs_password_change: false,
                };

                sessionStorage.setItem("onboarding", JSON.stringify(updated));

                // ORA puoi chiudere tutto
                onAccepted(updated);
            }
        } catch {
            setPwdError("Errore durante il cambio password");
        }
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onRequestClose={() => {}}
            title="Privacy e Termini"
            className="modal-onboarding"
        >
            {step === "legal" && (
                <div className="flex flex-col h-full">
                    <h2 className="font-marcellusSC font-bold text-center text-[22px] mb-4">
                        Prima di continuare
                    </h2>

                    <p className="text-sm text-gray-600 font-marcellus mb-4">
                        Per accedere al gestionale devi accettare Privacy Policy
                        e Termini e condizioni.
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
                                <Link
                                    href="/privacy"
                                    className="text-bluPrimary hover:underline"
                                >
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
                                <Link
                                    href="/termini-e-condizioni"
                                    className="text-bluPrimary hover:underline"
                                >
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
                            ${
                                canContinue && !loading
                                    ? "bg-bluPrimary hover:bg-bluSecondary"
                                    : "bg-gray-400 cursor-not-allowed"
                            }
                        `}
                        >
                            {loading ? "Salvataggio..." : "Accetta e continua"}
                        </button>
                    </div>
                </div>
            )}
            {step === "password" && (
                <div className="flex flex-col h-full">
                    <h2 className="font-marcellusSC font-bold text-center text-[22px] mb-2">
                        Cambia password
                    </h2>

                    <p className="text-sm text-gray-600 font-marcellus text-center mb-6">
                        La password iniziale è uguale per tutti.
                        <br />
                        Devi cambiarla per continuare.
                    </p>

                    {pwdError && (
                        <div className="p-2 text-sm bg-red-100 text-red-700 rounded mb-4 text-center">
                            {pwdError}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <input
                            type="password"
                            placeholder="Password attuale"
                            className="p-3 border rounded-lg"
                            value={passwords.old}
                            onChange={(e) =>
                                setPasswords((p) => ({
                                    ...p,
                                    old: e.target.value,
                                }))
                            }
                        />

                        <input
                            type="password"
                            placeholder="Nuova password"
                            className="p-3 border rounded-lg"
                            value={passwords.new}
                            onChange={(e) =>
                                setPasswords((p) => ({
                                    ...p,
                                    new: e.target.value,
                                }))
                            }
                        />

                        <input
                            type="password"
                            placeholder="Conferma nuova password"
                            className="p-3 border rounded-lg md:col-span-2"
                            value={passwords.confirm}
                            onChange={(e) =>
                                setPasswords((p) => ({
                                    ...p,
                                    confirm: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={handleChangePassword}
                            className="bg-bluPrimary hover:bg-bluSecondary text-white px-8 py-3 rounded-[14px] font-marcellus transition"
                        >
                            Cambia password e continua
                        </button>
                    </div>
                </div>
            )}
        </CustomModal>
    );
};

export default ModalOnboarding;
