import { PrismaService } from '@/services/PrismaService';
import { NextRequest } from 'next/server';

const prisma = PrismaService

const handler = async (req: NextRequest) =>{

    const { email } = await req.json();

    if (typeof email !== 'string') {
        return new Response(
            JSON.stringify({ error: 'Email not provided' }),
            { status: 400 }
        );
    }

    try {
        const loans = await prisma.loan.findMany({
            where: { email: email },
            orderBy: { createdAt: 'desc' }
        });

        return new Response(JSON.stringify(loans), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: 'An error occurred while trying to get the user' }),
            { status: 500 }
        );
    }
}
export {handler as POST};