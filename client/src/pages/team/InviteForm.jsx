import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/api/axios";
import { useAuth } from "@/hooks/useAuth";
import { inviteSchema } from "@/schemas/inviteSchemas.js";

export default function InviteForm({ onSuccess }) {
  const { role } = useAuth();
  const [email, setEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("driver");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const parsed = inviteSchema.safeParse({
      email,
      role: inviteRole,
    });

    if (!parsed.success) {
      return toast.error(parsed.error.issues[0].message);
    }

    try {
      setLoading(true);
      const res = await api.post("/invites", parsed.data);
      if (res.data?.devInviteLink) {
        toast(
          (t) => (
            <div className="flex flex-col">
              <span className="font-bold text-xs">
                DEMO: Invite Link Generated
              </span>
              <input
                readOnly
                value={res.data.devInviteLink}
                className="text-black text-xs p-1 my-1 rounded"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(res.data.devInviteLink);
                  toast.success("Copied!");
                }}
                className="bg-white text-black text-xs px-2 py-1 rounded"
              >
                Copy Link
              </button>
            </div>
          ),
          { duration: 10000 },
        );
      } else {
        toast.success("Invite sent!");
      }
      setEmail("");
      onSuccess?.(); //trigger refresh
    } catch (err) {
      toast.error(err.response?.data?.message || "Invite failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#020617] border border-white/10 rounded-md p-6 w-full">
      <h3 className="font-semibold mb-4">Invite Team Member</h3>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <input
          className="auth-input md:col-span-5 h-[44px]"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          value={inviteRole}
          onChange={(e) => setInviteRole(e.target.value)}
          className="auth-select md:col-span-3 h-[44px]"
        >
          <option value="driver">Driver</option>
          <option value="manager">Manager</option>
        </select>

        <button
          onClick={submit}
          disabled={loading}
          className="md:col-span-4 h-[44px] ui-btn-primary"
        >
          Send Invite
        </button>
      </div>
    </div>
  );
}
