// src/components/layout/Sidebar.tsx
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  Users,
  Settings,
  FlaskConical,
  Wrench,
  Megaphone,
  BarChart3,
  BookOpen,
  Calendar,
  FileQuestion,
  ClipboardList,
  GraduationCap,
  ChevronLeft,
  Menu,
  LogOut,
  User,
} from 'lucide-react'
import type { RoleCode } from '@/types/auth'

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  badge?: string | number
}

const navigationItems: Record<RoleCode, NavItem[]> = {
  ADMIN: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Users, label: 'Manajemen User', href: '/admin/users' },
    { icon: Settings, label: 'Roles & Permissions', href: '/admin/roles' },
    { icon: FlaskConical, label: 'Laboratorium', href: '/admin/laboratories' },
    { icon: Wrench, label: 'Peralatan', href: '/admin/equipments' },
    { icon: Megaphone, label: 'Pengumuman', href: '/admin/announcements' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/system/analytics' },
  ],
  DOSEN: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dosen' },
    { icon: BookOpen, label: 'Mata Kuliah', href: '/dosen/mata-kuliah' },
    { icon: Calendar, label: 'Jadwal', href: '/dosen/jadwal' },
    { icon: FileQuestion, label: 'Kuis', href: '/dosen/kuis', badge: 'New' },
    { icon: ClipboardList, label: 'Peminjaman', href: '/dosen/peminjaman' },
    { icon: GraduationCap, label: 'Mahasiswa', href: '/dosen/mahasiswa' },
    { icon: BookOpen, label: 'Materi', href: '/dosen/materi' },
    { icon: BarChart3, label: 'Penilaian', href: '/dosen/penilaian' },
  ],
  MAHASISWA: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/mahasiswa' },
    { icon: Calendar, label: 'Jadwal Praktikum', href: '/mahasiswa/jadwal' },
    { icon: FileQuestion, label: 'Kuis', href: '/mahasiswa/kuis', badge: 3 },
    { icon: BookOpen, label: 'Materi', href: '/mahasiswa/materi' },
    { icon: BarChart3, label: 'Nilai', href: '/mahasiswa/nilai' },
    { icon: Megaphone, label: 'Pengumuman', href: '/mahasiswa/pengumuman' },
    { icon: User, label: 'Profil', href: '/mahasiswa/profil' },
  ],
  LABORAN: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/laboran' },
    { icon: Wrench, label: 'Inventaris', href: '/laboran/inventaris' },
    {
      icon: ClipboardList,
      label: 'Persetujuan',
      href: '/laboran/persetujuan',
      badge: 5,
    },
    {
      icon: FlaskConical,
      label: 'Laboratorium',
      href: '/laboran/laboratorium',
    },
    { icon: BarChart3, label: 'Laporan', href: '/laboran/laporan' },
  ],
}

interface SidebarProps {
  userRole: RoleCode
  userName?: string
  userEmail?: string
  onLogout?: () => void
}

export default function Sidebar({ 
  userRole, 
  userName = 'User',
  userEmail = 'user@example.com',
  onLogout 
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  
  const navItems = navigationItems[userRole] || []

  const isActive = (href: string) => {
    if (href === '/admin' || href === '/dosen' || href === '/mahasiswa' || href === '/laboran') {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }

  return (
    <aside
      className={cn(
        'relative h-screen bg-background border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <div>
            <h2 className="text-lg font-semibold">AKBID Mega Buana</h2>
            <p className="text-xs text-muted-foreground">Sistem Praktikum</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed && 'mx-auto')}
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  active && 'bg-accent text-accent-foreground',
                  collapsed && 'justify-center'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </div>
      </ScrollArea>

      {/* Footer - User Info */}
      <div className="absolute bottom-0 left-0 right-0 border-t bg-background">
        <div className={cn(
          'flex items-center gap-3 p-4',
          collapsed && 'justify-center'
        )}>
          {collapsed ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}