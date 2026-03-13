# Guia de Migração para Componentes Base (Fase 3)

## Visão Geral

Esta documentação descreve como migrar componentes existentes para usar o sistema de componentes base implementado na Fase 3 do projeto SSoT.

## Novos Componentes Disponíveis

### 1. Componentes Base Estruturais (`BaseComponents`)

#### BaseCard
Substitui cards customizados espalhados pelo código.

```tsx
// ❌ Antes (duplicado em várias páginas)
<div className="bg-white rounded-lg shadow-md p-4 border">
  <h3 className="text-lg font-semibold mb-4">Título</h3>
  <div className="space-y-2">
    {content}
  </div>
</div>

// ✅ Agora (centralizado)
import { BaseCard, BaseSection } from '@/components/shared'

<BaseCard variant="elevated" padding="lg">
  <BaseSection title="Título">
    {content}
  </BaseSection>
</BaseCard>
```

#### BaseList
Substitui listas customizadas com funcionalidades padronizadas.

```tsx
// ❌ Antes (lógica espalhada)
{items.map(item => (
  <div key={item.id} className="flex justify-between py-2 border-b">
    <span>{item.nome}</span>
    <div>
      <button onClick={() => edit(item)}>✏️</button>
      <button onClick={() => delete(item)}>🗑️</button>
    </div>
  </div>
))}

// ✅ Agora (padronizado)
import { BaseList } from '@/components/shared'

<BaseList
  items={items.map(item => ({
    id: item.id,
    label: item.nome,
    value: item.email,
    actions: (
      <>
        <ActionButton action="edit" onConfirm={() => edit(item)} />
        <ActionButton action="delete" onConfirm={() => delete(item)} />
      </>
    )
  }))}
  variant="bordered"
  interactive
  onItemClick={handleItemClick}
/>
```

### 2. Sistema de Modais (`BaseModals`)

#### FormModal
Substitui FormModal e ViewModal existentes.

```tsx
// ❌ Antes (lógica duplicada)
const [isSubmitting, setIsSubmitting] = useState(false)
const [showModal, setShowModal] = useState(false)

const handleSubmit = async (data) => {
  setIsSubmitting(true)
  try {
    await saveData(data)
    setShowModal(false)
    showNotification('Salvo com sucesso', 'success')
  } catch (error) {
    showNotification('Erro ao salvar', 'error')
  }
  setIsSubmitting(false)
}

// ✅ Agora (centralizado)
import { FormModal } from '@/components/shared'

<FormModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Editar Cliente"
  onSubmit={handleSubmit}
  submitText="Salvar Cliente"
  isSubmitting={isSubmitting}
  showUnsavedWarning
  unsavedChanges={hasChanges}
>
  <ClienteForm data={cliente} onChange={setHasChanges} />
</FormModal>
```

#### ViewModal
Para visualização de dados com layout padronizado.

```tsx
// ❌ Antes (estrutura repetida)
<Modal isOpen={showView} onClose={() => setShowView(false)}>
  <div className="space-y-4">
    <h2>Dados do Cliente</h2>
    <div>
      <label>Nome:</label>
      <span>{cliente.nome}</span>
    </div>
    <div>
      <label>Email:</label>  
      <span>{cliente.email}</span>
    </div>
    <div className="flex gap-2">
      <button onClick={handleEdit}>Editar</button>
      <button onClick={handleDelete}>Excluir</button>
    </div>
  </div>
</Modal>

// ✅ Agora (estruturado)
<ViewModal
  isOpen={showView}
  onClose={() => setShowView(false)}
  title="Dados do Cliente"
  data={cliente}
  fields={[
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'telefone', label: 'Telefone', format: formatPhone },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> }
  ]}
  showEditButton
  showDeleteButton
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### 3. Sistema de Botões (`BaseButtons`)

#### BaseButton
Substitui botões com estilos inconsistentes.

```tsx
// ❌ Antes (estilos espalhados)
<button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
  Salvar
</button>

<button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
  Excluir
</button>

// ✅ Agora (centralizado)
import { BaseButton, ActionButton } from '@/components/shared'

<BaseButton variant="primary" size="md" loading={isLoading}>
  Salvar
</BaseButton>

<ActionButton action="delete" onConfirm={handleDelete} />
```

#### IconButton e ActionButton
Para ações rápidas com ícones padronizados.

```tsx
// ❌ Antes (ícones e estilos inconsistentes)
<button className="p-2 text-gray-600 hover:text-gray-800" onClick={handleEdit}>
  <EditIcon />
</button>

<button className="p-2 text-red-600 hover:text-red-800" onClick={handleDelete}>
  <DeleteIcon />
</button>

// ✅ Agora (padronizado)
<IconButton icon="edit" label="Editar" onClick={handleEdit} />
<ActionButton action="delete" onConfirm={handleDelete} />
```

## 4. Configurações Centralizadas (`external-apis`)

### URLs e Rotas
```tsx
// ❌ Antes (hardcoded)
const clienteUrl = `/clientes/${id}`
const editUrl = `/clientes/${id}/editar`

// ✅ Agora (centralizado)
import { APP_ROUTES } from '@/config'

const clienteUrl = APP_ROUTES.CLIENTES.VIEW(id)
const editUrl = APP_ROUTES.CLIENTES.EDIT(id)
```

### APIs Externas
```tsx
// ❌ Antes (URLs espalhadas)
const cepUrl = `https://viacep.com.br/ws/${cep}/json/`
const cnpjUrl = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`

// ✅ Agora (centralizado)
import { BRAZILIAN_APIS } from '@/config'

const cepUrl = BRAZILIAN_APIS.VIA_CEP.BASE_URL + BRAZILIAN_APIS.VIA_CEP.ENDPOINTS.BY_CEP(cep)
const cnpjUrl = BRAZILIAN_APIS.BRASIL_API.BASE_URL + BRAZILIAN_APIS.BRASIL_API.ENDPOINTS.CNPJ(cnpj)
```

## Plano de Migração

### Prioridade 1: Componentes Críticos
1. **Modais de formulário** - Migrar FormModal e ViewModal
2. **Botões de ação** - Padronizar botões de editar/excluir
3. **Cards de listagem** - Usar BaseCard e BaseList

### Prioridade 2: URLs e Configurações
1. **Rotas internas** - Substituir strings hardcoded
2. **APIs externas** - Centralizar URLs de terceiros
3. **Constantes de configuração**

### Prioridade 3: Refinamentos
1. **Componentes de layout** - BaseGrid, BaseDivider
2. **Botões especializados** - ButtonGroup, LinkButton
3. **Otimizações de performance**

## Exemplos de Migração Completa

### Página de Listagem de Clientes

```tsx
// ❌ Antes
import React, { useState } from 'react'

const ClientesPage = () => {
  const [clients, setClients] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)

  const handleEdit = (client) => {
    setEditingClient(client)
    setShowModal(true)
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h1 className="text-xl font-semibold mb-4">Clientes</h1>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          Novo Cliente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        {clients.map(client => (
          <div key={client.id} className="flex justify-between p-4 border-b">
            <div>
              <h3>{client.nome}</h3>
              <p className="text-gray-600">{client.email}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(client)}>✏️</button>
              <button onClick={() => handleDelete(client)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

```tsx
// ✅ Depois
import React, { useState } from 'react'
import { 
  BaseCard, 
  BaseSection, 
  BaseList, 
  FormModal, 
  ActionButton,
  BaseButton 
} from '@/components/shared'
import { APP_ROUTES } from '@/config'

const ClientesPage = () => {
  const [clients, setClients] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)

  const handleEdit = (client) => {
    setEditingClient(client)
    setShowModal(true)
  }

  const clientItems = clients.map(client => ({
    id: client.id,
    label: client.nome,
    value: client.email,
    href: APP_ROUTES.CLIENTES.VIEW(client.id),
    actions: (
      <>
        <ActionButton action="edit" onConfirm={() => handleEdit(client)} />
        <ActionButton action="delete" onConfirm={() => handleDelete(client)} />
      </>
    )
  }))

  return (
    <div className="p-6 space-y-6">
      <BaseCard>
        <BaseSection 
          title="Clientes"
          headerActions={
            <BaseButton 
              variant="primary" 
              icon="add"
              onClick={() => setShowModal(true)}
            >
              Novo Cliente
            </BaseButton>
          }
        >
          <BaseList
            items={clientItems}
            variant="bordered"
            interactive
            emptyMessage="Nenhum cliente cadastrado"
          />
        </BaseSection>
      </BaseCard>

      <FormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingClient ? 'Editar Cliente' : 'Novo Cliente'}
        onSubmit={handleSubmit}
      >
        <ClienteForm cliente={editingClient} />
      </FormModal>
    </div>
  )
}
```

## Checklist de Migração

### Para cada componente migrado:

- [ ] Substituir estilos hardcoded por componentes base
- [ ] Centralizar lógica de estado quando aplicável  
- [ ] Usar hooks compartilhados (useAsyncOperation, useFormNotifications)
- [ ] Substituir URLs hardcoded por constantes
- [ ] Adicionar props de acessibilidade quando necessário
- [ ] Testar funcionalidade em diferentes cenários
- [ ] Atualizar testes unitários se existirem

### Benefícios Esperados:

1. **Consistência Visual**: Todos os componentes seguem o mesmo design system
2. **Manutenibilidade**: Mudanças de estilo em um local afetam toda a aplicação
3. **Produtividade**: Desenvolvimento mais rápido com componentes prontos
4. **Acessibilidade**: Comportamentos padronizados (ESC, foco, ARIA)
5. **Qualidade**: Menos bugs por reutilização de código testado

## Próximos Passos

1. Começar migração pelos componentes mais críticos
2. Documentar componentes específicos do domínio (ClienteCard, AudienciaItem)
3. Criar testes automatizados para componentes base
4. Considerar adicionar mais variantes conforme necessidade
5. Implementar sistema de tokens de design se necessário