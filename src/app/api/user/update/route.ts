import { PrismaService } from '@/services/PrismaService';
import { NextRequest } from 'next/server';

const prisma = PrismaService

const handler = async (req: NextRequest) =>{

    const { email, name, phoneNumber } = await req.json();

    if (typeof email !== 'string') {
        return new Response(
            JSON.stringify({ error: 'Email not provided' }),
            { status: 400 }
        );
    }

    try {
        const user = await prisma.user.updateMany({
            where: { email: email },
            data: { email: email,
                    name: name,
                    phoneNumber: phoneNumber
             },
        });

        if (!user) {
            return new Response(
                JSON.stringify({ error: 'User not updated' }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: 'An error occurred while trying to update the user' }),
            { status: 500 }
        );
    }
}
export {handler as POST};