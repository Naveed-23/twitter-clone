"use client"
import type { NextPage } from "next";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { BsArrowLeftShort } from "react-icons/bs";
import Image from "next/image";
import { useGetUserById } from "@/hooks/user";
import FeedCard, { Tweet, User } from "@/components/FeedCard";
import { notFound, useParams } from "next/navigation";

interface ServerProps {
    user?: User
}

const UserProfilePage: NextPage<ServerProps> = () => {
    const params = useParams();
    const id = params?.id as string;
    const { user , isLoading, error } = useGetUserById(id);

    if (isLoading) return <p>Loading...</p>;
    if (error || !user) {
        return notFound();
    }

    return (
        <div>
            <TwitterLayout>
                <div>
                    <nav className="flex items-center gap-3 py-3">
                        <BsArrowLeftShort className="text-4xl" />
                        <div>
                           <h1 className="text-2xl font-bold">Naveed Hussain</h1> 
                           <h1 className="text-md font-bold text-slate-500">{user?.tweets?.length} Tweets</h1>
                        </div>
                    </nav>
                    <div className="p-4 border-b border-slate-800">
                        {user?.profileImageURL && (<Image src={user?.profileImageURL} alt="user-image" className="rounded-full" width={100} height={100} />)}
                        <h1 className="text-2xl font-bold mt-5">Naveed Hussain</h1> 
                    </div>
                    <div>
                        {user?.tweets?.map(tweet => (
                            <FeedCard data={tweet as Tweet} key={tweet?.id} />
                        ))}
                    </div>
                </div>
             </TwitterLayout>
        </div>

    )
}

export default UserProfilePage;