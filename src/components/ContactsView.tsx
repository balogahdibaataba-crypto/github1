import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, Globe, Bot, ShieldCheck } from "lucide-react";

interface ContactsViewProps {
  setActiveTab: (tab: string) => void;
  currency: "FCFA" | "EUR" | "USD";
}

export const ContactsView: React.FC<ContactsViewProps> = ({ setActiveTab }) => {
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "Orientation & Recommandation",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct mailto link to route immediately to dbalogah@yahoo.com
    const recipient = "dbalogah@yahoo.com";
    const mailSubject = encodeURIComponent(`[OrientaAfrik & Certification] ${formData.subject} - ${formData.fullName}`);
    const mailBody = encodeURIComponent(
      `Expéditeur : ${formData.fullName}\n` +
      `Téléphone / WhatsApp : ${formData.phone}\n` +
      `Email client : ${formData.email || "Non renseigné"}\n` +
      `Sujet : ${formData.subject}\n\n` +
      `Message :\n${formData.message}\n\n` +
      `--------------------------------------------------\n` +
      `Formulaire transmis directement depuis la plateforme OrientaAfrik et Certification à destination du Docteur BALOGAH Dibaataba.`
    );

    // Trigger direct email dispatch in mail client
    window.location.href = `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ fullName: "", email: "", phone: "", subject: "Orientation & Recommandation", message: "" });
    }, 8000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-3">
        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-full uppercase tracking-wider inline-block">
          Support & Assistance Directe
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Contactez le Cabinet OrientaAfrik et Certification.
        </h1>
        <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
          Notre équipe d'experts en orientation scolaire, professionnelle et RH est à votre entière disposition pour répondre à toutes vos demandes de conseils, de bilans ou d'authentifications de rapports.
        </p>
      </div>

      {/* Main Grid: Direct Contact Info + Message Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Téléphones Directs / WhatsApp</p>
                <a href="tel:+22890966765" className="text-sm font-black text-slate-900 hover:text-emerald-700 block">
                  +228 90966765 (Mixx / Togocom)
                </a>
                <a href="tel:+22899372074" className="text-sm font-black text-slate-900 hover:text-emerald-700 block">
                  +228 99372074 (Moov Africa)
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 text-indigo-800 rounded-xl font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Adresses Email Officielles</p>
                <a href="mailto:contact@orientaafrik.org" className="text-xs font-bold text-slate-900 hover:text-indigo-700 block truncate">
                  contact@orientaafrik.org
                </a>
                <a href="mailto:dbalogah@yahoo.com" className="text-xs font-bold text-slate-900 hover:text-indigo-700 block truncate">
                  dbalogah@yahoo.com
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 text-amber-800 rounded-xl font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Siège social & Localisation</p>
                <p className="text-xs font-bold text-slate-900">
                  Lomé — TOGO (Afrique de l'Ouest)
                </p>
                <p className="text-[11px] text-slate-500">
                  Site Web : orientaafrik.mpginternational.org
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
              <Clock className="w-4 h-4" /> Horaires d'Ouverture
            </div>
            <p className="text-xs text-slate-300">
              Lundi — Vendredi : 08h00 – 18h00 (GMT)<br />
              Samedi : 09h00 – 13h00 (GMT)<br />
              <span className="text-emerald-400 font-bold">Assistance IA 24h/24 & 7j/7</span>
            </p>
            <button
              onClick={() => setActiveTab("ai-counselor")}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all mt-2"
            >
              <Bot className="w-4 h-4" /> Poser une question à l'IA
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm lg:col-span-2 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900">
              Envoyer un Message au Cabinet
            </h3>
            <p className="text-xs text-slate-500">
              Remplissez le formulaire ci-dessous. Un conseiller prendra contact avec vous dans les meilleurs délais.
            </p>
          </div>

          {formSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-2xl text-center space-y-3 animate-fadeIn">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-extrabold text-emerald-900">Message Transmis à dbalogah@yahoo.com !</h4>
              <p className="text-xs text-emerald-800 leading-relaxed font-semibold">
                Votre message est immédiatement expédié à la boîte de réception principale du Docteur BALOGAH Dibaataba (<span className="underline font-bold text-emerald-950">dbalogah@yahoo.com</span>).
              </p>
              <p className="text-[11px] text-emerald-700">
                L'application de messagerie a ouvert le message prêt à l'envoi. Le Docteur BALOGAH ou son équipe vous recontactera rapidement.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nom Complet *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ex: Jean Koffi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ex: +228 90000000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Adresse Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ex: jean.koffi@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sujet de la demande</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Orientation & Recommandation">Orientation & Recommandation</option>
                    <option value="Bilan de Compétences / VAE">Bilan de Compétences / VAE</option>
                    <option value="Authentification de Rapport">Authentification de Rapport</option>
                    <option value="Partenariat Établissement">Partenariat Établissement</option>
                    <option value="Autre Demande">Autre Demande</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Votre Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Décrivez votre besoin ou votre situation d'orientation..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" /> Envoyer le Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
