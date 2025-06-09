
interface PeriodButtonProps {
    periodKey: string;
    isSelected: boolean;
    onClick?: () => void;
    children: React.ReactNode;
  }
  
  export default function PeriodButton({ isSelected, onClick, children }: PeriodButtonProps) {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          isSelected
            ? 'bg-orange-500 text-white shadow-md'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {children}
      </button>
    );
  }