import { VersaChatWidget } from "@/components/VersaChatWidget";

export default function Home() {
  return (
    <div className="relative w-full">
      <img
        src="/it-website-ss.png"
        alt="UCSF IT website"
        className="w-full block"
      />
      <VersaChatWidget hasAccess={true} />
    </div>
  );
}
