import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import AppLogo from './app-logo';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

const mainNavItems: NavItem[] = [
    { title: 'Inicio', url: '/dashboard'},
];

const adminNavItems: NavItem[] = [
    { title: 'Razas', url: '/admin/razas' },
    { title: 'Etapas', url: '/admin/etapas' },
    { title: 'Enfermedades', url: '/admin/enfermedades' },
    { title: 'Dietas', url: '/admin/dietas' },
    { title: 'Actividades', url: '/admin/actividades' },
    { title: 'Alternativas', url: '/admin/alternativas'},
    { title: 'Usuarios', url: '/admin/usuarios' },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const esAdmin = auth.user.rol === 'admin';

    return (
        <Sidebar variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {esAdmin && <NavMain items={adminNavItems} label="Administración" />}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
