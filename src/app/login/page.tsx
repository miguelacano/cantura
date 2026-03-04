import { loginAction } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <form
        action={(data) => {
          loginAction(data);
        }}
        className="w-full max-w-sm space-y-4 rounded-xl bg-white p-8 shadow"
      >
        <h1 className="font-serif text-xl font-semibold text-stone-900">
          Sign in to Cantura
        </h1>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-stone-700">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-stone-700">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
