import { VersaChatWidget } from "@/components/VersaChatWidget";

export default function Home() {
  return (
    <div className="relative w-full">
      <div className="bg-[#052049] text-white w-full py-2 flex items-center justify-center gap-2 text-sm tracking-wide shadow-md flex-wrap px-4">
        <span className="font-semibold uppercase">UCSF chatbot demo</span>
        <span className="hidden sm:inline opacity-40">|</span>
        <span className="font-light text-white/80">For demonstration purposes only. Content is illustrative and does not represent live data.</span>
      </div>
      <img
        src="/DCAP-landing.png"
        alt="DCAP landing page"
        className="w-full block"
      />
      <VersaChatWidget hasAccess={true} />
    </div>
  );
}
