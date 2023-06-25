"use client";
import React, { startTransition } from "react";
import { Button, buttonVariants } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { subscribeToSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
};

const SubscribeLeaveToggle = ({
  subredditId,
  subredditName,
  isSubscribed,
}: Props) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: subscribeToSubredditPayload = {
        subredditId,
      };
      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
        return toast({
          title: "There was a problem",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      return toast({
        title: "Subscribed",
        description: `You are now subscribed to ${subredditName}`,
      });
    },
  });
  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: subscribeToSubredditPayload = {
        subredditId,
      };
      const { data } = await axios.post("/api/subreddit/unsubscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
        return toast({
          title: "There was a problem",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      return toast({
        title: "Unsubscribed",
        description: `You are now unsubscribed from ${subredditName}`,
      });
    },
  });

  return isSubscribed ? (
    <>
      <Button
        onClick={() => unsubscribe()}
        isLoading={isUnsubLoading}
        className="w-full mt-1 mb-4"
      >
        Leave community
      </Button>
      <Link
        href={`r/${subredditName}/submit`}
        className={buttonVariants({
          variant: "outline",
          className: "w-full mb-6",
        })}
      >
        Create Post
      </Link>
    </>
  ) : (
    <Button
      onClick={() => {
        subscribe();
      }}
      isLoading={isSubLoading}
      className="w-full mt-1 mb-4"
    >
      Join to post
    </Button>
  );
};

export default SubscribeLeaveToggle;
