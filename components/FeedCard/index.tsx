import Image from "next/image"
import React from "react"
import { AiOutlineHeart } from "react-icons/ai"
import { BiMessageRounded, BiUpload } from "react-icons/bi"
import { FaRetweet } from "react-icons/fa"

const FeedCard: React.FC = () => {
    return <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
        <div className="grid grid-cols-12 gap-3">
            <div className="col-span-1">
                <Image src='https://avatars.githubusercontent.com/u/8079861?v=4' alt="user-image" height={50} width={50} className="rounded-full" />
            </div>
            <div className="col-span-11">
                <h5>Naveed Hussain</h5>
                <p>Coded in 11+ different programming languages in 4 months at Google. 🤯 So, don't get too emotionally attached with any coding language. At the end of the day, its just a tool.</p>
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