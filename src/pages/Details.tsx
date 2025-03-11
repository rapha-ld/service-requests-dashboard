
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Details() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Billing</h1>
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>
            Billing page content will be displayed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is an empty placeholder for the Billing page.</p>
        </CardContent>
      </Card>
    </div>
  );
}
