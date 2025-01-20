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
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return new Response(
                JSON.stringify({ error: 'User not found' }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: 'An error occurred while trying to get the user' }),
            { status: 500 }
        );
    }
}
export {handler as POST};