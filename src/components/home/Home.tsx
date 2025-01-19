"use client";
import LoanForm from "@/global/forms/LoanForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const { data: session, status: statusSession } = useSession();

  const router = useRouter();

  console.log(session);

  useEffect(() => {
    if (statusSession === "unauthenticated") {
      router.push("/login");
    }
  }, [statusSession, router]);

  return (
    <div>
      <LoanForm />
    </div>
  );
};

export default Home;
