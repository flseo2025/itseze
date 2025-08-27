import { ChevronUp } from "lucide-react";

interface BottomNavigationProps {
  onNavigate?: (screen: string) => void;
  isActive?: boolean;
}

const BottomNavigation = ({ onNavigate, isActive = true }: BottomNavigationProps) => {
  const navItems = [
    { letter: 'X', screen: 'main' },
    { letter: 'P', screen: 'profile' },
    { letter: 'H', screen: 'main' },
    { letter: 'N', screen: 'newContact' },
    { letter: 'M', screen: 'contactMessages' },
    { letter: 'D', screen: 'contactRegistration' },
    { letter: 'B', screen: 'main' },
    { letter: 'F', screen: 'main' },
    { letter: 'C', screen: 'main', hasArrow: true }
  ];
  
  // isActive is now passed as prop
  
  return (
    <div className={isActive ? '' : 'bg-[#DEDEDE]'} style={isActive ? { background: 'linear-gradient(135deg, #68C72A 0%, #029100 100%)' } : {}}>
      <div className="flex items-center h-12 md:h-14 lg:h-16">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => isActive && onNavigate?.(item.screen)}
            className={`flex-1 h-full flex items-center justify-center font-bold text-lg md:text-xl lg:text-2xl border-r last:border-r-0 transition-colors relative ${
              isActive 
                ? 'text-white border-white/20 hover:bg-white/20' 
                : 'text-[#2b2b2b] border-[#2b2b2b]/20 cursor-not-allowed'
            }`}
            disabled={!isActive}
          >
            <span>{item.letter}</span>
            {item.hasArrow && (
              <ChevronUp 
                size={12} 
                className={`absolute top-1 right-1 ${isActive ? 'text-white' : 'text-[#2b2b2b]'}`}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;