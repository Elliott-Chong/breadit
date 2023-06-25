"use client";
import React, { useCallback, useEffect, useRef } from "react";
import TextareaAutoSize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import type EditorJS from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

type Props = { subredditId: string };

const Editor = ({ subredditId }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      content: null,
      title: "",
    },
  });
  const ref = useRef<EditorJS>();
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;
    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Start writing your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], "imageUploader");
                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
      setTimeout(() => {
        // set focus to title
        _titleRef.current?.focus();
      }, 0);
    };
    if (isMounted) init();
    return () => {
      ref.current?.destroy();
      ref.current = undefined;
    };
  }, [isMounted, initializeEditor]);

  useEffect(() => {
    if (Object.keys(errors).length) {
      // eslint-disable-next-line no-unused-vars
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  const { ref: titleRef, ...rest } = register("title");

  const { mutate } = useMutation({
    mutationFn: async ({
      subredditId,
      title,
      content,
    }: PostCreationRequest) => {
      try {
        const payload: PostCreationRequest = {
          subredditId,
          title,
          content,
        };
        const { data } = await axios.post(
          "/api/subreddit/post/create",
          payload
        );
        return data;
      } catch (error) {
        return toast({
          title: "Oops, something went wrong",
          description: "Your post was not published",
          variant: "destructive",
        });
      }
    },
    onSuccess: () => {
      // r/mycommunity
      const newPathname = pathname.replace("/submit", "");
      router.push(newPathname);

      router.refresh();
      return toast({
        description: "Your post has been created",
      });
    },
  });

  async function onSubmit(data: PostCreationRequest) {
    const blocks = await ref.current?.save();

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      subredditId: subredditId,
    };
    mutate(payload);
  }

  return (
    <div className="w-full p-4 border rounded-lg bg-zinc-50 border-zinc-200">
      <form
        onSubmit={handleSubmit((e) => {
          onSubmit(e);
        })}
        className="w-fit"
        id="subreddit-post-form"
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutoSize
            ref={(e) => {
              titleRef(e);
              // @ts-ignore
              _titleRef.current = e;
            }}
            {...rest}
            placeholder="Title"
            className="w-full overflow-hidden font-bold bg-transparent appearance-none resize-none focus:outline-none"
          />
          <div id="editor" className="min-h-[500px]" />
        </div>
      </form>
    </div>
  );
};

export default Editor;
