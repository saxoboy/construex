import { getCurrentUser } from "@/actions/getCurrentUser";
import Navbar from "@/components/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  return (
    <>
      <Navbar currentUser={currentUser} />
      {children}
    </>
  );
}