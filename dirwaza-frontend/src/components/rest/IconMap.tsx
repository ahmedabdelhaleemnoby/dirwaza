import { 
  BedDouble, 
  Bath, 
  Flame, 
  CookingPot, 
  Users, 
  Dumbbell,
  Waves,
  Car,
  Wifi,
  Coffee,
  Music,
  Shield,
  Home,
  LucideProps
} from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

// Type for Lucide icons
type LucideIcon = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

// Icon mapping from string names to Lucide components
export const iconMap: Record<string, LucideIcon> = {
  BedDouble,
  Bath,
  Flame,
  CookingPot,
  Users,
  Dumbbell,
  Waves,
  Car,
  Wifi,
  Coffee,
  Music,
  Shield,
  Home,
  // Add aliases for common variations
  'bed': BedDouble,
  'bathroom': Bath,
  'Pool': Waves, // Map Pool to Waves icon
  'pool': Waves,
  'fire': Flame,
  'cooking': CookingPot,
  'people': Users,
  'gym': Dumbbell,
  'water': Waves,
  'parking': Car,
  'wifi': Wifi,
  'coffee': Coffee,
  'music': Music,
  'security': Shield,
  'house': Home,
};

// Helper function to get icon component by name
export const getIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Home; // Default to Home icon if not found
};

// Component to render icon from string name
interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  name: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = getIcon(name);
  return <IconComponent {...props} />;
};

export default DynamicIcon; 