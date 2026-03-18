import { Sidebar } from "@/components/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#fafaf9]">
      <Sidebar plan="free" />
      <main className="flex-1 min-w-0 px-4 pb-6 pt-16 md:pt-8 md:px-8 md:pb-8 md:ml-64">
        {children}
      </main>
    </div>
  );
}
