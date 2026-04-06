import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[70vh]  items-center grid grid-cols-1 md:grid-cols-12 gap-0 border-b border-card-hover">
      {/* 1. TEXT COLUMN (Taking up 7/12 of the screen) */}
      <div className="md:col-span-7 flex flex-col justify-center py-12  order-2 md:order-1">
        <div className="space-y-8">
          <div className="space-y-4">
            {/* <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase">
              مرحباً بك في عالم
            </span> */}
            <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tight leading-[0.9] flex flex-col gap-y-2">
              <span>فويزاك</span>
              <span className="text-emerald-500">الدالي</span>
            </h1>
          </div>

          <p className="max-w-lg text-xl md:text-2xl text-muted-foreground/80 font-serif leading-relaxed italic border-r-2 border-card-hover pr-6">
            &quot;الفنان ،كإله،داخل عمله أو خلفه أو بعيدًا عنه ، فوقه،لا
            نراه،خارج الوجود ،لا يبالي،يقلم أظافره&quot;
          </p>

          <div className="flex flex-wrap gap-4">
            {/* Same buttons as before */}
          </div>
        </div>
      </div>

      {/* 2. IMAGE COLUMN (Taking up 5/12, full height) */}
      <div className="md:col-span-5 relative h-[400px] md:h-full min-h-[500px] order-1 md:order-2">
        <Image
          src="/phoisac.jpeg"
          alt="phoisac"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover "
          priority
        />
        {/* Decorative element to make it look "gooder" */}
        <div className="absolute bottom-8 left-8 bg-background/80 backdrop-blur-md p-4 border border-card-hover hidden md:block">
          <p className="text-xs font-mono uppercase tracking-widest text-nowrap">
            Poet / Writer
          </p>
        </div>
      </div>
    </section>
  );
}
