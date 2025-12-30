import React, { useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import Home from "./Home";
import logo from "../../../public/images/logo-itaca.png";
import { cambiaPassword } from "../data/api/utenti.js";
const colors = {
    background: "#ECEFF2",
    bluPrimary: "#3DA4DD",
    bluSecondary: "#6BB2DF",
    pinkPrimary: "#BB4E97",
    pinkSecondary: "#D084B7",
    navbar: "#C8C8C8",
    navbarActive: "#ECEFF2",
    bgContainer: "#DFE0E0",
};
const formatDate = (v) => {
    if (!v) return "—";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("it-IT");
};

const Profile = () => {
    const { utente } = usePage().props;

    const [passwords, setPasswords] = useState({
        old: "",
        new: "",
        confirm: "",
    });

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    // MOCK – da sostituire con dati DB
    // const privacyMock = {
    //     privacyAcceptedAt: "12/03/2025",
    //     termsAcceptedAt: "12/03/2025",
    // };

    const handlePasswordChange = async () => {
        setMessage(null);
        setError(null);

        if (passwords.new !== passwords.confirm) {
            setError("Le nuove password non coincidono.");
            return;
        }

        const payload = {
            password_attuale: passwords.old,
            nuova_password: passwords.new,
            conferma_password: passwords.confirm,
        };

        try {
            const res = await cambiaPassword(payload);

            if (res.data.errore) {
                setError(res.data.errore);
            } else if (res.data.success) {
                setMessage(res.data.messaggio);
                setPasswords({ old: "", new: "", confirm: "" });
            }
        } catch (err) {
            setError("Errore durante il cambio password.");
            console.error(err);
        }
    };

    return (
        <Home>
            <div className="p-6 flex justify-center">
                <div
                    className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6"
                    style={{ background: colors.bgContainer }}
                >
                    {/* Header */}
                    <div className="flex flex-col items-center mb-6">
                        <img src={logo} alt="Logo" className="w-24 mb-3" />
                        <h1 className="text-2xl font-marcellusSC text-gray-700">
                            Profilo Utente
                        </h1>
                    </div>

                    {/* DATI PERSONALI */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3 text-gray-700">
                            Dati Personali
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white rounded-xl p-4 shadow">
                            <div>
                                <p className="text-sm text-gray-500">Nome</p>
                                <p className="font-medium">{utente.nome}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Cognome</p>
                                <p className="font-medium">{utente.cognome}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{utente.email}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Telefono
                                </p>

                                {utente.telefono_1 || utente.telefono_2 ? (
                                    <div className="font-medium space-y-1">
                                        {utente.telefono_1 && (
                                            <p>{utente.telefono_1}</p>
                                        )}
                                        {utente.telefono_2 && (
                                            <p>{utente.telefono_2}</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="font-medium">—</p>
                                )}
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Username
                                </p>
                                <p className="font-medium">{utente.username}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Data di nascita
                                </p>
                                <p className="font-medium">
                                    {utente.nascita ?? "—"}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* CAMBIO PASSWORD */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3 text-gray-700">
                            Cambio Password
                        </h2>

                        <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-4">
                            {error && (
                                <div className="p-2 text-sm bg-red-100 text-red-700 rounded">
                                    {error}
                                </div>
                            )}

                            {message && (
                                <div className="p-2 text-sm bg-green-100 text-green-700 rounded">
                                    {message}
                                </div>
                            )}

                            <input
                                type="password"
                                placeholder="Password attuale"
                                className="p-2 rounded border"
                                value={passwords.old}
                                onChange={(e) =>
                                    setPasswords({
                                        ...passwords,
                                        old: e.target.value,
                                    })
                                }
                            />

                            <input
                                type="password"
                                placeholder="Nuova password"
                                className="p-2 rounded border"
                                value={passwords.new}
                                onChange={(e) =>
                                    setPasswords({
                                        ...passwords,
                                        new: e.target.value,
                                    })
                                }
                            />

                            <input
                                type="password"
                                placeholder="Conferma nuova password"
                                className="p-2 rounded border"
                                value={passwords.confirm}
                                onChange={(e) =>
                                    setPasswords({
                                        ...passwords,
                                        confirm: e.target.value,
                                    })
                                }
                            />

                            <button
                                className="px-4 py-2 rounded-lg text-white font-semibold transition-all"
                                style={{ background: "#3DA4DD" }}
                                onClick={handlePasswordChange}
                            >
                                Aggiorna Password
                            </button>
                        </div>
                    </section>

                    {/* PRIVACY E TERMINI */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3 text-gray-700">
                            Privacy e condizioni legali
                        </h2>

                        <div className="bg-white rounded-xl p-4 shadow flex flex-col gap-4">
                            {/* Privacy */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-700">
                                        Privacy Policy
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Accettata il:{" "}
                                        {formatDate(utente.privacy_accepted_at)}
                                    </p>
                                </div>

                                <Link
                                    href="/privacy"
                                    className="text-bluPrimary font-medium hover:underline"
                                >
                                    Visualizza
                                </Link>
                            </div>

                            <hr />

                            {/* Termini */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-700">
                                        Termini e condizioni
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Accettati il:{" "}
                                        {formatDate(utente.terms_accepted_at)}
                                    </p>
                                </div>

                                <Link
                                    href="/termini-e-condizioni"
                                    className="text-bluPrimary font-medium hover:underline"
                                >
                                    Visualizza
                                </Link>
                            </div>
                        </div>
                    </section>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full bg-pinkSecondary text-white py-3 rounded-xl font-semibold shadow hover:bg-pinkPrimary transition"
                        onClick={() => sessionStorage.removeItem("onboarding")}
                    >
                        Logout
                    </Link>
                </div>
            </div>
        </Home>
    );
};

export default Profile;
