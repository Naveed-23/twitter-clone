"use client";
import React, { useCallback, useState } from "react";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { useCurrentUser } from "@/hooks/user";
import { BiImageAlt } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Image from "next/image";
import FeedCard, { Tweet } from "@/components/FeedCard";
import uploadImage from "@/supabase/uploadImage";

export default function Home() {
  const { user } = useCurrentUser();
  const { tweets = [] } = useGetAllTweets();

  const [content, setContent] = useState("");
  const { mutate } = useCreateTweet();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target?.files?.[0];
      if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file)); // Generate a preview URL
      }
    };
  }, []);

  const handleCreateTweet = useCallback(async () => {
    let imageURL = null;

    if (imageFile) {
      imageURL = await uploadImage(imageFile);
      if (!imageURL) return; // Exit if upload failed
    }

    mutate({
      content,
      imageURL, // Include image URL
    });

    setContent("");
    setImageFile(null);
    setImagePreview(null); // Clear the image preview
  }, [content, imageFile, mutate]);

  const handleRemoveImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null); // Remove the preview
  }, []);

  return (
    <div>
      <TwitterLayout>
        <div>
          <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-1">
                {user?.profileImageURL && (
                  <Image
                    src={user?.profileImageURL}
                    alt="user-image"
                    height={50}
                    width={50}
                    className="rounded-full"
                  />
                )}
              </div>
              <div className="col-span-11">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="border-b border-slate-700 w-full bg-transparent text-xl px-3"
                  placeholder="What's happening?"
                  rows={3}
                ></textarea>
                {imagePreview && (
                  <div className="relative mt-3">
                    <Image
                      src={imagePreview}
                      alt="Selected"
                      height={200}
                      width={300}
                      className="rounded-lg"
                    />
                    <AiOutlineCloseCircle
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 text-2xl cursor-pointer bg-black rounded-full text-white"
                    />
                  </div>
                )}
                <div className="mt-2 flex justify-between items-center">
                  <BiImageAlt
                    onClick={handleSelectImage}
                    className="text-xl cursor-pointer"
                  />
                  <button
                    onClick={handleCreateTweet}
                    className="bg-[#1d9aef] font-semibold text-sm px-4 py-2 rounded-full"
                  >
                    Tweet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {tweets?.map((tweet) =>
          tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null
        )}
      </TwitterLayout>
    </div>
  );
}




