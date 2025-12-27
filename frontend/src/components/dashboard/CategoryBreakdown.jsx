import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Component to display expense breakdown by category
 * @param {Array} categories - Array of category objects with _id, totalSpent, count
 * @param {number} total - Total amount for percentage calculation
 */
const CategoryBreakdown = ({ categories = [], total = 0 }) => {
  // Category icons mapping
  const categoryIcons = {
    food: "🍔",
    transportation: "🚗",
    health: "🏥",
    education: "📚",
    entertainment: "🎬",
    shopping: "🛍️",
    utilities: "💡",
    housing: "🏠",
    salary: "💵",
    freelance: "💻",
    investment: "📈",
    other: "📦",
  };

  // Get percentage for progress bar
  // Get percentage for progress bar
  // Get percentage for progress bar
  const getPercentage = (amount) => {
    const safeTotal = Math.abs(total || 0);
    if (safeTotal === 0) return 0;
    const value = (amount || 0) / safeTotal;
    const percentage = Math.round(value * 100);
    return isNaN(percentage) ? 0 : percentage;
  };

  // Get color based on category
  const getCategoryColor = (category) => {
    const colors = {
      food: "bg-orange-500",
      transportation: "bg-blue-500",
      health: "bg-red-500",
      education: "bg-purple-500",
      entertainment: "bg-pink-500",
      shopping: "bg-yellow-500",
      utilities: "bg-cyan-500",
      housing: "bg-green-500",
      salary: "bg-emerald-500",
      freelance: "bg-indigo-500",
      investment: "bg-teal-500",
      other: "bg-gray-500",
    };
    return colors[category] || "bg-gray-500";
  };

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No expenses this month
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.category} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {categoryIcons[cat.category] || "📦"}
                </span>
                <span className="font-medium capitalize">
                  {cat.category || "Uncategorized"}
                </span>
              </div>
              <div className="text-right">
                <span className="font-semibold">
                  {(cat.total || 0).toLocaleString("en-US")} $
                </span>
                <span className="text-muted-foreground text-sm ml-2">
                  ({getPercentage(cat.total)}%)
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${getCategoryColor(
                  cat.category
                )} transition-all duration-500`}
                style={{ width: `${getPercentage(cat.total)}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdown;
