import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Save, Mail, Calendar } from "lucide-react";
import { updateProfile } from "../api/user";
import { useAuth } from "../context/AuthContext";
import { GlassCard, Input, Button, Badge, Loader } from "../components/ui";
import { extractErrorMessage } from "../api/axios";

export default function Profile() {
  const { user, setUser, loading } = useAuth();
  const [form, setForm] = useState({ username: "", phone: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ username: user.username || "", phone: user.phone || "" });
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProfile(form);
      setUser(updated);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) return <Loader label="Loading profile" />;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display mb-1 text-2xl font-semibold">Your profile</h1>
      <p className="mb-6 text-sm text-muted">Update how recruiters and job seekers see you.</p>

      <GlassCard strong className="p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet to-cyan font-display text-xl font-semibold text-white">
            {user.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-semibold">{user.username}</span>
              <Badge tone={user.role}>{user.role?.replace("_", " ")}</Badge>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
              <Mail size={13} /> {user.email}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Username"
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <Input
            label="Phone"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Button type="submit" loading={saving} className="self-start">
            <Save size={16} /> Save changes
          </Button>
        </form>

        <div className="mt-6 flex items-center gap-1.5 text-xs text-faint">
          <Calendar size={13} /> Member since {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </GlassCard>
    </div>
  );
}
