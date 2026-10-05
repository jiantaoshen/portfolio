"use client";

import {
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import { GripVertical, Trash2 } from "lucide-react";

import { Field } from "@/app/[locale]/(career)/dashboard/_components/field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { parseCommaList, parseLineList } from "@/lib/text";

export function SortableCard({
  group,
  index,
  onMove,
  children,
}: {
  group: string;
  index: number;
  onMove: (from: number, to: number) => void;
  children: ReactNode;
}) {
  const drop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const [sourceGroup, sourceIndex] = event.dataTransfer
      .getData("text/plain")
      .split(":");

    if (sourceGroup === group) onMove(Number(sourceIndex), index);
  };

  return (
    <Card
      className="relative bg-background"
      onDragOver={(event) => event.preventDefault()}
      onDrop={drop}
    >
      <button
        type="button"
        draggable
        title="Drag to reorder"
        aria-label="Drag to reorder"
        onDragStart={(event) => {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", `${group}:${index}`);
        }}
        className="absolute right-3 top-3 z-10 cursor-grab rounded-md p-1.5 text-muted-foreground hover:bg-foreground/5 hover:text-foreground active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>
      {children}
    </Card>
  );
}

export function ListField({
  label,
  items,
  lines,
  placeholder,
  onChange,
}: {
  label: string;
  items: string[];
  lines?: boolean;
  placeholder?: string;
  onChange: (items: string[]) => void;
}) {
  const value = items.join(lines ? "\n" : ", ");
  const [text, setText] = useState(value);
  const [editing, setEditing] = useState(false);

  const props = {
    value: editing ? text : value,
    placeholder,
    onFocus: () => {
      setText(value);
      setEditing(true);
    },
    onBlur: () => setEditing(false),
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setText(event.target.value);
      onChange((lines ? parseLineList : parseCommaList)(event.target.value));
    },
  };

  return (
    <Field label={label}>
      {lines ? <Textarea rows={4} {...props} /> : <Input {...props} />}
    </Field>
  );
}

export function DeleteButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={onClick}
    >
      <Trash2 className="mr-2 size-4" />
      {label}
    </Button>
  );
}
