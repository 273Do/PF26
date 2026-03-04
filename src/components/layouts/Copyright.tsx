import { COPYRIGHT_THIS_YEAR } from "@/consts";

const Copyright = () => {
  return (
    <p className="font-mono text-sm text-muted-foreground">
      ©2023-{COPYRIGHT_THIS_YEAR} 273DoWorks
    </p>
  );
};

export default Copyright;
