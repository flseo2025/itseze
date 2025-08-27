interface SVGMenuItemProps {
  id: number;
  title: string;
  onClick?: () => void;
}

const SVGMenuItem = ({ id, title, onClick }: SVGMenuItemProps) => {
  return (
    <div 
      className="w-full cursor-pointer transition-transform hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="bg-white hover:bg-gray-50 transition-colors min-h-[49px] flex items-center shadow-sm border border-gray-100 rounded-sm">
        {/* Number section */}
        <div className="w-[25px] flex-shrink-0 flex items-center justify-center text-black text-lg font-roboto select-none">
          {id}
        </div>
        
        {/* Vertical divider */}
        <div className="w-px bg-black opacity-71 self-stretch mx-0"></div>
        
        {/* Text section */}
        <div className="flex-1 px-4 py-3 flex items-center">
          <span className="text-lg font-roboto text-black select-none break-words leading-tight">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SVGMenuItem;