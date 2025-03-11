
import * as React from "react";
import { cn } from "@/lib/utils";

interface SidebarContextProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(undefined);

function useSidebarContext() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

function SidebarProvider({
  children,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
}

function Sidebar({
  children,
  className,
  collapsed: collapsedProp,
  defaultCollapsed = false,
}: SidebarProps) {
  const [collapsedState, setCollapsedState] = React.useState(defaultCollapsed);
  const collapsed = collapsedProp !== undefined ? collapsedProp : collapsedState;

  return (
    <aside
      className={cn(
        "flex flex-col shrink-0 transition-[width] duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      {children}
    </aside>
  );
}

function SidebarTrigger({ className }: { className?: string }) {
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <button
      className={cn("flex items-center justify-center p-2", className)}
      onClick={() => setCollapsed(!collapsed)}
    >
      {collapsed ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
          />
        </svg>
      )}
    </button>
  );
}

function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-y-auto", className)} {...props} />;
}

function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />;
}

function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 mt-auto", className)} {...props} />;
}

function SidebarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pb-4", className)} {...props} />;
}

function SidebarGroupLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { collapsed } = useSidebarContext();

  if (collapsed) {
    return null;
  }

  return (
    <div
      className={cn("px-4 py-2 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

function SidebarGroupContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1", className)} {...props} />;
}

function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("space-y-1", className)} {...props} />;
}

function SidebarMenuItem({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("", className)} {...props} />;
}

function SidebarMenuButton({
  className,
  asChild = false,
  ...props
}: {
  className?: string;
  asChild?: boolean;
} & (asChild extends true ? React.HTMLAttributes<HTMLElement> : React.ButtonHTMLAttributes<HTMLButtonElement>)) {
  const { collapsed } = useSidebarContext();
  const Comp = asChild ? React.Fragment : "button";

  return (
    <Comp
      className={cn(
        "flex items-center w-full px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
        collapsed && "justify-center px-2",
        className
      )}
      {...props}
    />
  );
}

export {
  SidebarProvider,
  useSidebarContext,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
};
