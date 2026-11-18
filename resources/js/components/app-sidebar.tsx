import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import AppLogo from './app-logo';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

const mainNavItems: NavItem[] = [
    { title: 'Inicio', url: '/dashboard' },
];

const adminNavItems: NavItem[] = [
    { title: 'Razas', url: '/admin/razas' },
    { title: 'Etapas', url: '/admin/etapas' },
    { title: 'Enfermedades', url: '/admin/enfermedades' },
    { title: 'Dietas', url: '/admin/dietas' },
    { title: 'Actividades', url: '/admin/actividades' },
    { title: 'Alternativas', url: '/admin/alternativas' },
    { title: 'Usuarios', url: '/admin/usuarios' },
];
const duenoNavItems: NavItem[] = [
    { title: 'Mis perros', url: '/dueno/perros' },
    { title: 'Mi horario', url: '/dueno/horario' },
    { title: 'Contactos', url: '/dueno/contactos' },
    { title: 'Alternativas en casa', url: '/dueno/alternativas' },
    { title: 'Mi agenda', url: '/dueno/agenda' },
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
                <NavMain items={duenoNavItems} label="Mi perro" />
                {esAdmin && <NavMain items={adminNavItems} label="Administración" />}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
