"use client"
import React, { useCallback, useState } from "react";
import { BiHash, BiHomeCircle, BiImageAlt, BiMoney, BiUser } from "react-icons/bi";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import FeedCard, { Tweet } from "@/components/FeedCard";
import { SlOptions } from "react-icons/sl";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";


interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
}

const sidebarMenuItems: TwitterSidebarButton[] = [
  {
    title: 'Home',
    icon: <BiHomeCircle />
  },
  {
    title: 'Explore',
    icon: <BiHash />
  },
  {
    title: 'Notifications',
    icon: <BsBell />
  },
  {
    title: 'Messages',
    icon: <BsEnvelope />
  },
  {
    title: 'Bookmarks',
    icon: <BsBookmark />
  },
  {
    title: 'Twitter Blue',
    icon: <BiMoney />
  },
  {
    title: 'Profile',
    icon: <BiUser />
  },
  {
    title: 'More',
    icon: <SlOptions /> 
  }
]

export default function Home() {

  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const { tweets = [] } = useGetAllTweets()
  const [ content, setContent ] = useState("");
  const { mutate } = useCreateTweet();

  const handleSelectImage = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click();
  },[])

  const handleCreateTweet = useCallback(() => {
     mutate({
      content,
     })
  },[content, mutate])

  const handleLoginWithGoogle = useCallback(async (cred: CredentialResponse) => {
    const googleToken = cred.credential

    if(!googleToken) return toast.error(`Google token not found`);

    const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleTokenQuery, {token: googleToken});

    toast.success(`Verified Success`)

    console.log(verifyGoogleToken);

    if(verifyGoogleToken) window.localStorage.setItem('__twitter_token', verifyGoogleToken);

    await queryClient.invalidateQueries({ queryKey: ['current-user'] });


  }, [queryClient]);

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-56">
        <div className="col-span-3 pt-1 ml-28">
          <div className="text-2xl h-fit w-fit hover:bg-gray-800 rounded-full p-3 cursor-pointer transition-all">
            <BsTwitter />
          </div>
        <div className="mt-2 text-xl pr-4">
          <ul>
          {sidebarMenuItems.map((item) => (
          <li className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-3 py-3 w-fit cursor-pointer mt-2" key={item.title}>
            <span className="text-3xl">{item.icon}</span>
            <span>{item.title}</span>
            </li>))}
          </ul>
          <div className="mt-5 px-3">
            <button className="bg-[#1d9aef] font-semibold text-lg px-4 py-2 rounded-full w-full">
              Tweet
            </button>
          </div>
        </div>
        { user && (
        <div className="absolute bottom-5 flex gap-2 items-center bg-slate-800 px-3 py-2 rounded-full">
          {user?.profileImageURL && (<Image className="rounded-full" src={user?.profileImageURL} alt='user-image' height={50} width={50} />)}
          <div>
          <h3 className="text-xl">
          {user?.firstName} {user?.lastName } 
            </h3>
          </div>
        </div>
        )}
        </div>
        <div className="col-span-5 border-r-[1px] border-l-[1px] h-screen overflow-scroll border-gray-600 hide-scrollbar">
          <div>
          <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-1">
               {user?.profileImageURL && <Image src={user?.profileImageURL} alt="user-image" height={50} width={50} className="rounded-full" />}
            </div>
            <div className="col-span-11">
              <textarea value={content} onChange={(e) => setContent(e.target.value)} className="border-b border-slate-700 w-full bg-transparent text-xl px-3" placeholder="What's happening?" rows={3}></textarea>
              <div className="mt-2 flex justify-between items-center">
                <BiImageAlt onClick={handleSelectImage} className="text-xl" />
                <button onClick={handleCreateTweet} className="bg-[#1d9aef] font-semibold text-sm px-4 py-2 rounded-full">
                  Tweet
                </button>
              </div>

            </div>

          </div>
          </div>

          </div>
          {
            tweets?.map(tweet => tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null)
          }
        </div>
        <div className="col-span-3 p-5">
         {!user && <div className="border p-5 bg-slate-700 rounded-lg">
            <h1 className="my-2 text-2xl">New to Twitter</h1>
            <GoogleLogin onSuccess={handleLoginWithGoogle} />
          </div>}
        </div>
      </div>
    </div>
  );
}
