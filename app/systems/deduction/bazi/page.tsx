import { permanentRedirect } from "next/navigation";

export default function LegacyBaziPage() {
  permanentRedirect("/tools/bazi");
}
