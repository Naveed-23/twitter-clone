"use client"
import Image from "next/image";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { SlOptions } from "react-icons/sl";
import { useCurrentUser } from "@/hooks/user";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";


interface TwitterLayoutProps {
    children: React.ReactNode;
}

interface TwitterSidebarButton {
    title: string;
    icon: React.ReactNode;
    link: string;
  }
  


const TwitterLayout: React.FC<TwitterLayoutProps> = (props) => {

    const { user } = useCurrentUser();
    const queryClient = useQueryClient();

    const sidebarMenuItems: TwitterSidebarButton[] = useMemo(() => [
      {
        title: 'Home',
        icon: <BiHomeCircle />,
        link: '/'
      },
      {
        title: 'Explore',
        icon: <BiHash />,
        link: '/'
      },
      {
        title: 'Notifications',
        icon: <BsBell />,
        link: '/'
      },
      {
        title: 'Messages',
        icon: <BsEnvelope />,
        link: '/'
      },
      {
        title: 'Bookmarks',
        icon: <BsBookmark />,
        link: '/'
      },
      {
        title: 'Twitter Blue',
        icon: <BiMoney />,
        link: '/'
      },
      {
        title: 'Profile',
        icon: <BiUser />,
        link: `/${user?.id}`
      },
      {
        title: 'More',
        icon: <SlOptions />,
        link: '/'
      }
    ], [user?.id]); 

    const handleLoginWithGoogle = useCallback(async (cred: CredentialResponse) => {
        const googleToken = cred.credential
    
        if(!googleToken) return toast.error(`Google token not found`);
    
        const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleTokenQuery, {token: googleToken});
    
        toast.success(`Verified Success`)
    
        console.log(verifyGoogleToken);
    
        if(verifyGoogleToken) window.localStorage.setItem('__twitter_token', verifyGoogleToken);
    
        await queryClient.invalidateQueries({ queryKey: ['current-user'] });
    
    
      }, [queryClient]);


    return <div className="grid grid-cols-12 h-screen w-screen sm:px-56">
    <div className="col-span-2 sm:col-span-3 pt-1 flex sm:justify-end pr-4 relative">
    <div>
        <div className="text-2xl h-fit w-fit hover:bg-gray-800 rounded-full p-3 cursor-pointer transition-all">
            <BsTwitter />
        </div>
        <div className="mt-2 text-xl pr-4">
        <ul>
        {sidebarMenuItems.map((item) => (
        <li key={item.title}>
          <Link className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-3 py-3 w-fit cursor-pointer mt-2" href={item.link}>
            <span className="text-3xl">{item.icon}</span>
            <span className="hidden sm:inline">{item.title}</span>
          </Link>
            </li>))}
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
    </div>
    { user && (
    <div className="absolute bottom-5 flex gap-2 items-center bg-slate-800 px-3 py-2 rounded-full">
      {user?.profileImageURL && (<Image className="rounded-full" src={user?.profileImageURL} alt='user-image' height={50} width={50} />)}
      <div className="hidden sm:block">
      <h3 className="text-xl">
      {user?.firstName} {user?.lastName } 
        </h3>
      </div>
    </div>
    )}
    </div>
    <div className="col-span-10 sm:col-span-5 border-r-[1px] border-l-[1px] h-screen overflow-scroll border-gray-600 hide-scrollbar">
        {props.children}
    </div>
    <div className="cpl-span-0 sm:col-span-3 p-5">
     {!user && <div className="border p-5 bg-slate-700 rounded-lg">
        <h1 className="my-2 text-2xl">New to Twitter</h1>
        <GoogleLogin onSuccess={handleLoginWithGoogle} />
      </div>}
    </div>
  </div>
}

export default TwitterLayout;