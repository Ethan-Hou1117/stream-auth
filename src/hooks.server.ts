import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/core/providers/github"
import { GITHUB_ID, GITHUB_SECRET, GOOGLE_ID, GOOGLE_SECRET, NEXT_AUTH_AWS_ACCESS_KEY, NEXT_AUTH_AWS_SECRET_KEY, NEXT_AUTH_AWS_REGION, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM } from "$env/static/private"
import Google from '@auth/core/providers/google'
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter"
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import { DynamoDB} from "@aws-sdk/client-dynamodb"
import type { DynamoDBClientConfig} from "@aws-sdk/client-dynamodb"
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import Auth0Provider from "next-auth/providers/auth0";


export const pages =  {
  signIn: '/auth/signin',
  signOut: '/auth/signout',
  error: '/auth/error', // Error code passed in query string as ?error=
  verifyRequest: '/auth/verify-request', // (used for check email message)
  newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
}

const config: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: NEXT_AUTH_AWS_ACCESS_KEY as string,
    secretAccessKey: NEXT_AUTH_AWS_SECRET_KEY as string,
  },
  region: NEXT_AUTH_AWS_REGION,
};

const client = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
})


export const handle = SvelteKitAuth({
  providers: [EmailProvider({
    server: {
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    },
    from: EMAIL_FROM,
  }), Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET }), Auth0Provider({
    clientId: process.env.AUTH0_ID,
    clientSecret: process.env.AUTH0_SECRET,
  }),
  // GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }), 
/* CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with...")
    name: "Credentials",
    // `credentials` is used to generate a form on the sign in page.
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      username: { label: "Username", type: "text", placeholder: "jsmith" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
      // Add logic here to look up the user from the credentials supplied
      const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }

      if (user) {
        // Any object returned will be saved in `user` property of the JWT
        return user
      } else {
        // If you return null then an error will be displayed advising the user to check their details.
        return null

        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      }
    }
  })
  */
],
  adapter: DynamoDBAdapter(client, {tableName: "stream-auth"})
});
