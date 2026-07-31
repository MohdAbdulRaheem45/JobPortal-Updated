import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bell, Check } from "lucide-react";
import { getMyNotifications, markNotificationRead } from "../api/notifications";
import { GlassCard, Loader, EmptyState, Button } from "../components/ui";
import { extractErrorMessage } from "../api/axios";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      setItems(await getMyNotifications());
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(id) {
    setMarkingId(id);
    try {
      await markNotificationRead(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setMarkingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display mb-1 text-2xl font-semibold">Notifications</h1>
      <p className="mb-6 text-sm text-muted">Updates on applications and activity.</p>

      {loading ? (
        <Loader label="Loading notifications" />
      ) : items.length === 0 ? (
        <EmptyState title="You're all caught up" description="New updates will show up here." />
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((n) => (
            <GlassCard
              key={n.id}
              className={`flex items-start gap-3 p-4 ${!n.read ? "border-cyan/30" : ""}`}
            >
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  n.read ? "bg-white/5 text-faint" : "bg-cyan/15 text-cyan"
                }`}
              >
                <Bell size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm ${n.read ? "text-muted" : "text-ink"}`}>{n.message}</p>
                <p className="mt-0.5 text-xs text-faint">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.read && (
                <Button
                  variant="secondary"
                  className="shrink-0 !px-2.5 !py-1.5 text-xs"
                  loading={markingId === n.id}
                  onClick={() => handleMarkRead(n.id)}
                >
                  <Check size={13} /> Mark read
                </Button>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
