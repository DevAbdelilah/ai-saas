import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

const DashboardPage = () => {
  return (
    <div>
      <p>dashboard page (protected) </p>

      <UserButton />
    </div>
  );
};

export default DashboardPage;
