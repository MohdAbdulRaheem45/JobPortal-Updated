import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "../components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <Compass size={40} className="text-muted" />
      <h1 className="font-display text-3xl font-semibold">Lost in orbit</h1>
      <p className="max-w-sm text-sm text-muted">
        This page doesn't exist. Let's get you back on course.
      </p>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
