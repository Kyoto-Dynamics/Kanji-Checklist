"use client";

import { useActionState } from "react";
import { deleteAccount } from "@/app/settings/actions";

export function DeleteAccountForm() {
  const [state, formAction, pending] = useActionState(deleteAccount, null);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label htmlFor="confirm" className="text-sm font-medium">
        Type <strong>DELETE</strong> to confirm
      </label>
      <input
        id="confirm"
        name="confirm"
        autoComplete="off"
        required
        className="w-full max-w-xs rounded-lg border border-zinc-400 px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-lg bg-red-700 px-4 py-2 font-medium text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-60"
      >
        {pending ? "Deleting…" : "Delete my account"}
      </button>
      {state?.error && (
        <p role="alert" className="text-sm text-red-800">
          {state.error}
        </p>
      )}
    </form>
  );
}
