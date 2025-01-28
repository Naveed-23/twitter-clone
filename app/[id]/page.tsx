"use client";
import { NextPage } from "next";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { BsArrowLeftShort } from "react-icons/bs";
import Image from "next/image";
import { useCurrentUser, useGetUserById } from "@/hooks/user";
import FeedCard, { Tweet, User } from "@/components/FeedCard";
import { notFound, useParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { graphqlClient } from "@/clients/api";
import { followUserMutation, unfollowUserMutation } from "@/graphql/mutation/user";
import { useQueryClient } from "@tanstack/react-query";
import LoadingPage from "@/components/Loading";

const UserProfilePage: NextPage = () => {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const id = params?.id as string;
    const { user: currentUser } = useCurrentUser();
    const { user, isLoading, error } = useGetUserById(id);

    interface CurrentUserData {
    following: User[];
}
interface UserData {
    followers: User[];
}

    const amIFollowing = useMemo(() => {
        if (!user) return false;
        return (
            (currentUser?.following?.findIndex((el) => el?.id === user?.id) ?? -1) >= 0
        );
    }, [currentUser?.following, user]);

    const handleGoBack = () => {
        router.back();
    };

    const handleUnfollowUser = useCallback(async () => {
        if (!user?.id) return;

        queryClient.setQueryData(['current-user'], (oldData: CurrentUserData | undefined) => {
            if (!oldData || !oldData.following) return oldData;
            return {
                ...oldData,
                following: oldData.following.filter((u: User) => u.id !== user.id),
            };
        });

        queryClient.setQueryData(['user', id], (oldData: UserData | undefined) => {
            if (!oldData || !oldData.followers) return oldData;
            return {
                ...oldData,
                followers: oldData.followers.filter((u: User) => u.id !== currentUser?.id),
            };
        });

        try {
            await graphqlClient.request(unfollowUserMutation, { to: user?.id });
        } finally {
            await queryClient.invalidateQueries({ queryKey: ['current-user'] });
            await queryClient.invalidateQueries({ queryKey: ['user', id] });
        }
    }, [queryClient, user, id, currentUser]);

    const handleFollowUser = useCallback(async () => {
        if (!user?.id) return;

        queryClient.setQueryData(['current-user'], (oldData: CurrentUserData | undefined) => {
            if (!oldData || !oldData.following) return oldData;
            return {
                ...oldData,
                following: [...oldData.following, user],
            };
        });

        queryClient.setQueryData(['user', id], (oldData: UserData | undefined) => {
            if (!oldData || !oldData.followers) return oldData;
            return {
                ...oldData,
                followers: [...oldData.followers, currentUser],
            };
        });

        try {
            await graphqlClient.request(followUserMutation, { to: user?.id });
        } finally {
            await queryClient.invalidateQueries({ queryKey: ['current-user'] });
            await queryClient.invalidateQueries({ queryKey: ['user', id] });
        }
    }, [queryClient, user, id, currentUser]);

    if (isLoading) return <LoadingPage />;
    if (error || !user) {
        return notFound();
    }

    return (
        <div>
            <TwitterLayout>
                <div>
                    <nav className="flex items-center gap-3 py-3">
                        <BsArrowLeftShort onClick={handleGoBack} className="text-4xl cursor-pointer" />
                        <div>
                            <h1 className="text-2xl font-bold">{user?.firstName}</h1>
                            <h1 className="text-md font-bold text-slate-500">{user?.tweets?.length} Tweets</h1>
                        </div>
                    </nav>
                    <div className="p-4 border-b border-slate-800">
                        {user?.profileImageURL && (
                            <Image src={user?.profileImageURL} alt="user-image" className="rounded-full" width={100} height={100} />
                        )}
                        <h1 className="text-2xl font-bold mt-5">{user?.firstName} {user?.lastName}</h1>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4 mt-2 text-sm text-gray-400">
                                <span>{user?.followers?.length} Followers</span>
                                <span>{user?.following?.length} Following</span>
                            </div>
                            {currentUser?.id !== user?.id && (
                                amIFollowing ? (
                                    <button onClick={handleUnfollowUser} className="bg-white text-black px-3 py-1 text-sm rounded-full">Unfollow</button>
                                ) : (
                                    <button onClick={handleFollowUser} className="bg-white text-black px-3 py-1 text-sm rounded-full">Follow</button>
                                )
                            )}
                        </div>
                    </div>
                    <div>
                        {user?.tweets?.map(tweet => (
                            <FeedCard data={tweet as Tweet} key={tweet?.id} />
                        ))}
                    </div>
                </div>
            </TwitterLayout>
        </div>
    );
};

export default UserProfilePage;

