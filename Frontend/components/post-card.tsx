"use client";

import { useState } from "react";
import Image from "next/image";
import type { Post } from "@/lib/api";
import { postsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CrownIcon, TrashIcon, Loader2Icon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
  onDeleted?: () => void;
}

export function PostCard({ post, onDeleted }: PostCardProps) {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const author =
    typeof post.user === "object" ? post.user : null;
  const isOwner = user && author && user._id === author._id;

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeleting(true);
    try {
      await postsApi.delete(post._id);
      toast.success("Post deleted");
      onDeleted?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="flex-row items-center gap-3 p-4">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
            {author
              ? author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-medium text-foreground">
            {author?.name || "Unknown"}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        {post.isPremium && (
          <Badge
            variant="secondary"
            className="gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
          >
            <CrownIcon className="h-3 w-3" />
            Premium
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-square w-full bg-muted">
          <Image
            src={post.image}
            alt={post.caption || "Post image"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </CardContent>
      {(post.caption || isOwner) && (
        <CardFooter className="flex items-start justify-between gap-3 p-4">
          {post.caption && (
            <p className="flex-1 text-sm leading-relaxed text-foreground">
              {author && (
                <span className="mr-1 font-semibold">{author.name}</span>
              )}
              {post.caption}
            </p>
          )}
          {isOwner && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                <TrashIcon className="h-4 w-4" />
              )}
              <span className="sr-only">Delete post</span>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
