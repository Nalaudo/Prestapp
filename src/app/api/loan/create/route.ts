import { PrismaService } from '@/services/PrismaService';
import { NextRequest } from 'next/server';

const prisma = PrismaService

const handler = async (req: NextRequest) =>{

    const { email, loanAmount, address, birthDate, phoneNumber } = await req.json();

    if (typeof email !== 'string') {
        return new Response(
            JSON.stringify({ error: 'Email not provided' }),
            { status: 400 }
        );
    }

    try {
        const loan = await prisma.loan.create({
            data: { 
                    email,    
                    amount: loanAmount,
                    address,
                    birthDate,
                    phoneNumber,
             },
        });

        if (!loan) {
            return new Response(
                JSON.stringify({ error: 'Loan not updated' }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(loan), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: 'An error occurred while trying to create the loan' }),
            { status: 500 }
        );
    }
}
export {handler as POST};