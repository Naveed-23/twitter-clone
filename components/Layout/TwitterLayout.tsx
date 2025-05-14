// "use client"
// import Image from "next/image";
// import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
// import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
// import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
// import { SlOptions } from "react-icons/sl";
// import { useCurrentUser } from "@/hooks/user";
// import { ReactNode, useCallback, useMemo } from "react";
// import toast from "react-hot-toast";
// import { graphqlClient } from "@/clients/api";
// import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
// import { useQueryClient } from "@tanstack/react-query";
// import Link from "next/link";
// import { authenticateWithGoogle } from "@/supabase/authenticateWithGoogle";


// interface TwitterLayoutProps {
//   children: ReactNode;
// }

// interface TwitterSidebarButton {
//     title: string;
//     icon: React.ReactNode;
//     link: string;
//   }
  


// const TwitterLayout: React.FC<TwitterLayoutProps> = (props) => {

//     const { user } = useCurrentUser();
//     const queryClient = useQueryClient();

//     const sidebarMenuItems: TwitterSidebarButton[] = useMemo(() => [
//       {
//         title: 'Home',
//         icon: <BiHomeCircle />,
//         link: '/'
//       },
//       {
//         title: 'Explore',
//         icon: <BiHash />,
//         link: '/'
//       },
//       {
//         title: 'Notifications',
//         icon: <BsBell />,
//         link: '/'
//       },
//       {
//         title: 'Messages',
//         icon: <BsEnvelope />,
//         link: '/'
//       },
//       {
//         title: 'Bookmarks',
//         icon: <BsBookmark />,
//         link: '/'
//       },
//       {
//         title: 'Twitter Blue',
//         icon: <BiMoney />,
//         link: '/'
//       },
//       {
//         title: 'Profile',
//         icon: <BiUser />,
//         link: `/${user?.id}`
//       },
//       {
//         title: 'More',
//         icon: <SlOptions />,
//         link: '/'
//       }
//     ], [user?.id]);

 

//     const handleLoginWithGoogle = useCallback(async (cred: CredentialResponse) => {
//       try {
//         const googleToken = cred.credential;
//         if (!googleToken) throw new Error("Google token not found");
        
//         const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleTokenQuery, { token: googleToken });
//         if (!verifyGoogleToken) throw new Error("Failed to verify Google token");

//         toast.success("Verified Successfully");
//         window.localStorage.setItem("__twitter_token", verifyGoogleToken);

//         const session = await authenticateWithGoogle(googleToken);
//         if (!session) throw new Error("No Supabase session found");

//         await queryClient.invalidateQueries({ queryKey: ["current-user"] });
//       } catch (error: unknown) {
//         if (error instanceof Error) {
//             toast.error(error.message || "An error occurred during login.");
//         } else {
//             toast.error("An unknown error occurred during login.");
//         }
//       }
    
//       }, [queryClient]);


//     return <div className="grid grid-cols-12 h-screen w-screen sm:px-56">
//     <div className="col-span-2 lg:col-span-3 pt-1 flex sm:justify-end pr-4 relative">
//     <div>
//         <div className="text-2xl h-fit w-fit hover:bg-gray-800 rounded-full p-3 cursor-pointer transition-all">
//             <BsTwitter />
//         </div>
//         <div className="mt-2 text-xl pr-4">
//         <ul>
//         {sidebarMenuItems.map((item) => (
//         <li key={item.title}>
//           <Link className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-3 py-2 w-fit cursor-pointer mt-2" href={item.link}>
//             <span className="text-3xl">{item.icon}</span>
//             <span className="hidden sm:inline">{item.title}</span>
//           </Link>
//             </li>))}
//         </ul>
//         <div className="mt-5 px-3">
//             <button className="hidden sm:block bg-[#1d9aef] font-semibold text-lg px-4 py-2 rounded-full w-full">
//             Tweet
//             </button>
//             <button className="block sm:hidden bg-[#1d9aef] font-semibold text-lg px-4 py-2 rounded-full w-full">
//             <BsTwitter />
//             </button>
//         </div>
//     </div>
//     </div>
//     { user && (
//     <div className="absolute bottom-5 flex gap-2 items-center bg-slate-800 px-2 py-2 rounded-full">
//       {user?.profileImageURL && (<Image className="rounded-full" src={user?.profileImageURL} alt='user-image' height={40} width={40} />)}
//       <div className="hidden sm:block">
//       <h4 className="text-md">
//       {user?.firstName} {user?.lastName } 
//         </h4>
//       </div>
//     </div>
//     )}
//     </div>
//     <div className="col-span-10 sm:col-span-5 border-r-[1px] border-l-[1px] h-screen overflow-scroll border-gray-600 hide-scrollbar">
//         {props.children}
//     </div>
//     <div className="hidden sm:block sm:col-span-4 lg:col-span-4 p-5 w-full">
//      {!user && (<div className="border p-5 bg-slate-700 rounded-lg">
//         <h1 className="my-2 text-2xl">New to Twitter</h1>
//         <GoogleLogin onSuccess={handleLoginWithGoogle} />
//       </div>) }
//       <div className="px-4 py-3 bg-slate-800 rounded-lg">
//         <h1 className="my-2 text-lg font-extrabold mb-5">Users You May Know</h1>
//         {user?.recommendedUsers?.map((el) => (
//           <div className="flex items-center gap-3 mt-2" key={el?.id}>
//             {el?.profileImageURL && (
//               <Image className="rounded-full" src={el?.profileImageURL} alt="user-image" width={40} height={40} />
//             )}
//             <div>
//               <div className="text-sm">
//               <span>{el?.firstName} {el?.lastName}</span>
//               </div>
//               <Link href={`/${el?.id}`} className="bg-white text-black w-full text-sm px-2 py-1 rounded-lg">View</Link>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// }

// export default TwitterLayout;

"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useCallback, ReactNode } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";

import { useCurrentUser } from "@/hooks/user";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { authenticateWithGoogle } from "@/supabase/authenticateWithGoogle";

interface TwitterLayoutProps {
  children: ReactNode;
}

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
  link: string;
}

const TwitterLayout: React.FC<TwitterLayoutProps> = ({ children }) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const sidebarMenuItems: TwitterSidebarButton[] = useMemo(
    () => [
      { title: "Home", icon: <BiHomeCircle />, link: "/" },
      { title: "Explore", icon: <BiHash />, link: "/" },
      { title: "Notifications", icon: <BsBell />, link: "/" },
      { title: "Messages", icon: <BsEnvelope />, link: "/" },
      { title: "Bookmarks", icon: <BsBookmark />, link: "/" },
      { title: "Twitter Blue", icon: <BiMoney />, link: "/" },
      { title: "Profile", icon: <BiUser />, link: `/${user?.id}` },
      { title: "More", icon: <SlOptions />, link: "/" },
    ],
    [user?.id]
  );

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      try {
        const googleToken = cred.credential;
        if (!googleToken) throw new Error("Google token not found");

        const { verifyGoogleToken } = await graphqlClient.request(
          verifyUserGoogleTokenQuery,
          { token: googleToken }
        );

        if (!verifyGoogleToken) throw new Error("Failed to verify Google token");

        toast.success("Verified Successfully");
        window.localStorage.setItem("__twitter_token", verifyGoogleToken);

        const session = await authenticateWithGoogle(googleToken);
        if (!session) throw new Error("No Supabase session found");

        await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || "An error occurred during login.");
        } else {
          toast.error("An unknown error occurred during login.");
        }
      }
    },
    [queryClient]
  );

  return (
    <div className="grid grid-cols-12 h-screen w-screen sm:px-56">
      {/* Sidebar */}
      <div className="col-span-2 lg:col-span-3 pt-1 flex sm:justify-end pr-4 relative">
        <div>
          <div className="text-2xl h-fit w-fit hover:bg-gray-800 rounded-full p-3 cursor-pointer transition-all">
            <BsTwitter />
          </div>
          <div className="mt-2 text-xl pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.link}
                    className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-3 py-2 w-fit cursor-pointer mt-2"
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <span className="hidden sm:inline">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 px-3">
              <button className="hidden sm:block bg-[#1d9aef] font-semibold text-lg px-4 py-2 rounded-full w-full">
                Tweet
              </button>
              <button className="block sm:hidden bg-[#1d9aef] font-semibold text-lg px-4 py-2 rounded-full w-full">
                <BsTwitter />
              </button>
            </div>
          </div>

          {user && (
            <div className="absolute bottom-5 flex gap-2 items-center bg-slate-800 px-2 py-2 rounded-full">
              {user.profileImageURL && (
                <Image
                  className="rounded-full"
                  src={user.profileImageURL}
                  alt="user-image"
                  height={40}
                  width={40}
                />
              )}
              <div className="hidden sm:block">
                <h4 className="text-md">
                  {user.firstName} {user.lastName}
                </h4>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="col-span-10 sm:col-span-5 border-r-[1px] border-l-[1px] h-screen overflow-scroll border-gray-600 hide-scrollbar">
        {children}
      </div>

      {/* Right Sidebar */}
      <div className="hidden sm:block sm:col-span-4 lg:col-span-4 p-5 w-full">
        {!user && (
          <div className="border p-5 bg-slate-700 rounded-lg">
            <h1 className="my-2 text-2xl">New to Twitter</h1>
            <GoogleLogin onSuccess={handleLoginWithGoogle} />
          </div>
        )}

        {Array.isArray(user?.recommendedUsers) && user?.recommendedUsers?.length >= 0 && (
          <div className="px-4 py-3 bg-slate-800 rounded-lg">
            <h1 className="my-2 text-lg font-extrabold mb-5">Users You May Know</h1>
            {user.recommendedUsers.map((el) =>
              el ? (
                <div className="flex items-center gap-3 mt-2" key={el.id}>
                  {el.profileImageURL && (
                    <Image
                      className="rounded-full"
                      src={el.profileImageURL}
                      alt="user-image"
                      width={40}
                      height={40}
                    />
                  )}
                  <div>
                    <div className="text-sm">
                      {el.firstName} {el.lastName}
                    </div>
                    <Link
                      href={`/${el.id}`}
                      className="bg-white text-black text-sm px-2 py-1 rounded-lg"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>

      {/* Mobile Bottom Section */}
      <div className="sm:hidden col-span-12 p-4">
        {!user && (
          <div className="border p-4 bg-slate-700 rounded-lg">
            <h1 className="text-lg mb-2">New to Twitter</h1>
            <GoogleLogin onSuccess={handleLoginWithGoogle} />
          </div>
        )}

        {Array.isArray(user?.recommendedUsers) && user?.recommendedUsers?.length > 0 && (
          <div className="mt-4 bg-slate-800 p-4 rounded-lg">
            <h1 className="text-lg font-bold mb-4">Users You May Know</h1>
            {user.recommendedUsers.map((el) =>
              el ? (
                <div className="flex items-center gap-3 mt-3" key={el.id}>
                  {el.profileImageURL && (
                    <Image
                      className="rounded-full"
                      src={el.profileImageURL}
                      alt="user-image"
                      width={40}
                      height={40}
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {el.firstName} {el.lastName}
                    </p>
                    <Link
                      href={`/${el.id}`}
                      className="text-xs text-black bg-white px-2 py-1 rounded-md"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TwitterLayout;
