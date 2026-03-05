"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { subscriptionsApi, type Subscription } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  CalendarIcon,
  CrownIcon,
  Loader2Icon,
  RefreshCwIcon,
  XCircleIcon,
} from "lucide-react";
import { format } from "date-fns";

export default function SubscriptionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    subscriptionsApi
      .getAll({ userId: user._id })
      .then((res) => setSubscriptions(res.subscriptions))
      .catch(() => toast.error("Failed to load subscriptions"))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-foreground">Sign in required</CardTitle>
            <CardDescription>
              You need to be logged in to view your subscription.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")}>Sign in</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  async function handleCancel(subId: string) {
    if (!confirm("Are you sure you want to cancel this subscription?")) return;
    setActionId(subId);
    try {
      const res = await subscriptionsApi.cancel(subId);
      setSubscriptions((prev) =>
        prev.map((s) => (s._id === subId ? res.subscription : s))
      );
      toast.success("Subscription cancelled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel");
    } finally {
      setActionId(null);
    }
  }

  async function handleRenew(subId: string) {
    setActionId(subId);
    try {
      const res = await subscriptionsApi.renew(subId);
      setSubscriptions((prev) =>
        prev.map((s) => (s._id === subId ? res.subscription : s))
      );
      toast.success("Subscription renewed!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to renew");
    } finally {
      setActionId(null);
    }
  }

  const statusColors: Record<string, string> = {
    active:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    cancelled:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    expired:
      "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/30 dark:text-zinc-400",
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-5 w-72" />
        <div className="mt-8 flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          My Subscriptions
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your active and past subscriptions
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <Card className="text-center">
          <CardContent className="flex flex-col items-center py-12">
            <CrownIcon className="h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              No subscriptions yet
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Subscribe to a plan to access premium content.
            </p>
            <Button className="mt-6" onClick={() => router.push("/plans")}>
              Browse plans
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {subscriptions.map((sub) => {
            const plan =
              typeof sub.plan === "object" ? sub.plan : null;
            return (
              <Card key={sub._id}>
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        {plan?.name || "Plan"}
                      </h3>
                      <Badge className={statusColors[sub.status] || ""}>
                        {sub.status}
                      </Badge>
                    </div>
                    {plan && (
                      <p className="text-sm text-muted-foreground">
                        ${plan.price} for {plan.duration} days
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        Start: {format(new Date(sub.startDate), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        End: {format(new Date(sub.endDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {sub.status === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(sub._id)}
                        disabled={actionId === sub._id}
                      >
                        {actionId === sub._id ? (
                          <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <XCircleIcon className="mr-1 h-4 w-4" />
                        )}
                        Cancel
                      </Button>
                    )}
                    {(sub.status === "cancelled" ||
                      sub.status === "expired") && (
                      <Button
                        size="sm"
                        onClick={() => handleRenew(sub._id)}
                        disabled={actionId === sub._id}
                      >
                        {actionId === sub._id ? (
                          <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCwIcon className="mr-1 h-4 w-4" />
                        )}
                        Renew
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
