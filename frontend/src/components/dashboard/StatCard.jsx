import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Reusable statistics card component
 * @param {string} title - Card title
 * @param {string|number} value - Main value to display
 * @param {string} icon - Emoji or icon to display
 * @param {string} className - Additional CSS classes
 * @param {string} trend - Optional trend indicator (e.g., "+12%")
 * @param {string} trendColor - Color of trend (green/red)
 */
const StatCard = ({
  title,
  value,
  icon,
  className = "",
  trend,
  trendColor = "text-emerald-500",
}) => {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <span className="text-2xl">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && <p className={`text-xs ${trendColor} mt-1`}>{trend}</p>}
      </CardContent>
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
    </Card>
  );
};

export default StatCard;
