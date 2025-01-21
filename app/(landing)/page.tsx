import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div>
      landing page (Inprotected)
      <div>
        <Link href="/sign-in">
          <Button>Login</Button>
        </Link>
        <Link href="/sign-up">
          <Button>Registre</Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
