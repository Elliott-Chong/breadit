import { Post, User, Vote } from "@prisma/client";
import React, { useRef } from "react";
import { formatTimeToNow } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./post-vote/PostVoteClient";

type PartialVote = Pick<Vote, "type">;

type Props = {
  subredditName: string;
  post: Post & { author: User; votes: Vote[] };
  commentAmt: number;
  votesAmt: number;
  currentVote?: PartialVote;
};

const Post = ({
  subredditName,
  post,
  commentAmt,
  votesAmt: _votesAmt,
  currentVote,
}: Props) => {
  const pRef = useRef<HTMLDivElement>(null);
  return (
    <div className="bg-white rounded-md shadow">
      <div className="flex justify-between px-6 py-4">
        {/* TODO PostVotes */}
        <PostVoteClient
          initialVoteAmt={_votesAmt}
          initialVote={currentVote?.type}
          postId={post.id}
        />

        <div className="flex-1 w-0">
          <div className="mt-1 text-xs text-gray-500 max-h-40">
            {subredditName ? (
              <>
                <a
                  href={`/r/${subredditName}`}
                  className="text-sm underline text-zinc-900 underline-offset-2"
                >
                  r/{subredditName}
                </a>
                <span className="px-1">-</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.username}</span>{" "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="py-2 text-lg font-semibold leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>
          <div
            className="relative w-full text-sm max-h-40 overflow-clip"
            ref={pRef}
          >
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>
          P
        </div>
      </div>
      <div className="z-20 p-4 text-sm bg-gray-50 sm:px-6">
        <a
          className="flex items-center gap-2 w-fit"
          href={`/r/${subredditName}/post/${post.id}`}
        >
          <MessageSquare className="w-4 h-4" />
          {commentAmt}
        </a>
      </div>
    </div>
  );
};

export default Post;
