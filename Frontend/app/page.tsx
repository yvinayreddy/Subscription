"use client";

import { useState, useEffect, useCallback } from "react";
import { postsApi, type Post } from "@/lib/api";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon, Loader2Icon } from "lucide-react";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = useCallback(async (pageNum: number, append = false) => {
    try {
      const result = await postsApi.getAll(pageNum, 12);
      if (append) {
        setPosts((prev) => [...prev, ...result.data]);
      } else {
        setPosts(result.data);
      }
      setTotalPages(result.pagination.pages);
    } catch {
      // silently fail - empty state will show
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPosts(1).finally(() => setLoading(false));
  }, [fetchPosts]);

  async function loadMore() {
    const next = page + 1;
    setLoadingMore(true);
    await fetchPosts(next, true);
    setPage(next);
    setLoadingMore(false);
  }

  function handleDeleted() {
    setPage(1);
    setLoading(true);
    fetchPosts(1).finally(() => setLoading(false));
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Feed
          </h1>
          <p className="mt-1 text-muted-foreground">
            Discover the latest posts from the community
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Feed
          </h1>
          <p className="mt-1 text-muted-foreground">
            Discover the latest posts from the community
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-24">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            No posts yet
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Be the first to share something with the community.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Feed
        </h1>
        <p className="mt-1 text-muted-foreground">
          Discover the latest posts from the community
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} onDeleted={handleDeleted} />
        ))}
      </div>
      {page < totalPages && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore && (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
