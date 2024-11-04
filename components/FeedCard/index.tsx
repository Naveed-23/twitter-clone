import Image from "next/image"
import Link from "next/link"
import React from "react"
import { AiOutlineHeart } from "react-icons/ai"
import { BiMessageRounded, BiUpload } from "react-icons/bi"
import { FaRetweet } from "react-icons/fa"

export interface Tweet {
    id: string;
    content: string;
    imageURL?: string;
    authorId: string;
    author: User;
  }
  
 export interface User {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    profileImageURL?: string;
    tweets: Tweet[];
  }
  

interface FeedCardProps{
    data: Tweet
}
 

const FeedCard: React.FC<FeedCardProps> = (props) => {
    const {data} = props
    return <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
        <div className="grid grid-cols-12 gap-3">
            <div className="col-span-1">
                {data.author?.profileImageURL && <Image src={data.author.profileImageURL} alt="user-image" height={50} width={50} className="rounded-full" />}
            </div>
            <div className="col-span-11">
                {<Link href={`${data.author?.id}`}>{data.author?.firstName} {data.author?.lastName}</Link>}
                <p>{data.content}</p>
                <div className="flex justify-between mt-5 text-lg items-center p-2 w-[90%]">
                    <div>
                        <BiMessageRounded />
                    </div>
                    <div>
                        <FaRetweet />
                    </div>
                    <div>
                        <AiOutlineHeart />
                    </div>
                    <div>
                        <BiUpload />
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default FeedCard