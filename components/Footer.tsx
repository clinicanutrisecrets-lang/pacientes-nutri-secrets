export function Footer() {
  return (
    <footer className="border-t border-border pt-6 mt-8 text-xs text-neutral-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div>
        Quotes from free sources are delayed 15–20 minutes. Not investment advice.
      </div>
      <div className="font-mono">
        Data: Yahoo Finance · Built with Next.js
      </div>
    </footer>
  );
}
