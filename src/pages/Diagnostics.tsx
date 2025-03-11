
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Diagnostics() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Diagnostics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Diagnostics</CardTitle>
          <CardDescription>
            Diagnostics page content will be displayed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is an empty placeholder for the Diagnostics page.</p>
        </CardContent>
      </Card>
    </div>
  );
}
