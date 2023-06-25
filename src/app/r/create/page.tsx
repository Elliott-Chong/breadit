"use client";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { createSubredditPayload } from "@/lib/validators/subreddit";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";

const Page = () => {
  const [input, setInput] = React.useState<string>("");
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: createSubredditPayload = {
        name: input,
      };
      const { data } = await axios.post("/api/subreddit", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Subreddit already exists.",
            description: "Please choose a different subreddit name",
            variant: "destructive",
          });
        }
        if (err.response?.status === 422) {
          return toast({
            title: "Invalid subreddit name.",
            description: "Please choose a name between 3 and 21 characters.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 401) {
          return loginToast();
        }

        toast({
          title: "There was an error",
          description: "Could not create subreddit.",
          variant: "destructive",
        });
      }
    },
    onSuccess: (data) => {
      router.push(`/r/${data}`);
    },
  });

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative w-full p-4 space-y-6 bg-white rounded-lg h-fit">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Create a community</h1>
        </div>

        <h1 className="h-px bg-zinc-500 " />
        <div>
          <p className="text-xl font-medium">Name</p>
          <p className="pb-2 text-sx">
            Community names including capitalization cannot be changed!
          </p>

          <div className="relative">
            <p className="absolute inset-y-0 left-0 grid w-8 text-sm place-items-center text-zinc-400">
              r/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="subtle" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => {
              createCommunity();
            }}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
