import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

export function ErrorState({
  message,
}: {
  message: string;
}) {
  return (
    <Alert variant="destructive">
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  );
}