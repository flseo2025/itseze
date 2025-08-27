"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const SVGMenuItem_1 = tslib_1.__importDefault(require("./SVGMenuItem"));
const MenuList = ({ items, onItemClick }) => {
    return (<div className="space-y-0.5">
      {items.map((item) => (<div key={item.id}>
          <SVGMenuItem_1.default id={item.id} title={item.title} onClick={() => onItemClick?.(item)}/>
          
          {item.subItems && (<div className="ml-12 pb-2 space-y-1 mt-2">
              {item.subItems.map((subItem) => (<button key={subItem.id} onClick={() => onItemClick?.(subItem)} className="w-full flex items-center space-x-3 p-2 text-left hover:bg-gray-50 transition-colors rounded">
                  <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    {subItem.id}
                  </span>
                  <span className="text-sm text-gray-700">{subItem.title}</span>
                </button>))}
            </div>)}
        </div>))}
    </div>);
};
exports.default = MenuList;
//# sourceMappingURL=MenuList.js.map