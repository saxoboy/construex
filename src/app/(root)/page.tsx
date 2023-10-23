import { getCurrentUser } from "@/actions/getCurrentUser";
import { MainHero } from "@/components/main/hero";
import { MainNavbar } from "@/components/main/navbar";

export default async function Home() {
  const currentUser = await getCurrentUser();
  return (
    <>
      <MainNavbar currentUser={currentUser} />
      <MainHero currentUser={currentUser} />
    </>
  );
}
