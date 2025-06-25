"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface Oglas {
  id: number;
  naslov: string;
  opis: string;
  cijena: number;
  lokacija: string;
  kontakt: string;
  kategorija: string;
  slike: string[];
  id_korisnika?: number;
  broj_pregleda: number;
  korisnik?: { username: string };
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  oglas_id: number;
  content: string;
  timestamp: string;
}

export default function DetaljiOglasa() {
  const { t } = useTranslation();
  const params = useParams();
  const [oglas, setOglas] = useState<Oglas | null>(null);
  const [prijavaPoruka, setPrijavaPoruka] = useState("");
  const [prijavljen, setPrijavljen] = useState(false);
  const [razlogPrijave, setRazlogPrijave] = useState(
    t("details.report.reasonOptions.unsuitable")
  );

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id) return;

    fetch(`http://localhost:8000/oglasi/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOglas(data);
        dodajUHistoriju(data);
      })
      .catch(() => alert(t("details.loadingError")));

    const token = localStorage.getItem("access_token");
    if (token && id) {
      fetch(`http://localhost:8000/prijava/provjera/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data: boolean) => setPrijavljen(data))
        .catch(() => console.error("Error checking report"));
    }
  }, [params.id, t]);

  function dodajUHistoriju(oglas: Oglas) {
    const prethodni = JSON.parse(
      localStorage.getItem("pregledaniOglasi") || "[]"
    ) as Oglas[];
    const bezDuplikata = prethodni.filter((o) => o.id !== oglas.id);
    const novi = [oglas, ...bezDuplikata].slice(0, 5);
    localStorage.setItem("pregledaniOglasi", JSON.stringify(novi));
  }

  function handleDodajOmiljeni(idOglasa: number) {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert(t("details.favorites.mustLogin"));
      return;
    }

    fetch("http://localhost:8000/omiljeni/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oglas_id: idOglasa }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          if (errorData.detail === "Oglas već postoji u omiljenim") {
            alert(t("details.favorites.alreadyAdded"));
            return;
          }
          throw new Error(errorData.detail || t("details.favorites.error"));
        }
        alert(t("details.favorites.added"));
      })
      .catch((err) => alert(t("details.favorites.error") + ": " + err.message));
  }

  function handlePrijaviOglas(idOglasa: number) {
    if (prijavljen) {
      setPrijavaPoruka(t("details.already.reported"));
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert(t("details.report.mustLogin"));
      return;
    }

    fetch("http://localhost:8000/prijava/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        oglas_id: idOglasa,
        razlog: razlogPrijave,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(t("details.report.error"));
        setPrijavaPoruka(t("details.report.success"));
        setPrijavljen(true);
      })
      .catch(() => setPrijavaPoruka(t("details.report.error")));
  }

  if (!oglas) return <p className="p-8">{t("details.loading")}</p>;

  return (
    <div>
      <div className="oglas-wrapper">
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
          <div className="oglas-levo flex flex-col gap-4 w-full md:w-1/2">
            <div className="oglas-slika bg-[#f0f0f0] flex justify-center items-center rounded">
              <img
                src={`http://localhost:8000${encodeURI(oglas.slike[0])}`}
                alt={t("details.imageAlt")}
                className="w-full h-auto object-contain max-h-[400px]"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {oglas.slike.map((slika, index) => (
                <img
                  key={index}
                  src={`http://localhost:8000${encodeURI(slika)}`}
                  alt={`${t("details.imageAlt")} ${index + 1}`}
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          </div>

          <div className="oglas-desno w-full md:w-1/2 space-y-3">
            <h1 className="naslov">{oglas.naslov}</h1>
            <p className="text-xl font-bold text-gray-800">
              {oglas.cijena} BAM
            </p>
            <p>
              <strong>{t("details.description")}: </strong> {oglas.opis}
            </p>
            <p className="text-sm text-gray-500">
              {oglas.broj_pregleda}{" "}
              {t("details.views", { count: oglas.broj_pregleda })}
            </p>

            <p className="text-sm">
              {t("details.postedBy")}:{" "}
              <Link
                href={`/korisnik/${oglas.id_korisnika}`}
                className="text-blue-600 underline"
              >
                {oglas.korisnik?.username || t("details.noUsername")}
              </Link>
            </p>

            <button className="oglas-chat-btn w-full">
              🛒 {oglas.cijena} BAM
            </button>

            <button
              onClick={() => (window.location.href = `/chat/${oglas.id}`)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-semibold"
            >
              💬 {t("details.openChat")}
            </button>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => handleDodajOmiljeni(oglas.id)}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded"
              >
                ⭐ {t("details.addFavorites")}
              </button>

              {prijavljen ? (
                <p className="text-green-600 font-semibold">
                  {t("details.already.reported")}
                </p>
              ) : (
                <>
                  <label className="block">
                    {t("details.report.reason")}:
                    <select
                      className="block w-full mt-1 p-2 border rounded"
                      value={razlogPrijave}
                      onChange={(e) => setRazlogPrijave(e.target.value)}
                    >
                      <option
                        value={t("details.report.reasonOptions.unsuitable")}
                      >
                        {t("details.report.reasonOptions.unsuitable")}
                      </option>
                      <option value={t("details.report.reasonOptions.fraud")}>
                        {t("details.report.reasonOptions.fraud")}
                      </option>
                      <option value={t("details.report.reasonOptions.fake")}>
                        {t("details.report.reasonOptions.fake")}
                      </option>
                      <option value={t("details.report.reasonOptions.other")}>
                        {t("details.report.reasonOptions.other")}
                      </option>
                    </select>
                  </label>

                  <button
                    onClick={() => handlePrijaviOglas(oglas.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded"
                  >
                    🚨 {t("details.report.reportAd")}
                  </button>
                </>
              )}
              {prijavaPoruka && (
                <p className="text-green-600 font-semibold">{prijavaPoruka}</p>
              )}

              <Link
                href="/oglasi_prikaz"
                className="text-blue-600 hover:underline font-medium text-center mt-2"
              >
                ← {t("details.backToAds")}
              </Link>

              <Link
                href="/omiljeni"
                className="inline-block bg-green-500 hover:bg-green-600 text-white text-center px-4 py-2 rounded font-semibold mt-2"
              >
                💚 {t("details.viewFavorites")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
