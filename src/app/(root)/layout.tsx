const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-screen bg-slate-900 overflow-auto">
      <div className="container">{children}</div>
    </main>
  );
};

export default MainLayout;
