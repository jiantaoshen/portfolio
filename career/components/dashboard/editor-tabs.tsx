import {
  Eye,
  PencilLine,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";


export type EditorTab =
  | "edit"
  | "preview";


export function EditorTabs({
  value,
  onChange,
}: {
  value: EditorTab;
  onChange: (
    tab: EditorTab,
  ) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-background p-1">
      <Button
        type="button"
        size="sm"
        variant={
          value === "edit"
            ? "default"
            : "ghost"
        }
        onClick={() =>
          onChange("edit")
        }
      >
        <PencilLine className="mr-2 size-4" />

        Edit
      </Button>

      <Button
        type="button"
        size="sm"
        variant={
          value === "preview"
            ? "default"
            : "ghost"
        }
        onClick={() =>
          onChange(
            "preview",
          )
        }
      >
        <Eye className="mr-2 size-4" />

        Preview
      </Button>
    </div>
  );
}