import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TechListProps {
  items: string[];
  className?: string;
}

export function TechList({ items, className }: TechListProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <Badge
          key={item}
          variant="outline"
          size="tech"
          className="text-muted-foreground"
        >
          {item}
        </Badge>
      ))}
    </div>
  );
}
