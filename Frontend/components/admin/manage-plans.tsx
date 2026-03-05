"use client";

import { useState, useEffect, useCallback } from "react";
import { plansApi, type Plan } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  Loader2Icon,
} from "lucide-react";
import { format } from "date-fns";

export function ManagePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      const res = await plansApi.getAll();
      setPlans(res.plans);
    } catch {
      toast.error("Failed to load plans");
    }
  }, []);

  useEffect(() => {
    fetchPlans().finally(() => setLoading(false));
  }, [fetchPlans]);

  function openCreateDialog() {
    setEditingPlan(null);
    setFormData({ name: "", price: "", duration: "" });
    setDialogOpen(true);
  }

  function openEditDialog(plan: Plan) {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: String(plan.price),
      duration: String(plan.duration),
    });
    setDialogOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        duration: Number(formData.duration),
      };
      if (editingPlan) {
        await plansApi.update(editingPlan._id, payload);
        toast.success("Plan updated");
      } else {
        await plansApi.create(payload);
        toast.success("Plan created");
      }
      setDialogOpen(false);
      await fetchPlans();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save plan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(planId: string) {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    setDeletingId(planId);
    try {
      await plansApi.delete(planId);
      toast.success("Plan deleted");
      await fetchPlans();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete plan"
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-lg text-foreground">
          Subscription Plans
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreateDialog}>
              <PlusIcon className="mr-1 h-4 w-4" />
              Add Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingPlan ? "Edit Plan" : "Create Plan"}
              </DialogTitle>
              <DialogDescription>
                {editingPlan
                  ? "Update the plan details below."
                  : "Fill in the details for the new plan."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="plan-name">Name</Label>
                <Input
                  id="plan-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Premium"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="plan-price">Price ($)</Label>
                <Input
                  id="plan-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="e.g. 9.99"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="plan-duration">Duration (days)</Label>
                <Input
                  id="plan-duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, duration: e.target.value }))
                  }
                  placeholder="e.g. 30"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingPlan ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : plans.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No plans created yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan._id}>
                    <TableCell className="font-medium text-foreground">
                      {plan.name}
                    </TableCell>
                    <TableCell>${plan.price}</TableCell>
                    <TableCell>{plan.duration} days</TableCell>
                    <TableCell>
                      <Badge
                        variant={plan.isActive ? "default" : "secondary"}
                        className={
                          plan.isActive
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : ""
                        }
                      >
                        {plan.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(plan.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(plan)}
                        >
                          <PencilIcon className="h-4 w-4" />
                          <span className="sr-only">Edit plan</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(plan._id)}
                          disabled={deletingId === plan._id}
                        >
                          {deletingId === plan._id ? (
                            <Loader2Icon className="h-4 w-4 animate-spin" />
                          ) : (
                            <TrashIcon className="h-4 w-4" />
                          )}
                          <span className="sr-only">Delete plan</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
