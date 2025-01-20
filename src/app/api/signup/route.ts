import { PrismaService } from "@/services/PrismaService";
import {
  SignUpCommand,
  CognitoIdentityProviderClient,
  AdminConfirmSignUpCommand
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";

const prisma = PrismaService;

export async function POST(req: Request) {
  const accessKeyId = process.env.ACCESS_KEY_ID_AWS;
  const secretAccessKey = process.env.SECRET_ACCESS_KEY_AWS;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("AWS Access Key ID or Secret Access Key is not defined.");
  }

  const client = new CognitoIdentityProviderClient({
    region: process.env.COGNITO_REGION,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
  });

  const generateSecretHash = (username: string) => {
  const clientId = process.env.COGNITO_CLIENT_ID as string;
  const secret = process.env.COGNITO_CLIENT_SECRET as string;

  if (!clientId || !secret) {
    throw new Error("Cognito Client ID or Client Secret is not defined.");
  }

  return crypto
    .createHmac("sha256", secret)
    .update(username + clientId)
    .digest("base64");
};

  try {
    const { email, password, name, phone } = await req.json();

    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const signUpCognito = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID!,
      Username: email,
      Password: password,
      SecretHash:generateSecretHash(email)
    });

    const response = await client.send(signUpCognito);

    if (response.$metadata.httpStatusCode === 200) {
        const confirmSignUp = new AdminConfirmSignUpCommand({
            UserPoolId: process.env.COGNITO_USER_POOL_ID!,
            Username: email,
        });

        const response = await client.send(confirmSignUp);

        if (response.$metadata.httpStatusCode !== 200) {
            return new Response(
                JSON.stringify({ message: "User not confirmed" }),
                { status: 400 }
            );
        }

        const user = await prisma.user.create({
          data: {
            email,
            name,
            phoneNumber: phone,
          },
        })

        return new Response(JSON.stringify(user), { status: 200 });
    }

    return new Response(
      JSON.stringify({ message: "User not confirmed" }),
      { status: 400 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "An error occurred while trying to sign up" }),
      { status: 500 }
    );
  }
}