import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  title: React.ReactNode;
  description?: string;
  body?: any;
  children?: any;
  footer?: any;
  className?: string;
}

const BasicCard = ({ title, description, children, footer, className = "p-4" }: Props) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>{footer}</CardFooter>
    </Card>
  );
};

export default BasicCard;
