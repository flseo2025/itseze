import { type VariantProps } from "class-variance-authority";
import * as React from "react";
declare const buttonVariants: any;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
declare const Button: any;
export { Button, buttonVariants };
//# sourceMappingURL=button.d.ts.map