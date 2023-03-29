import axiosInstances from "@/lib/axios/axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    //maxAge: 1 * 24 * 60 * 60, // 1 günlük
    maxAge: 1 * 60, //1 dakika. Bu süre, Refresh Tokenla aynı sürede olmalı ve Sessionın `refetchInterval` süresinden daha UZUN olmalıdır
  },
  providers: [
    CredentialsProvider({
      type: `credentials`,
      credentials: {},
      async authorize(credentials, req) {
        //Buradaki `credentials`, Login formu içerisinden bize gönderilen objecttir.
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const bodyToSend = {
          usernameOrEmail: email,
          password,
        };

        const response: any = await axiosInstances.axiosCommonInstance
          .post("/auth/login", bodyToSend)
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            throw new Error(
              `${error.response.data.message} - ${error.response.data.statusCode}`,
              {
                cause: error.response.data.message,
              }
            );
          });

        return {
          //Eğer herşey yolundaysa user bilgilerini döndürdük. Bu bilgiler, `useSession` hookuyla Client componentler içerisinden elde edilebilecektir
          id: ``,
          name: ``,
          email: ``,
          accessToken: response.newGeneratedAccessToken,
          refreshToken: response.newGeneratedRefreshToken,
        };
      },
    }),
  ],
  pages: {
    signIn: `/auth/sign_in`, //User, component içerisinde `signIn` eventi bind edilmiş olan elemente tıklayınca, bu routea yönlendirir
    // error: '/auth/error', //User, component içerisinde `signIn` eventi bind edilmiş olan elemente tıklayınca ve ERROR alınınca, bu routea yönlendirir
    signOut: "/", //User, component içerisinde `signOut` eventi bind edilmiş olan elemente tıklayınca, bu routea yönlendirir
  },
  callbacks: {
    async signIn(props) {
      //Burası, provider içerisinden döndürülen datayı ve diğer account bilgilerini çeker. Sadece `SignIn` metodu triggerlandığında çalışacak. Burada `return false` yazarak userın sign olmasını engelleriz ve default bir Error messageı almasını sağlayabiliriz veya `return `/newRoute1`` şeklinde yazarak Userı başka bir routea Redirect edebiliriz
      /*Mesela: `{
                    user: { cameInsideOfProvider: true, id: '1234', name: 'John Doe', email: 'john@gmail.com', role: 'admin' },
                    account: { providerAccountId: '1234', type: 'credentials', provider: 'credentials' },
                    credentials: {
                        email: 't1',
                        password: 't1',
                        redirect: 'false',
                        csrfToken: 'bf87f5ff4424a358bd75f7ed938227f1720d42ce9bf9cfb32515ba40a6f8f802',
                        callbackUrl: 'http://localhost:3000/auth/sign_in?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F',
                        json: 'true'
                        }
                    }`
        */
      console.log("SIGNIN CALLBACK", props);
      return true;
    },
    async jwt(params: any) {
      //Burada user için NextJSin oluşturduğu tokenı döndürürüz. User `SignIn` olduğunda ve `useSession` içerisinde `authenticated` olduğu zamanlarda her ROUTE değişiminde burası çalışacak; bu 2 farklı durumda aldığı değerler DEGISECEKTIR!
      /*Mesela `SignIn` triggerlandığında:
      `{
            token: {
                name: 'John Doe',
                email: 'john@gmail.com',
                picture: undefined,
                sub: '1234'
            },
            user: {
                id: '1234',
                name: 'John Doe',
                email: 'john@gmail.com',
                role: 'admin',
                cameInsideOfProvider: true
            },
            account: {
                providerAccountId: '1234',
                type: 'credentials',
                provider: 'credentials'
            },
            isNewUser: false
        }`
      */
      /*Mesela ROUTE değişimlerinde:
      `{
            token: {
                cameInsideOfProvider: true,
                name: 'John Doe',
                email: 'john@gmail.com',
                sub: '1234',
                role: 'admin',
                iat: 1679860725,
                exp: 1682452725,
                jti: 'c38b4091-d4f7-47b2-9305-a1211a875dac'
            }
        }`
      */

      // if (params.user?.accessToken && params.user?.refreshToken) {
      //   //Burada jwtyi update ediyoruz
      //   params.token.accessToken = params.user.accessToken;
      //   params.token.refreshToken = params.user.refreshToken;
      // }
      //console.log(params);
      if (params.user) {
        return { ...params.token, ...params.user };
      }
      return { ...params.token }; //Update ettikten sonra final tokenı döndürüyoruz
    },

    async session(props: any) {
      //Burada Userın `useSession` ile aldığımız içerisindeki session bilgileri döndürülür yani clienta gönderilen datadır. Burayı manipule ederek `useSession` ile dönen datayı değiştiririz. User `useSession` içerisinde `authenticated` olduğu zaman, her ROUTE değişiminde burası çalışacak
      /*Mesela:
      `{
            session: {
                user: { name: 'John Doe', email: 'john@gmail.com', image: undefined },
                expires: '2023-04-25T20:07:33.649Z'
            },
            token: {
                cameInsideOfProvider: true,
                name: 'John Doe',
                email: 'john@gmail.com',
                sub: '1234',
                role: 'admin',
                iat: 1679861236,
                exp: 1682453236,
                jti: '53217bab-82f7-4d1a-8c7a-0f6b143a3cf7'
            }
        }`
    */
      //console.log("Session CALLBACK", props);
      props.session.user = props.token; //Buradaki `token`, `jwt()` metodundan dönen tokendır. Bu tokenı Session içerisindeki `user` objectine bind ederiz böylece `useSession` ile daha sonrasında rahatça çekebiliriz
      return props.session;
    },
  },
};
export default authOptions;
