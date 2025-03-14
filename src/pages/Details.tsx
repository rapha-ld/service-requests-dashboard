
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Details() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Plan</h1>
      <Card>
        <CardHeader>
          <CardTitle>Plan</CardTitle>
          <CardDescription>
            Plan page content will be displayed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is an empty placeholder for the Plan page.</p>
        </CardContent>
      </Card>
    </div>
  );
}
