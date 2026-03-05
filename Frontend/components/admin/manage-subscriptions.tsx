"use client";

import { useState, useEffect, useCallback } from "react";
import { subscriptionsApi, type Subscription } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2Icon, XCircleIcon, RefreshCwIcon } from "lucide-react";
import { format } from "date-fns";

export function ManageSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async (status?: string) => {
    try {
      const filter =
        status && status !== "all" ? { status } : undefined;
      const res = await subscriptionsApi.getAll(filter);
      setSubscriptions(res.subscriptions);
    } catch {
      toast.error("Failed to load subscriptions");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchSubscriptions(statusFilter).finally(() => setLoading(false));
  }, [statusFilter, fetchSubscriptions]);

  async function handleCancel(subId: string) {
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
      toast.success("Subscription renewed");
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

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-lg text-foreground">
          All Subscriptions
        </CardTitle>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : subscriptions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No subscriptions found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => {
                  const usr =
                    typeof sub.user === "object" ? sub.user : null;
                  const plan =
                    typeof sub.plan === "object" ? sub.plan : null;
                  return (
                    <TableRow key={sub._id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">
                            {usr?.name || "Unknown"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {usr?.email || ""}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">
                        {plan?.name || "Unknown"}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[sub.status] || ""}>
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(sub.startDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(sub.endDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {sub.status === "active" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => handleCancel(sub._id)}
                              disabled={actionId === sub._id}
                            >
                              {actionId === sub._id ? (
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircleIcon className="mr-1 h-4 w-4" />
                              )}
                              Cancel
                            </Button>
                          )}
                          {(sub.status === "cancelled" ||
                            sub.status === "expired") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRenew(sub._id)}
                              disabled={actionId === sub._id}
                            >
                              {actionId === sub._id ? (
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                              ) : (
                                <RefreshCwIcon className="mr-1 h-4 w-4" />
                              )}
                              Renew
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
