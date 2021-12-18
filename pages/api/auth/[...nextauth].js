import NextAuth from "next-auth"
import SpotifyProviders from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.RefreshToken);

    const {body: refreshedToken} = await spotifyApi.refreshAccessToken();
    console.log('Refreshed token is ', refreshedToken)

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now + refreshedToken.expires_in * 1000, // 1h as 3600 returns from Spotify API
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    }

  } catch(error) {
    console.log(error)

    return {
      ...token,
      error: 'RefreshAccessTokenError'
    }
  }
}


export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    SpotifyProviders({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,         //Env variable
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET, //Env variable
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt ({ token, account, user}) {

      // initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000, // we are handling expiry time in milliseconds * 1000
        }
      }

      //return previous token if the accesstoken has not expired
      if (Date.now() < token.accessTokenExpires) {
        console.log('Existing access token is valid!')
        return token;
      }

      //Accesstoken has expired, so you need to refresh it
      console.log('Access token has expired, refreshing...')
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    }
  }
}) 