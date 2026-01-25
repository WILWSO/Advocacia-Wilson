import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

interface DropdownItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface DropdownMenuProps {
  label: string
  items: DropdownItem[]
  isScrolled?: boolean
  className?: string
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  label, 
  items, 
  isScrolled = false,
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Smooth scroll a sección
  const handleItemClick = (href: string) => {
    setIsOpen(false)
    
    // Si es un hash (sección en la misma página)
    if (href.startsWith('#')) {
      const isHome = location.pathname === '/'
      
      if (!isHome) {
        // Si no estamos en Home, navegar a Home con el hash
        navigate('/' + href)
      } else {
        // Si ya estamos en Home, hacer scroll suave
        const element = document.querySelector(href)
        if (element) {
          const headerOffset = 80
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }
    }
  }

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 px-2 py-2 text-sm font-medium transition-colors duration-300",
          isScrolled ? "text-primary-800 hover:text-primary-600" : "text-white hover:text-gold-400"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown 
          size={16} 
          className={cn(
            "transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={(e) => {
                if (item.href.startsWith('#')) {
                  e.preventDefault()
                  handleItemClick(item.href)
                }
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
            >
              {item.icon && (
                <span className="text-primary-600 flex-shrink-0">
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
