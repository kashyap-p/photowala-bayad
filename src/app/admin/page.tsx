import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Dashboard } from "./dashboard";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/admin/login?callbackUrl=/admin");
  }
  return <Dashboard adminEmail={session.user.email} adminName={session.user.name} />;
}
