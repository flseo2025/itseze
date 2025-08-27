"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const SlideOutMenu_1 = tslib_1.__importDefault(require("./SlideOutMenu"));
const button_1 = require("@/components/ui/button");
const AppHeader = ({ currentScreen, onNavigate }) => {
    return (<header className="px-4 md:px-6 lg:px-8 py-3 text-white" style={{ background: 'linear-gradient(135deg, #68C72A 0%, #029100 100%)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-start">
          <SlideOutMenu_1.default onNavigate={onNavigate}>
            <button className="mt-1 mr-2 hover:opacity-80 transition-opacity cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="26.395" height="16.919" viewBox="0 0 26.395 16.919">
                <g id="Menu" transform="translate(0.5 0.499)">
                  <g id="Group_3" data-name="Group 3" transform="translate(0 7.209)">
                    <g id="Group_2" data-name="Group 2">
                      <path id="Path_1" data-name="Path 1" d="M166.416,493.152h15.642c.722,0,1.444.018,2.163,0h.029a.733.733,0,1,0,0-1.466H168.608c-.722,0-1.444-.018-2.163,0h-.029a.733.733,0,1,0,0,1.466Z" transform="translate(-165.682 -491.678)" fill="#fff" stroke="#fff" stroke-width="1"/>
                    </g>
                  </g>
                  <g id="Group_8" data-name="Group 8" transform="translate(0 0)">
                    <g id="Group_5" data-name="Group 5">
                      <g id="Group_4" data-name="Group 4">
                        <path id="Path_2" data-name="Path 2" d="M166.416,296.509H187.41c.964,0,1.928.022,2.892,0h.04a.733.733,0,1,0,0-1.466H169.349c-.964,0-1.928-.022-2.892,0h-.04a.733.733,0,1,0,0,1.466Z" transform="translate(-165.682 -295.033)" fill="#fff" stroke="#fff" stroke-width="1"/>
                      </g>
                    </g>
                    <g id="Group_7" data-name="Group 7" transform="translate(0 14.453)">
                      <g id="Group_6" data-name="Group 6">
                        <path id="Path_3" data-name="Path 3" d="M166.416,690.766h9.916a.733.733,0,1,0,0-1.466h-9.916a.74.74,0,0,0-.733.733.748.748,0,0,0,.733.733Z" transform="translate(-165.682 -689.3)" fill="#fff" stroke="#fff" stroke-width="1"/>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </button>
          </SlideOutMenu_1.default>
          <div className="flex flex-col items-center text-center">
            <div className="font-roboto font-bold italic text-white mb-1 text-2xl md:text-3xl lg:text-4xl">
              ItsEZE<span className="text-xs md:text-sm align-top ml-1">™</span>
            </div>
            <div className="font-roboto font-bold italic text-white text-sm md:text-base lg:text-lg">
              Your Business Startup App
            </div>
            <div className="font-roboto font-light italic text-white text-xs md:text-sm">
              By Fast Forward App ®
            </div>
            <div className="font-roboto font-light italic text-white text-xs md:text-sm">
              V 1.0.0
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-1 md:gap-2">
          <button_1.Button size="sm" className={`bg-white hover:bg-gray-50 font-roboto text-sm md:text-base font-bold px-2 md:px-3 py-1 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 border-2 ${currentScreen === 'main' ? '' : 'opacity-50'}`} style={{ color: '#015D00', borderColor: '#015D00' }} onClick={() => onNavigate('main')}>
            GO
          </button_1.Button>
          <button_1.Button size="sm" className={`bg-white hover:bg-gray-50 font-roboto text-sm md:text-base font-bold px-2 md:px-3 py-1 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 border ${currentScreen === 'add' ? 'border-2' : 'opacity-50'}`} style={{ color: '#015D00', borderColor: '#015D00' }} onClick={() => onNavigate('add')}>
            ADD
          </button_1.Button>
          <button_1.Button size="sm" className={`bg-white hover:bg-gray-50 font-roboto text-sm md:text-base font-bold px-2 md:px-3 py-1 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 border ${currentScreen === 'grow' ? 'border-2' : 'opacity-50'}`} style={{ color: '#015D00', borderColor: '#015D00' }} onClick={() => onNavigate('grow')}>
            GROW
          </button_1.Button>
          <button_1.Button size="sm" className={`bg-white hover:bg-gray-50 font-roboto text-sm md:text-base font-bold px-2 md:px-3 py-1 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 border ${currentScreen === 'how' ? 'border-2' : 'opacity-50'}`} style={{ color: '#015D00', borderColor: '#015D00' }} onClick={() => onNavigate('how')}>
            HOW
          </button_1.Button>
        </div>
      </div>
    </header>);
};
exports.default = AppHeader;
//# sourceMappingURL=AppHeader.js.map