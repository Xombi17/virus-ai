import PageTransition from "@/components/PageTransition";
import ClientHome from "@/components/ClientHome";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VirusAI - AI-Powered Virus Scanner",
  description: "Advanced virus detection powered by AI, capable of scanning files up to 1GB with enhanced threat detection",
};

export default function Home() {
  return (
    <PageTransition>
      <ClientHome />
    </PageTransition>
  );
}
