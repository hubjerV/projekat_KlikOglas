"use client";

import "../i18n";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();

  return (
    <>
      <LanguageSwitcher />
      {children}
    </>
  );
}
