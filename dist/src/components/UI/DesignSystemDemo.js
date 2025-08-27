"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const SVGMenuItem_1 = tslib_1.__importDefault(require("./SVGMenuItem"));
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const DesignSystemDemo = () => {
    const colorTokens = [
        { name: 'app-green', class: 'bg-app-green', description: 'Primary brand color' },
        { name: 'app-green-dark', class: 'bg-app-green-dark', description: 'Hover states' },
        { name: 'app-green-light', class: 'bg-app-green-light', description: 'Light accents' },
        { name: 'app-background', class: 'bg-app-background', description: 'Page background' },
        { name: 'form-background', class: 'bg-form-background', description: 'Form containers' },
    ];
    const menuItems = [
        { id: 1, title: "Standard Menu Item" },
        { id: 2, title: "Another Menu Item" },
        { id: 3, title: "Third Menu Item Example" },
    ];
    return (<div className="p-6 space-y-8 bg-app-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">ItsEZE Design System Demo</h1>
        
        
        <card_1.Card className="mb-8">
          <card_1.CardHeader>
            <card_1.CardTitle>Brand Colors</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {colorTokens.map((color) => (<div key={color.name} className="space-y-2">
                  <div className={`${color.class} h-16 rounded border border-gray-200`}></div>
                  <div>
                    <p className="font-medium text-sm">{color.name}</p>
                    <p className="text-xs text-gray-600">{color.description}</p>
                  </div>
                </div>))}
            </div>
          </card_1.CardContent>
        </card_1.Card>

        
        <card_1.Card className="mb-8">
          <card_1.CardHeader>
            <card_1.CardTitle>Brand Gradients</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="space-y-4">
              <div>
                <div className="bg-brand-gradient h-16 rounded mb-2"></div>
                <p className="font-medium text-sm">bg-brand-gradient</p>
                <p className="text-xs text-gray-600">Primary brand gradient</p>
              </div>
              <div>
                <div className="bg-header-gradient h-16 rounded mb-2"></div>
                <p className="font-medium text-sm">bg-header-gradient</p>
                <p className="text-xs text-gray-600">Header gradient pattern</p>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        
        <card_1.Card className="mb-8">
          <card_1.CardHeader>
            <card_1.CardTitle>Button Patterns</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="flex flex-wrap gap-4">
              <button_1.Button className="btn-brand">Primary Button</button_1.Button>
              <button_1.Button className="btn-brand-outline">Outline Button</button_1.Button>
              <button_1.Button variant="secondary">Secondary Button</button_1.Button>
              <button_1.Button variant="outline">Default Outline</button_1.Button>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        
        <card_1.Card className="mb-8">
          <card_1.CardHeader>
            <card_1.CardTitle>Menu Item Pattern</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="space-y-0.5">
              {menuItems.map((item) => (<SVGMenuItem_1.default key={item.id} id={item.id} title={item.title}/>))}
            </div>
          </card_1.CardContent>
        </card_1.Card>

        
        <card_1.Card className="mb-8">
          <card_1.CardHeader>
            <card_1.CardTitle>Header Pattern</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="bg-header-gradient text-white p-4 rounded">
              <h2 className="text-white font-bold text-lg">SAMPLE HEADER</h2>
              <p className="text-white/90">Header description text</p>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        
        <card_1.Card className="mb-8">
          <card_1.CardHeader>
            <card_1.CardTitle>Responsive Heights</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="space-y-4">
              <div className="bg-app-green h-responsive-nav rounded flex items-center justify-center text-white font-medium">
                Responsive Navigation Height
              </div>
              <p className="text-sm text-gray-600">
                This element scales: h-12 on mobile → h-14 on tablet → h-16 on desktop
              </p>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle>Usage Guidelines</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-green-700">✅ DO</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Use semantic color tokens (bg-app-green, text-app-green)</li>
                  <li>Apply edge-to-edge layout for interactive components</li>
                  <li>Use consistent spacing patterns (space-y-0.5 for menus)</li>
                  <li>Follow responsive height scaling for navigation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-700">❌ DON'T</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Use hardcoded colors (bg-green-500, text-white)</li>
                  <li>Add padding to full-width interactive components</li>
                  <li>Mix different spacing patterns within sections</li>
                  <li>Use arbitrary height values for navigation elements</li>
                </ul>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>
    </div>);
};
exports.default = DesignSystemDemo;
//# sourceMappingURL=DesignSystemDemo.js.map