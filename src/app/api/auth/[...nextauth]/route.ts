import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AWS from "aws-sdk";
import process from "process";
import crypto from "crypto"; // Import crypto module for generating the SECRET_HASH

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.COGNITO_REGION,
});

// Function to generate SECRET_HASH
const generateSecretHash = (username: string) => {
  const clientId = process.env.COGNITO_CLIENT_ID as string;
  const secret = process.env.COGNITO_CLIENT_SECRET as string;

  if (!clientId || !secret) {
    throw new Error("Cognito Client ID or Client Secret is not defined.");
  }

  // Ensure that the username and clientId are combined and hashed correctly
  return crypto
    .createHmac("sha256", secret) // Create HMAC with sha256
    .update(username + clientId) // Use username (email) + clientId
    .digest("base64"); // Return as base64
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

        console.log("Cognito Params:", params); // Log the params to verify

        try {
          const response = await cognito.initiateAuth(params).promise();
          console.log("Cognito Response:", response); // Log the response for debugging

          const user = {
            id: response.ChallengeParameters?.USER_ID_FOR_SRP as string,
            name: credentials.username,
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
