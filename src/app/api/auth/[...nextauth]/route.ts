import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AWS from "aws-sdk";
import process from "process";
import crypto from "crypto";

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID_AWS,
  secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
  region: process.env.COGNITO_REGION,
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

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
        if (!credentials) return null;

        const cognito = new AWS.CognitoIdentityServiceProvider();

        const params = {
          AuthFlow: "USER_PASSWORD_AUTH",
          ClientId: process.env.COGNITO_CLIENT_ID as string,
          AuthParameters: {
            USERNAME: credentials.username,
            PASSWORD: credentials.password,
            SECRET_HASH: generateSecretHash(credentials.username),
          },
        };

        try {
          const response = await cognito.initiateAuth(params).promise();

          const user = {
            id: response.ChallengeParameters?.USER_ID_FOR_SRP as string,
            email: credentials.username,
          };
          return user;
        } catch (error) {
          console.error("Cognito Auth Error:", error);
          return null;
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST };
