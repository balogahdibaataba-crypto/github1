import React, { useState } from "react";
import { Megaphone, Award, Send, CheckCircle2, Phone, Mail, Building, Sparkles } from "lucide-react";

export const AdSpace: React.FC = () => {
  const [partnerForm, setPartnerForm] = useState({
    institutionName: "",
    contactPerson: "",
    phone: "",
    email: "",
    adPackage: "Bannière Répertoire (1 mois)",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmitAdRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 p-6 rounded-2xl text-white shadow-md border border-slate-700">
        <div className="max-w-3xl space-y-3">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
            <Megaphone className="w-3.5 h-3.5" /> Espace Publicitaire & Partenariats Académiques
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Promouvez vos Établissements, Bourses & Logements Étudiants
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            OrientaAfrik rassemble des milliers d'élèves, bacheliers, étudiants et parents d'Afrique francophone et internationale. Positionnez votre institution d'enseignement supérieur au cœur de leurs choix d'orientation.
          </p>
        </div>
      </div>

      {/* Featured Ad Spotlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 border border-amber-500/30 shadow-md relative overflow-hidden space-y-4">
          <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[10px] rounded uppercase tracking-wider">
            ESPACE PUB SEMAINE • SPOTLIGHT
          </span>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-amber-300">
              Inscriptions Ouvertes : Bourses d'Études AMCI & Excellence 2026
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Consultez les procédures d'admission dans les universités publiques partenaires au Maroc, Sénégal et Côte d'Ivoire.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-700">
            <span className="text-slate-400">Publicité Partenaire Verifiée</span>
            <span className="font-bold text-amber-400">Dr. BALOGAH Selection</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-2xl p-6 border border-emerald-500/30 shadow-md relative overflow-hidden space-y-4">
          <span className="px-2.5 py-1 bg-emerald-500 text-white font-bold text-[10px] rounded uppercase tracking-wider">
            RÉSIDENCE ÉTUDIANTE & LOGEMENT
          </span>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-emerald-300">
              Résidences Universitaires Privées à Lomé & Abidjan
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Chambres meublées, Wi-Fi haut débit, sécurité 24h/24 et proximité directe des grands campus universitaires.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800">
            <span className="text-slate-400">Contact Réservation Directe</span>
            <span className="font-bold text-emerald-400">+228 90966765</span>
          </div>
        </div>
      </div>

      {/* Partner Request Form */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-5">
        <div className="border-b border-slate-200 pb-3">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-600" /> Demande d'Espace Publicitaire ou Partenariat
          </h3>
          <p className="text-xs text-slate-500">
            Remplissez ce formulaire pour être recontacté par le Dr. BALOGAH Dibaataba.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmitAdRequest} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Nom de l'Établissement / Société :</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Université Internationale..."
                  value={partnerForm.institutionName}
                  onChange={(e) => setPartnerForm({ ...partnerForm, institutionName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Nom du Responsable :</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: M. Koffi"
                  value={partnerForm.contactPerson}
                  onChange={(e) => setPartnerForm({ ...partnerForm, contactPerson: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Téléphone de Contact :</label>
                <input
                  type="text"
                  required
                  placeholder="+228 90000000"
                  value={partnerForm.phone}
                  onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">E-mail Officiel :</label>
                <input
                  type="email"
                  required
                  placeholder="contact@institution.com"
                  value={partnerForm.email}
                  onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Formule de Partenariat souhaitée :</label>
              <select
                value={partnerForm.adPackage}
                onChange={(e) => setPartnerForm({ ...partnerForm, adPackage: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-bold text-slate-800"
              >
                <option value="Bannière Répertoire (1 mois)">Bannière Répertoire Établissements (1 mois)</option>
                <option value="Sponsor Spotlight 1000 Métiers">Sponsor Spotlight 1000 Métiers Porteurs</option>
                <option value="Référencement Prioritaire de Filières">Référencement Prioritaire de Filières & Formations</option>
                <option value="Partenariat Annuel Global">Partenariat Annuel Global OrientaAfrik</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Détails de votre demande :</label>
              <textarea
                rows={3}
                placeholder="Précisez vos besoins de visibilité..."
                value={partnerForm.message}
                onChange={(e) => setPartnerForm({ ...partnerForm, message: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all text-xs"
            >
              <Send className="w-4 h-4" />
              <span>Envoyer la Demande de Partenariat</span>
            </button>
          </form>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-base">Demande enregistrée avec succès !</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Le Cabinet d'Orientation du Dr. BALOGAH Dibaataba prendra contact avec vous sous 24h par téléphone (+228 90966765 / +228 99372074) ou par e-mail.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
