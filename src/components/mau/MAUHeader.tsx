
interface MAUHeaderProps {
  title: string;
}

export const MAUHeader = ({ title }: MAUHeaderProps) => {
  return (
    <h1 className="text-2xl font-semibold text-foreground mb-6 text-left pl-0">{title}</h1>
  );
};
