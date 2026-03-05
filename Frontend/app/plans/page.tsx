"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { plansApi, subscriptionsApi, type Plan } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CheckIcon, CrownIcon, Loader2Icon } from "lucide-react";

export default function PlansPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribingId, setSubscribingId] = useState<string | null>(null);

  useEffect(() => {
    plansApi
      .getAll()
      .then((res) => setPlans(res.plans.filter((p) => p.isActive)))
      .catch(() => toast.error("Failed to load plans"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubscribe(planId: string) {
    if (!user) {
      router.push("/login");
      return;
    }
    setSubscribingId(planId);
    try {
      await subscriptionsApi.create(planId);
      toast.success("Subscribed successfully!");
      router.push("/subscription");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to subscribe"
      );
    } finally {
      setSubscribingId(null);
    }
  }

  function formatDuration(days: number) {
    if (days === 365) return "/year";
    if (days === 30) return "/month";
    if (days === 7) return "/week";
    return `/${days} days`;
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto h-10 w-64" />
          <Skeleton className="mx-auto mt-3 h-5 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground">
          Plans and Pricing
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Get access to premium content. Choose the plan that works for you.
        </p>
      </div>

      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <CrownIcon className="h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            No plans available
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Check back later for subscription plans.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const isPopular = index === 1;
            return (
              <Card
                key={plan._id}
                className={`relative flex flex-col ${
                  isPopular
                    ? "border-primary shadow-lg ring-1 ring-primary/20"
                    : ""
                }`}
              >
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Popular
                  </Badge>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-foreground">
                    {plan.name}
                  </CardTitle>
                  <CardDescription>
                    Access premium content for {plan.duration} days
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-bold tracking-tight text-foreground">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      {formatDuration(plan.duration)}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-3">
                    <li className="flex items-center gap-2 text-sm text-foreground">
                      <CheckIcon className="h-4 w-4 text-primary" />
                      Access to all premium posts
                    </li>
                    <li className="flex items-center gap-2 text-sm text-foreground">
                      <CheckIcon className="h-4 w-4 text-primary" />
                      {plan.duration} days of access
                    </li>
                    <li className="flex items-center gap-2 text-sm text-foreground">
                      <CheckIcon className="h-4 w-4 text-primary" />
                      Cancel anytime
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={isPopular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan._id)}
                    disabled={subscribingId === plan._id}
                  >
                    {subscribingId === plan._id ? (
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Subscribe
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
