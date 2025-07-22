// Dashboard components with API integration
import OverviewCards from "@/components/dashboard/OverviewCards"; // Client Component with real API data

import FinancialTransactions from "@/components/dashboard/FinancialTransactions";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ActivitySections from "@/components/dashboard/ActivitySections";
import TasksAndOrders from "@/components/dashboard/TasksAndOrders";
import { ComingSoonOverlay } from "@/components/ui";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Dashboard Header */}

      {/* Overview Cards */}
      <OverviewCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 relative">
          <RevenueChart />
          <ComingSoonOverlay visible={true} />
        </div>
        {/* Financial Transactions */}
        <div className="lg:col-span-1">
          <FinancialTransactions />
        </div>
      </div>

      {/* Activity Sections */}

      <ActivitySections />

    
        {/* Tasks and Recent Orders */}
        <TasksAndOrders />
    </div>
  );
}
