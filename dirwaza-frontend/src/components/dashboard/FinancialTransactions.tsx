import {
  CreditCard as CreditCardIcon,
  Smartphone as DevicePhoneMobileIcon,
  Receipt as ReceiptPercentIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import PeriodButton from "./PeriodButton";

interface TransactionCardProps {
  type: string;
  amount: number;
  time: string;
  transactionNumber: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

function TransactionCard({
  type,
  amount,
  time,
  transactionNumber,
  icon: Icon,
}: TransactionCardProps) {
  return (
    <div className="bg-[#D7F9FF] rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center bg-[#D3DE76]`}
          >
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{type}</h3>
            <p className="text-xs text-gray-500">{transactionNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900">{amount} SAR</p>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
      </div>
    </div>
  );
}

export default function FinancialTransactions() {
  const t = useTranslations("Dashboard");

  const transactions = [
    {
      type: t("financialTransactions.creditCard"),
      amount: 850,
      time: "10:30",
      transactionNumber: "12345#",
      icon: CreditCardIcon,
      iconBgColor: "bg-yellow-500",
    },
    {
      type: t("financialTransactions.applePay"),
      amount: 420,
      time: "10:30",
      transactionNumber: "12346#",
      icon: DevicePhoneMobileIcon,
      iconBgColor: "bg-gray-800",
    },
    {
      type: t("financialTransactions.offers"),
      amount: 650,
      time: "10:30",
      transactionNumber: "12347#",
      icon: ReceiptPercentIcon,
      iconBgColor: "bg-yellow-500",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {t("financialTransactions.title")}
        </h2>
        <div className="flex space-x-2">
          <PeriodButton periodKey="today" isSelected={true}>
            {t("financialTransactions.today")}
          </PeriodButton>
          <PeriodButton periodKey="week" isSelected={false}>
            {t("financialTransactions.week")}
          </PeriodButton>
        </div>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <TransactionCard key={index} {...transaction} />
        ))}
      </div>
    </div>
  );
}
