import { SiteSettings } from "@/types/settings";
import Image from "next/image";

export default function Hero({ settings }: { settings: SiteSettings }) {
  const fullName = settings?.full_name || "فويزاك الدالي";
  const url = settings?.home_image_url || "/phoisac-2.jpeg";
  const quote =
    settings?.home_quote ||
    "الفنان، كإله، داخل عمله أو خلفه أو بعيدًا عنه، فوقه، لا نراه، خارج الوجود، لا يبالي، يقلم أظافره";

  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");


  return (
    <section className="relative min-h-[70vh]  items-center grid grid-cols-1 md:grid-cols-12 gap-0 border-b border-card-hover">
      <div className="md:col-span-7 flex flex-col justify-center py-12  order-2 md:order-1">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tight leading-[0.9] flex flex-col gap-y-2">
              <span>{firstName}</span>
              <span className="text-emerald-500">{lastName}</span>
            </h1>
          </div>

          <p className="max-w-lg text-xl md:text-2xl text-muted-foreground/80 font-serif leading-relaxed italic border-r-2 border-card-hover pr-6">
            &quot;{quote}&quot;
          </p>
        </div>
      </div>

      <div className="md:col-span-5 relative h-[400px] md:h-full min-h-[500px] order-1 md:order-2">
        <Image
          src={url}
          alt="phoisac"
          fill
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover "
          priority
        />
        <div className="absolute bottom-8 left-8 bg-background/80 backdrop-blur-md p-4 border border-card-hover block">
          <p className="text-xs font-mono uppercase tracking-widest text-nowrap">
            Poet / Writer
          </p>
        </div>
      </div>
    </section>
  );
}
