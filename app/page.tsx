import { VersaChatWidget } from "@/components/VersaChatWidget";

export default function Home() {
  return (
    <div className="relative w-full">
      <div className="bg-[#052049] text-white w-full py-2 text-center text-sm font-semibold tracking-wide uppercase shadow-md">
        UCSF chatbot demo
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
