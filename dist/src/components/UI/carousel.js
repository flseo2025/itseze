"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarouselNext = exports.CarouselPrevious = exports.CarouselItem = exports.CarouselContent = exports.Carousel = void 0;
const tslib_1 = require("tslib");
const embla_carousel_react_1 = tslib_1.__importDefault(require("embla-carousel-react"));
const lucide_react_1 = require("lucide-react");
const React = tslib_1.__importStar(require("react"));
const button_1 = require("@/components/ui/button");
const utils_1 = require("@/lib/utils");
const CarouselContext = React.createContext(null);
function useCarousel() {
    const context = React.useContext(CarouselContext);
    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />");
    }
    return context;
}
const Carousel = React.forwardRef(({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = (0, embla_carousel_react_1.default)({
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
    }, plugins);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const onSelect = React.useCallback((api) => {
        if (!api) {
            return;
        }
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
    }, []);
    const scrollPrev = React.useCallback(() => {
        api?.scrollPrev();
    }, [api]);
    const scrollNext = React.useCallback(() => {
        api?.scrollNext();
    }, [api]);
    const handleKeyDown = React.useCallback((event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollPrev();
        }
        else if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollNext();
        }
    }, [scrollPrev, scrollNext]);
    React.useEffect(() => {
        if (!api || !setApi) {
            return;
        }
        setApi(api);
    }, [api, setApi]);
    React.useEffect(() => {
        if (!api) {
            return;
        }
        onSelect(api);
        api.on("reInit", onSelect);
        api.on("select", onSelect);
        return () => {
            api?.off("select", onSelect);
        };
    }, [api, onSelect]);
    return (<CarouselContext.Provider value={{
            carouselRef,
            api,
            opts,
            orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
            scrollPrev,
            scrollNext,
            canScrollPrev,
            canScrollNext,
        }}>
        <div ref={ref} onKeyDownCapture={handleKeyDown} className={(0, utils_1.cn)("relative", className)} role="region" aria-roledescription="carousel" {...props}>
          {children}
        </div>
      </CarouselContext.Provider>);
});
exports.Carousel = Carousel;
Carousel.displayName = "Carousel";
const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();
    return (<div ref={carouselRef} className="overflow-hidden">
      <div ref={ref} className={(0, utils_1.cn)("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)} {...props}/>
    </div>);
});
exports.CarouselContent = CarouselContent;
CarouselContent.displayName = "CarouselContent";
const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
    const { orientation } = useCarousel();
    return (<div ref={ref} role="group" aria-roledescription="slide" className={(0, utils_1.cn)("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)} {...props}/>);
});
exports.CarouselItem = CarouselItem;
CarouselItem.displayName = "CarouselItem";
const CarouselPrevious = React.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();
    return (<button_1.Button ref={ref} variant={variant} size={size} className={(0, utils_1.cn)("absolute  h-8 w-8 rounded-full", orientation === "horizontal"
            ? "-left-12 top-1/2 -translate-y-1/2"
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90", className)} disabled={!canScrollPrev} onClick={scrollPrev} {...props}>
      <lucide_react_1.ArrowLeft className="h-4 w-4"/>
      <span className="sr-only">Previous slide</span>
    </button_1.Button>);
});
exports.CarouselPrevious = CarouselPrevious;
CarouselPrevious.displayName = "CarouselPrevious";
const CarouselNext = React.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();
    return (<button_1.Button ref={ref} variant={variant} size={size} className={(0, utils_1.cn)("absolute h-8 w-8 rounded-full", orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90", className)} disabled={!canScrollNext} onClick={scrollNext} {...props}>
      <lucide_react_1.ArrowRight className="h-4 w-4"/>
      <span className="sr-only">Next slide</span>
    </button_1.Button>);
});
exports.CarouselNext = CarouselNext;
CarouselNext.displayName = "CarouselNext";
//# sourceMappingURL=carousel.js.map