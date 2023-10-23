import { getCurrentUser } from "@/actions/getCurrentUser";

export default async function Dashboard() {
  const currentUser = await getCurrentUser();
  return (
    <div>
      <h1>Welcome {currentUser?.username}</h1>      
    </div>
  );
}
