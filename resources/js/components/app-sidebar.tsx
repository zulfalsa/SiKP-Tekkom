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
    LayoutGrid, 
    FileText, 
    Info, 
    MessageSquareText, 
    Phone, 
    Shield 
} from 'lucide-react';
import AppLogo from './app-logo';

// Tipe CSS Kustom untuk Styling Ungu Sidebar
type CustomCSSProperties = React.CSSProperties & {
    '--sidebar-background'?: string;
    '--sidebar-foreground'?: string;
    '--sidebar-accent'?: string;
    '--sidebar-border'?: string;
};

export function AppSidebar() {
    const { props } = usePage();
    // Mendapatkan user dari props (hati-hati dengan type assertion di production)
    const user = (props.auth as any)?.user; 

    // --- 1. DEFINISI MENU ---

    const commonNavItems: NavItem[] = [
        { title: 'Chat Assistant', href: '/', icon: MessageSquareText },
        { title: 'Info & Syarat KP', href: '/info-syarat', icon: Info },
        { title: 'Dokumen', href: '/dokumen', icon: FileText },
    ];

    const adminNavItems: NavItem[] = [
        { title: 'Dashboard Koordinator', href: '/admin/dashboard', icon: LayoutGrid },
        ...commonNavItems, 
    ];

    // Tentukan menu yang aktif (Admin atau Umum)
    const currentNavItems = user ? adminNavItems : commonNavItems;
    const footerNavItems: NavItem[] = []; // Biarkan kosong jika tidak digunakan

    // --- 2. STYLE UNGU KUSTOM ---

    const customStyle: CustomCSSProperties = {
        '--sidebar-background': '#1a0d33', // Deep Violet
        '--sidebar-foreground': '#f3e8ff', // Light Violet Text
        '--sidebar-accent': '#a78bfa',
        '--sidebar-border': '#3730a3',
    };

    const dashboardLink = user ? '/admin/dashboard' : '/';

    return (
        <Sidebar 
            collapsible="icon" 
            variant="inset"
            // Styling Sidebar Utama: Deep Violet, Shadow Halus
            className="dark:bg-violet-950 dark:text-violet-100 dark:border-violet-900 shadow-xl shadow-violet-900/30"
            style={customStyle}
        >
            {/* --- HEADER (Logo/Judul) --- */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardLink} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* --- KONTEN UTAMA (Navigasi) --- */}
            <SidebarContent>
                <NavMain items={currentNavItems} />

                {/* Kontak Darurat (Hanya untuk Guest/Mahasiswa) */}
                {!user && (
                    <SidebarGroup className="mt-auto group-data-[collapsible=icon]:hidden">
                        <SidebarGroupContent>
                            <div className="px-4 py-3 text-sm text-black bg-violet-700 rounded-lg mx-2 border border-violet-800 shadow-inner shadow-violet-900/20">
                                <div className="flex items-center gap-2 font-semibold text-white mb-1">
                                    <Phone className="h-4 w-4 text-white-300" />
                                    <span>Kontak Koordinator</span>
                                </div>
                                <p className="text-xs text-white">Bu Ike (Koordinator KP)</p>
                                {/* Menggunakan p tag tunggal untuk nomor telepon & email agar lebih rapi */}
                                <p className="text-xs mb-1 font-mono text-white font-bold tracking-wider">
                                    +62 812-3456-7890
                                </p>
                                <p className="text-xs mt-2 text-white">Email Administrasi:</p>
                                <p className="text-xs font-mono text-white">
                                    admin.kp@undip.ac.id
                                </p>
                            </div>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>

            {/* --- FOOTER (Login/User Info) --- */}
            <SidebarFooter>
                {/* Tombol Login Admin (Hanya muncul jika BELUM login) */}
                {!user && (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                asChild 
                                tooltip="Login Admin/Koordinator"
                                // Styling Tombol Solid Ungu yang Konsisten
                                className="bg-violet-600  text-black font-semibold py-2 transition-colors duration-200 rounded-lg shadow-md shadow-violet-500/30" 
                            >
                                <Link href="/login" className="flex items-center w-full justify-center">
                                    <Shield className="h-4 w-4 mr-2" />
                                    <span>Akses Koordinator</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}

                <NavFooter items={footerNavItems} />
                
                {/* User Info (Hanya muncul jika SUDAH login) */}
                {user && <NavUser />}
            </SidebarFooter>
        </Sidebar>
    );
}