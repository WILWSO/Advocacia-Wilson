/**
 * Tests para BaseButton - Sistema de botões SSoT
 * 
 * Testa funcionalidades críticas:
 * - Renderização de variantes
 * - Estados (loading, disabled)
 * - Acessibilidade
 * - Comportamentos de clique
 */

import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BaseButton, IconButton, ActionButton } from '../BaseButtons'

describe('BaseButton', () => {
  describe('Renderização básica', () => {
    it('deve renderizar texto corretamente', () => {
      render(<BaseButton>Test Button</BaseButton>)
      
      expect(screen.getByText('Test Button')).toBeInTheDocument()
    })

    it('deve aplicar className customizado', () => {
      render(<BaseButton className="custom-class">Test</BaseButton>)
      
      const button = screen.getByText('Test')
      expect(button).toHaveClass('custom-class')
    })
  })

  describe('Variantes', () => {
    it('deve aplicar classes da variante primary por padrão', () => {
      render(<BaseButton>Primary</BaseButton>)
      
      const button = screen.getByText('Primary')
      expect(button).toHaveClass('bg-primary-600', 'text-white')
    })

    it('deve aplicar classes da variante danger', () => {
      render(<BaseButton variant="danger">Danger</BaseButton>)
      
      const button = screen.getByText('Danger')
      expect(button).toHaveClass('bg-red-600', 'text-white')
    })

    it('deve aplicar classes da variante outline', () => {
      render(<BaseButton variant="outline">Outline</BaseButton>)
      
      const button = screen.getByText('Outline')
      expect(button).toHaveClass('border-2', 'border-gray-300', 'bg-white')
    })
  })

  describe('Tamanhos', () => {
    it('deve aplicar tamanho médio por padrão', () => {
      render(<BaseButton>Medium</BaseButton>)
      
      const button = screen.getByText('Medium')
      expect(button).toHaveClass('px-4', 'py-2.5', 'text-sm')
    })

    it('deve aplicar tamanho grande', () => {
      render(<BaseButton size="lg">Large</BaseButton>)
      
      const button = screen.getByText('Large')
      expect(button).toHaveClass('px-6', 'py-3', 'text-base')
    })
  })

  describe('Estados', () => {
    it('deve mostrar spinner quando loading é true', () => {
      render(<BaseButton loading>Loading</BaseButton>)
      
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    it('deve ser desabilitado quando disabled é true', () => {
      render(<BaseButton disabled>Disabled</BaseButton>)
      
      const button = screen.getByText('Disabled')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
    })

    it('deve ser desabilitado quando loading é true', () => {
      render(<BaseButton loading>Loading</BaseButton>)
      
      const button = screen.getByText('Loading')
      expect(button).toBeDisabled()
    })
  })

  describe('Comportamento de clique', () => {
    it('deve chamar onClick quando clicado', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<BaseButton onClick={handleClick}>Click me</BaseButton>)
      
      await user.click(screen.getByText('Click me'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('não deve chamar onClick quando disabled', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<BaseButton onClick={handleClick} disabled>Click me</BaseButton>)
      
      await user.click(screen.getByText('Click me'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('não deve chamar onClick quando loading', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<BaseButton onClick={handleClick} loading>Click me</BaseButton>)
      
      await user.click(screen.getByText('Click me'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Ícones', () => {
    it('deve renderizar ícone à esquerda por padrão', () => {
      const icon = <span data-testid="test-icon">🔥</span>
      render(<BaseButton icon={icon}>With Icon</BaseButton>)
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })

    it('deve renderizar ícone à direita', () => {
      const icon = <span data-testid="test-icon">🔥</span>
      render(<BaseButton icon={icon} iconPosition="right">With Icon</BaseButton>)
      
      const button = screen.getByText('With Icon').closest('button')
      const iconElement = screen.getByTestId('test-icon')
      
      // Verifica se o ícone está após o texto
      expect(button?.lastChild).toContain(iconElement)
    })
  })

  describe('Full width', () => {
    it('deve aplicar classe w-full quando fullWidth é true', () => {
      render(<BaseButton fullWidth>Full Width</BaseButton>)
      
      const button = screen.getByText('Full Width')
      expect(button).toHaveClass('w-full')
    })
  })
})

describe('IconButton', () => {
  describe('Renderização', () => {
    it('deve renderizar ícone predefinido', () => {
      render(<IconButton icon="edit" label="Edit button" />)
      
      const button = screen.getByLabelText('Edit button')
      expect(button).toBeInTheDocument()
      
      // Verifica se tem o ícone SVG
      const svg = button.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('deve aplicar tamanho correto', () => {
      render(<IconButton icon="edit" label="Edit" size="lg" />)
      
      const button = screen.getByLabelText('Edit')
      expect(button).toHaveClass('p-3') // lg size padding
    })

    it('deve aplicar classes de arredondamento', () => {
      render(<IconButton icon="edit" label="Edit" rounded />)
      
      const button = screen.getByLabelText('Edit')
      expect(button).toHaveClass('rounded-full')
    })

    it('deve mostrar tooltip quando fornecido', () => {
      render(<IconButton icon="edit" label="Edit" tooltip="Edit this item" />)
      
      const button = screen.getByLabelText('Edit')
      expect(button).toHaveAttribute('title', 'Edit this item')
    })
  })
})

describe('ActionButton', () => {
  describe('Configurações de ação', () => {
    it('deve renderizar botão de editar', () => {
      const handleConfirm = jest.fn()
      render(<ActionButton action="edit" onConfirm={handleConfirm} />)
      
      const button = screen.getByLabelText('Editar')
      expect(button).toBeInTheDocument()
    })

    it('deve renderizar botão de excluir', () => {
      const handleConfirm = jest.fn()
      render(<ActionButton action="delete" onConfirm={handleConfirm} />)
      
      const button = screen.getByLabelText('Excluir')
      expect(button).toBeInTheDocument()
    })

    it('deve mostrar texto quando showText é true', () => {
      const handleConfirm = jest.fn()
      render(<ActionButton action="edit" onConfirm={handleConfirm} showText />)
      
      expect(screen.getByText('Editar')).toBeInTheDocument()
    })
  })

  describe('Confirmação para delete', () => {
    it('deve mostrar confirmação antes de executar delete', async () => {
      const handleConfirm = jest.fn()
      const user = userEvent.setup()
      
      // Mock window.confirm
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true)
      
      render(<ActionButton action="delete" onConfirm={handleConfirm} />)
      
      await user.click(screen.getByLabelText('Excluir'))
      
      expect(confirmSpy).toHaveBeenCalledWith(
        expect.stringContaining('Tem certeza que deseja excluir')
      )
      expect(handleConfirm).toHaveBeenCalled()
      
      confirmSpy.mockRestore()
    })

    it('não deve executar delete se confirmação for cancelada', async () => {
      const handleConfirm = jest.fn()
      const user = userEvent.setup()
      
      // Mock window.confirm para retornar false
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false)
      
      render(<ActionButton action="delete" onConfirm={handleConfirm} />)
      
      await user.click(screen.getByLabelLabel('Excluir'))
      
      expect(confirmSpy).toHaveBeenCalled()
      expect(handleConfirm).not.toHaveBeenCalled()
      
      confirmSpy.mockRestore()
    })
  })
})