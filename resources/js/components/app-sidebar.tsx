import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupContent,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { 
    BookOpen, 
    Folder, 
    LayoutGrid, 
    FileText, 
    Info, 
    MessageSquareText, 
    Phone,             
    Shield             
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { url, props } = usePage();
    const auth = props.auth as any;
    const user = auth?.user;

    const isAdminRoute = url.startsWith('/admin');

    // --- MENU DEFINITION ---

    // Menu Umum (Bisa diakses Admin & Guest)
    const commonNavItems: NavItem[] = [
        {
            title: 'Chat Assistant', 
            href: '/', 
            icon: MessageSquareText,
        },
        {
            title: 'Info & Syarat',
            href: '/info-syarat',
            icon: Info,
        },
        {
            title: 'Dokumen',
            href: '/dokumen',
            icon: FileText,
        },
    ];

    // Menu Khusus Admin
    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutGrid,
        },
        ...commonNavItems, 
    ];

    const guestNavItems: NavItem[] = [
        ...commonNavItems
    ];

    // Pilih menu berdasarkan status login
    const currentNavItems = user ? adminNavItems : guestNavItems;

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={user ? '/admin/dashboard' : '/'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Main Navigation */}
                <NavMain items={currentNavItems} />

                {/* Kontak Admin Section (Hanya muncul jika user BELUM login / Guest) */}
                {!user && (
                    <SidebarGroup className="mt-auto group-data-[collapsible=icon]:hidden">
                        <SidebarGroupContent>
                            <div className="px-4 py-2 text-sm text-muted-foreground bg-sidebar-accent/10 rounded-md mx-2 border border-sidebar-border">
                                <div className="flex items-center gap-2 font-medium text-sidebar-foreground mb-1">
                                    <Phone className="h-4 w-4" />
                                    <span>Kontak Admin</span>
                                </div>
                                <p className="text-xs">Bu Ike (Koordinator)</p>
                                <p className="text-xs mb-1">+62 812-3456-7890</p>
                                <p className="text-xs mt-2">Email:</p>
                                <p className="text-xs">admin.kp@undip.ac.id</p>
                            </div>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                {/* Tombol Admin Access (Tersembunyi jika user sudah login) */}
                {!user && (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="Login Admin/Koordinator">
                                <Link href="/login" className="text-muted-foreground hover:text-primary">
                                    <Shield className="h-4 w-4 mr-2" />
                                    <span>Akses Koordinator</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}

                <NavFooter items={footerNavItems} />
                
                {/* Tampilkan User Info hanya jika login */}
                {user && <NavUser />}
            </SidebarFooter>
        </Sidebar>
    );
}