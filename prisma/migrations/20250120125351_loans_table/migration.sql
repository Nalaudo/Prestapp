-- CreateTable
CREATE TABLE "Loan" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);
