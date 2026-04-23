import Header from "./navbar/Header";
import Footer from "./ui/Footer";
import AdminSidebar from "./dashboard/AdminSidebar";
import AdminActions from "./dashboard/AdminActions";

// ServerLayoutContent.tsx
export default function ServerLayoutContent({
  children,
  logo,
}: {
  children: React.ReactNode;
  logo: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <Header logo={logo} />

      <div className="grow w-full max-w-[1440px] mx-auto py-4 lg:py-8 flex flex-col">
        <div className="grow grid grid-rows-[auto_1fr] lg:grid-rows-1 lg:grid-cols-[225px_1fr_225px] gap-x-6 gap-y-2">
          {/* No more AdminShellPart! Just render the components. */}
          <aside className="hidden lg:block">
            <AdminSidebar />
          </aside>

          <main className="h-full row-start-2 lg:row-start-1 lg:col-start-2 flex flex-col w-full panel">
            {children}
          </main>

          <aside className="">
            <AdminActions />
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
