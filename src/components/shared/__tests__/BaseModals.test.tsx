/**
 * Tests para BaseModal - Sistema de modales SSoT
 * 
 * Testa funcionalidades críticas:
 * - Renderização e controle de estado
 * - Acessibilidade (ESC, foco, ARIA)
 * - Variantes e tamanhos
 * - Comportamentos de fechamento
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BaseModal } from '../BaseModals'

// Mock para prevenir erros de overflow durante os testes
beforeEach(() => {
  // Simula document.body.style
  Object.defineProperty(document.body.style, 'overflow', {
    value: '',
    writable: true
  })
})

describe('BaseModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Renderização básica', () => {
    it('deve renderizar quando isOpen é true', () => {
      render(<BaseModal {...defaultProps}>Modal content</BaseModal>)
      
      expect(screen.getByText('Test Modal')).toBeInTheDocument()
      expect(screen.getByText('Modal content')).toBeInTheDocument()
    })

    it('não deve renderizar quando isOpen é false', () => {
      render(<BaseModal {...defaultProps} isOpen={false}>Modal content</BaseModal>)
      
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    })

    it('deve renderizar subtítulo quando fornecido', () => {
      render(
        <BaseModal {...defaultProps} subtitle="Test subtitle">
          Modal content
        </BaseModal>
      )
      
      expect(screen.getByText('Test subtitle')).toBeInTheDocument()
    })
  })

  describe('Acessibilidade', () => {
    it('deve ter atributos ARIA corretos', () => {
      render(<BaseModal {...defaultProps}>Modal content</BaseModal>)
      
      const modal = screen.getByRole('dialog')
      expect(modal).toHaveAttribute('aria-modal', 'true')
      expect(modal).toHaveAttribute('aria-labelledby')
    })

    it('deve focar no modal ao abrir', async () => {
      render(<BaseModal {...defaultProps}>Modal content</BaseModal>)
      
      await waitFor(() => {
        const modal = screen.getByRole('dialog')
        expect(modal).toHaveFocus()
      })
    })

    it('deve fechar com tecla ESC quando closeOnEscape é true', async () => {
      const user = userEvent.setup()
      render(<BaseModal {...defaultProps} closeOnEscape>Modal content</BaseModal>)
      
      await user.keyboard('{Escape}')
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })

    it('não deve fechar com ESC quando closeOnEscape é false', async () => {
      const user = userEvent.setup()
      render(<BaseModal {...defaultProps} closeOnEscape={false}>Modal content</BaseModal>)
      
      await user.keyboard('{Escape}')
      expect(defaultProps.onClose).not.toHaveBeenCalled()
    })
  })

  describe('Comportamento de fechamento', () => {
    it('deve fechar ao clicar no overlay quando closeOnOverlayClick é true', () => {
      render(<BaseModal {...defaultProps} closeOnOverlayClick>Modal content</BaseModal>)
      
      const overlay = screen.getByRole('dialog').parentElement
      fireEvent.click(overlay!)
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })

    it('não deve fechar ao clicar no conteúdo do modal', () => {
      render(<BaseModal {...defaultProps} closeOnOverlayClick>Modal content</BaseModal>)
      
      const content = screen.getByText('Modal content')
      fireEvent.click(content)
      
      expect(defaultProps.onClose).not.toHaveBeenCalled()
    })

    it('deve fechar ao clicar no botão X', async () => {
      const user = userEvent.setup()
      render(<BaseModal {...defaultProps} showCloseButton>Modal content</BaseModal>)
      
      const closeButton = screen.getByLabelText('Fechar modal')
      await user.click(closeButton)
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Variantes e tamanhos', () => {
    it('deve aplicar classe de tamanho correto', () => {
      render(<BaseModal {...defaultProps} size="lg">Modal content</BaseModal>)
      
      const modal = screen.getByRole('dialog')
      expect(modal).toHaveClass('max-w-lg')
    })

    it('deve aplicar variante de estilo correto', () => {
      render(<BaseModal {...defaultProps} variant="dark">Modal content</BaseModal>)
      
      const modal = screen.getByRole('dialog')
      expect(modal).toHaveClass('bg-gray-900', 'text-white')
    })
  })

  describe('Footer customizado', () => {
    it('deve renderizar footer quando fornecido', () => {
      const footer = <button>Custom Footer Button</button>
      
      render(<BaseModal {...defaultProps} footer={footer}>Modal content</BaseModal>)
      
      expect(screen.getByText('Custom Footer Button')).toBeInTheDocument()
    })
  })

  describe('Prevenção de scroll', () => {
    it('deve prevenir scroll do body quando preventScroll é true', () => {
      render(<BaseModal {...defaultProps} preventScroll>Modal content</BaseModal>)
      
      expect(document.body.style.overflow).toBe('hidden')
    })

    it('deve restaurar scroll ao fechar', () => {
      const { rerender } = render(<BaseModal {...defaultProps} preventScroll>Modal content</BaseModal>)
      
      expect(document.body.style.overflow).toBe('hidden')
      
      rerender(<BaseModal {...defaultProps} isOpen={false} preventScroll>Modal content</BaseModal>)
      
      expect(document.body.style.overflow).toBe('unset')
    })
  })
})

describe('Integração com outros componentes', () => {
  it('deve funcionar corretamente com FormModal', () => {
    // Teste básico de integração - pode ser expandido
    const handleSubmit = jest.fn()
    
    render(
      <BaseModal isOpen onClose={jest.fn()} title="Form Modal Test">
        <form onSubmit={handleSubmit} data-testid="test-form">
          <input type="text" placeholder="Test input" />
          <button type="submit">Submit</button>
        </form>
      </BaseModal>
    )
    
    const form = screen.getByTestId('test-form')
    expect(form).toBeInTheDocument()
  })
})