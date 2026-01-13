import { LockClosedIcon } from "@heroicons/react/24/solid"

export default function SuspendedNotice({ reason, manager }) {
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
      <LockClosedIcon className="w-10 h-10 mx-auto text-red-400 mb-4" />

      <h2 className="text-xl font-semibold mb-2">
        Account Suspended
      </h2>

      <p className="text-sm text-gray-300 mb-4">
        Your access has been temporarily suspended by your organization.
      </p>

      {manager && (
        <p className="text-sm text-gray-400">
          Contact <strong>{manager.name}</strong> ({manager.email})
        </p>
      )}
    </div>
  )
}
