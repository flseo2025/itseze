interface MenuListProps {
    items: Array<{
        id: number;
        title: string;
        subtitle?: string;
        hasDropdown?: boolean;
        subItems?: Array<{
            id: number;
            title: string;
        }>;
    }>;
    onItemClick?: (item: any) => void;
}
declare const MenuList: ({ items, onItemClick }: MenuListProps) => any;
export default MenuList;
//# sourceMappingURL=MenuList.d.ts.map