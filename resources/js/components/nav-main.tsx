import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const currentUrl = page.url;

    return (
        <SidebarGroup className="px-2 py-0">

            
            <SidebarMenu>
                {items.map((item) => {
                    const resolved = resolveUrl(item.href);
                    const isActive =
                        resolved === '/'
                            ? currentUrl === '/'
                            : currentUrl.startsWith(resolved);

                    const activeClasses = 

                        'bg-violet-600 text-white font-bold rounded-lg shadow-sm shadow-violet-500/30'; 
                        
                    const inactiveClasses = 

                        'text-black hover:bg-violet-200 transition-colors duration-200 rounded-lg';
                    
                    const itemClasses = isActive ? activeClasses : inactiveClasses;

                    return (

                        <SidebarMenuItem key={item.title} className="py-[1px]">
                            <SidebarMenuButton
                                asChild
                                isActive={isActive} 
                                className={itemClasses} 
                                tooltip={{ children: item.title }}
                            >
                                <Link 
                                    href={item.href} 
                                    prefetch 
                                    className="flex items-center w-full justify-start space-x-3 p-3" // Menyesuaikan padding internal Link
                                >

                                    {item.icon && <item.icon className="h-4 w-4 mr-2" />} 
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}