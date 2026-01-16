import { ReactNode, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { FiChevronDown, FiChevronUp, FiMoreVertical } from 'react-icons/fi'
import ChangePasswordModal from './ChangePasswordModal'
import { MENU_ITEMS } from '../../config/constants'
import { useNavigationLoading } from '../../hooks/useNavigationLoading'
import { useLayoutStore } from '../../store/layoutStore'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const {
    expandedMenus,
    showUserMenu,
    showChangePasswordModal,
    toggleMenu,
    setShowUserMenu,
    setShowChangePasswordModal,
  } = useLayoutStore()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const isNavigating = useNavigationLoading()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleChangePassword = () => {
    setShowUserMenu(false)
    setShowChangePasswordModal(true)
  }

  const handleLogoutClick = () => {
    setShowUserMenu(false)
    handleLogout()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {isNavigating && <div className="page-loading-bar" />}
      <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">NurtureWave</h1>
        </div>

        <nav className="sidebar-nav">
          {MENU_ITEMS.map((item) => {
            if (item.submenu) {
              const isExpanded = expandedMenus[item.path.replace('#', '')]
              return (
                <div key={item.path}>
                  <button
                    onClick={() => toggleMenu(item.path.replace('#', ''))}
                    className="nav-item nav-parent"
                  >
                    <item.icon className="nav-icon" />
                    <span>{item.label}</span>
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  {isExpanded && (
                    <div className="submenu">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`nav-item nav-subitem ${
                            location.pathname === subItem.path ? 'active' : ''
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <item.icon className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="sidebar-footer" ref={userMenuRef}>
          <div className="user-info">
            <div className="avatar">
              {user?.firstName?.charAt(0) || user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.fullName || 'Super Admin'}</div>
            </div>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)} 
              className="logout-btn-icon" 
              title="Menu"
            >
              <FiMoreVertical />
            </button>
          </div>
          
          {showUserMenu && (
            <div className="user-menu-dropdown">
              <button onClick={handleChangePassword} className="user-menu-item">
                Change Password
              </button>
              <button onClick={handleLogoutClick} className="user-menu-item logout">
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>

      <ChangePasswordModal 
        isOpen={showChangePasswordModal} 
        onClose={() => setShowChangePasswordModal(false)} 
      />
      </div>
    </>
  )
}
