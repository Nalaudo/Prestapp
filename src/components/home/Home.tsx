"use client";
import LoanForm from "@/global/forms/LoanForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Home = () => {
  const [isLogged, setIsLogged] = useState(false);
  const { status: statusSession } = useSession();

  const router = useRouter();

  useEffect(() => {
    setIsLogged(statusSession === "authenticated");
  }, [statusSession]);

  useEffect(() => {
    if (statusSession === "unauthenticated") {
      router.push("/login");
    }
  }, [statusSession, router]);

  if (!isLogged) {
    return null;
  }

  return <LoanForm />;
};

export default Home;
