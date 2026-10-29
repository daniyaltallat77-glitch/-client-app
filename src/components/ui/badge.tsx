import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium transition-colors",
        className
      )}
      {...props}
    />
  );
}
export { Badge };
