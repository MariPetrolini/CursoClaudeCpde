export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">
        testeclaude
      </h1>
      <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
        Projeto iniciado. Edite{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-sm dark:bg-zinc-800">
          app/page.tsx
        </code>{" "}
        para começar.
      </p>
    </main>
  );
}
