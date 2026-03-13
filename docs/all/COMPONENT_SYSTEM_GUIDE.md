# Guia Avançado de Componentes Base - SSoT

## Visão Geral da Arquitetura

O sistema de componentes base implementa **Single Source of Truth (SSoT)** fornecendo:

- **Consistência Visual**: Design system unificado
- **Reutilização Máxima**: Componentes composáveis  
- **Manutenibilidade**: Mudanças centralizadas
- **Performance**: Otimizações com React.memo
- **Acessibilidade**: Comportamentos padronizados
- **Developer Experience**: APIs intuitivas

## Componentes Disponíveis

### 🎨 Estruturais (BaseComponents)

#### BaseCard
Card reutilizável com variantes e estados.

```tsx
<BaseCard 
  variant="elevated"     // default | elevated | bordered | flat
  size="md"              // sm | md | lg  
  interactive={true}     // Hover effects
  padding="lg"           // sm | md | lg | xl
  onClick={handleClick}  // Opcional
>
  <Content />
</BaseCard>
```

**Casos de uso**:
- Cards de listagem (clientes, audiências)
- Containers de formulário
- Dashboards e métricas
- Seções de conteúdo

#### BaseSection  
Seção com título, subtítulo e ações.

```tsx
<BaseSection
  title="Dados do Cliente"
  subtitle="Informações principais"
  headerActions={<ActionButtons />}
  collapsible={true}
  titleLevel="h2"
>
  <SectionContent />
</BaseSection>
```

#### BaseList
Lista avançada com loading, paginação e ações.

```tsx
<BaseList
  items={listItems}
  variant="bordered"     // default | bordered | divided
  interactive={true}
  loading={isLoading}
  error={error}
  emptyMessage="Nenhum cliente encontrado"
  maxItems={10}
  onItemClick={handleItemClick}
/>
```

**Estrutura dos items**:
```tsx
const listItems = clients.map(client => ({
  id: client.id,
  label: client.nome,
  value: client.email,
  icon: <UserIcon />,
  actions: (
    <>
      <ActionButton action="edit" onConfirm={() => edit(client)} />
      <ActionButton action="delete" onConfirm={() => delete(client)} />
    </>
  ),
  href: `/clients/${client.id}` // Opcional para links
}))
```

#### BaseGrid
Sistema de grillas responsivas.

```tsx
<BaseGrid 
  cols={{ xs: 1, sm: 2, md: 3, lg: 4 }}
  autoFit={true}
  minItemWidth="250px"
  gap="lg"
>
  {cards}
</BaseGrid>
```

### 🪟 Modais (BaseModals)

#### FormModal
Modal otimizado para formulários com validação.

```tsx
<FormModal
  isOpen={showModal}
  onClose={handleClose}
  title="Editar Cliente"
  onSubmit={handleSubmit}
  isSubmitting={isSubmitting}
  submitText="Salvar Cliente"
  showUnsavedWarning={true}
  unsavedChanges={hasChanges}
  validationErrors={errors}
  size="lg"
>
  <ClienteForm />
</FormModal>
```

**Recursos automáticos**:
- ✅ Validação de erros antes do submit
- ✅ Aviso de mudanças não salvas
- ✅ Loading states
- ✅ Notificações automáticas
- ✅ Acessibilidade (ESC, foco)

#### ViewModal
Modal para visualização estruturada de dados.

```tsx
<ViewModal
  isOpen={showView}
  onClose={() => setShowView(false)}
  title="Dados do Cliente"
  data={cliente}
  fields={[
    { key: 'nome', label: 'Nome' },
    { 
      key: 'email', 
      label: 'Email',
      render: (value) => <a href={`mailto:${value}`}>{value}</a>
    },
    { 
      key: 'status', 
      label: 'Status',
      format: (value) => value.toUpperCase()
    }
  ]}
  showEditButton={true}
  showDeleteButton={true}
  onEdit={handleEdit}
  onDelete={handleDelete}
  loading={isLoading}
  error={error}
/>
```

#### ConfirmModal  
Modal de confirmação com tipos predefinidos.

```tsx
<ConfirmModal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  title="Confirmar Exclusão"
  type="danger"          // info | warning | danger | success
  message="Esta ação não pode ser desfeita"
  confirmText="Excluir"
  cancelText="Cancelar"
  onConfirm={handleConfirm}
  isProcessing={isProcessing}
/>
```

### 🔘 Botões (BaseButtons)

#### BaseButton
Botão base com todas as variantes.

```tsx
<BaseButton
  variant="primary"      // primary | secondary | success | danger | outline | ghost | link
  size="md"             // xs | sm | md | lg | xl
  loading={isLoading}
  disabled={isDisabled}
  fullWidth={true}
  icon={<SaveIcon />}
  iconPosition="left"   // left | right
  onClick={handleClick}
>
  Salvar Cliente
</BaseButton>
```

#### ActionButton
Botões de ação predefinidos com lógica automática.

```tsx
<ActionButton 
  action="delete"           // edit | delete | view | add | download
  onConfirm={handleDelete}
  showText={false}          // Só ícone por padrão
  confirmMessage="Deseja excluir este cliente?"  // Override padrão
  size="sm"
/>
```

**Ações disponíveis**:
- `edit`: Ícone lápis, variant outline
- `delete`: Ícone lixeira, variant danger, confirmação automática
- `view`: Ícone olho, variant ghost
- `add`: Ícone plus, variant success  
- `download`: Ícone download, variant outline

#### IconButton
Botão somente com ícone.

```tsx
<IconButton
  icon="edit"              // Ícone predefinido ou ReactNode
  label="Editar cliente"   // Para acessibilidade
  size="md"
  variant="ghost"
  rounded={true}
  tooltip="Clique para editar"
  onClick={handleEdit}
/>
```

#### ButtonGroup
Agrupamento de botões attached ou separated.

```tsx
<ButtonGroup 
  variant="attached"       // attached | separated
  orientation="horizontal" // horizontal | vertical
  size="md"
  fullWidth={false}
>
  <BaseButton variant="outline">Cancelar</BaseButton>
  <BaseButton variant="primary">Confirmar</BaseButton>
</ButtonGroup>
```

## Padrões de Uso Avançados

### 🏗️ Composição de Componentes

```tsx
// ✅ Padrão recomendado - Composição
const ClienteDashboard = () => (
  <BaseGrid cols={{ md: 2, lg: 3 }} gap="lg">
    <BaseCard variant="elevated">
      <BaseSection title="Clientes Ativos">
        <MetricDisplay value={clientesAtivos} />
      </BaseSection>
    </BaseCard>
    
    <BaseCard variant="elevated">
      <BaseSection 
        title="Lista de Clientes"
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
          items={clienteItems}
          loading={isLoading}
          error={error}
          onItemClick={handleClientClick}
        />
      </BaseSection>
    </BaseCard>
  </BaseGrid>
)
```

### 🎯 Hooks Integrados

```tsx
const ClientesPage = () => {
  const { executeAsync, loading } = useAsyncOperation()
  const { showNotification } = useFormNotifications()
  
  const handleDeleteClient = (client) => {
    executeAsync(
      () => deleteClient(client.id),
      {
        confirmMessage: `Excluir cliente ${client.nome}?`,
        successMessage: 'Cliente excluído com sucesso!',
        onSuccess: () => {
          // Recarregar lista
          refetch()
        }
      }
    )
  }

  return (
    <BaseCard>
      <BaseList
        items={clients.map(client => ({
          id: client.id,
          label: client.nome,
          value: client.email,
          actions: (
            <ActionButton 
              action="delete" 
              onConfirm={() => handleDeleteClient(client)}
            />
          )
        }))}
        loading={loading}
      />
    </BaseCard>
  )
}
```

### 🎨 Customização de Estilos

```tsx
// ✅ Override classes when needed
<BaseCard 
  className="border-2 border-blue-200 hover:border-blue-400"
  variant="bordered"
>
  <BaseSection 
    title="Custom Section"
    className="bg-blue-50"
  >
    Custom content with enhanced styling
  </BaseSection>
</BaseCard>
```

### 📱 Responsividade Automática

```tsx
<BaseGrid 
  cols={{ xs: 1, sm: 2, lg: 3, xl: 4 }}
  gap={{ xs: 'sm', md: 'lg' }}
>
  {items.map(item => (
    <BaseCard key={item.id} size={{ xs: 'sm', lg: 'md' }}>
      <ItemContent item={item} />
    </BaseCard>
  ))}
</BaseGrid>
```

## Performance e Otimizações

### React.memo Automático
Todos os componentes base usam `React.memo` com comparações otimizadas:

```tsx
// ✅ Otimizado automaticamente
const MyComponent = () => {
  const [count, setCount] = useState(0)
  
  return (
    <BaseCard variant="elevated">
      {/* Re-renderiza apenas quando props mudam */}
      <BaseSection title={`Contador: ${count}`}>
        <BaseButton onClick={() => setCount(c => c + 1)}>
          Incrementar
        </BaseButton>
      </BaseSection>
    </BaseCard>
  )
}
```

### Lazy Loading de Componentes

```tsx
// Para componentes pesados
const HeavyModal = lazy(() => import('./HeavyModal'))

const MyPage = () => (
  <div>
    <BaseButton onClick={() => setShowHeavy(true)}>
      Abrir Modal Pesado
    </BaseButton>
    
    <Suspense fallback={<BaseCard loading />}>
      {showHeavy && <HeavyModal />}
    </Suspense>
  </div>
)
```

## Migração de Componentes Existentes

### Checklist de Migração

1. **Identificar padrões repetidos**:
   ```bash
   # Buscar por padrões duplicados
   grep -r "bg-white rounded-lg shadow" src/
   grep -r "flex justify-between" src/
   grep -r "onClick.*confirm" src/
   ```

2. **Substituir componentes estruturais**:
   ```tsx
   // ❌ Antes
   <div className="bg-white rounded-lg shadow-md p-4">
     <h2 className="text-xl font-semibold mb-4">Título</h2>
     <div>Conteúdo</div>
   </div>
   
   // ✅ Depois  
   <BaseCard variant="elevated">
     <BaseSection title="Título">
       <div>Conteúdo</div>
     </BaseSection>
   </BaseCard>
   ```

3. **Centralizar lógica de botões**:
   ```tsx
   // ❌ Antes
   <button 
     onClick={() => {
       if (confirm('Excluir?')) handleDelete()
     }}
     className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
   >
     Excluir
   </button>
   
   // ✅ Depois
   <ActionButton action="delete" onConfirm={handleDelete} />
   ```

4. **Unificar modais**:
   ```tsx
   // ❌ Antes: Modal customizado com 50+ linhas
   
   // ✅ Depois: FormModal com configuração
   <FormModal
     isOpen={show}
     onClose={hide} 
     title="Editar"
     onSubmit={save}
   >
     <Form />
   </FormModal>
   ```

### Ferramentas de Migração

1. **Script de análise**:
   ```bash
   node scripts/analyze-components.js
   # Identifica componentes candidatos à migração
   ```

2. **Codemod automático** (futuro):
   ```bash
   npx @advocacia/migrate-to-base-components src/
   ```

## Troubleshooting

### Problemas Comuns

1. **Conflitos de CSS**:
   ```tsx
   // ✅ Usar className para overrides específicos
   <BaseCard className="!bg-red-50 !border-red-200">
     Override necessário
   </BaseCard>
   ```

2. **Props não passadas**:
   ```tsx
   // ✅ Spread props customizadas
   <BaseButton {...customProps} variant="primary">
     Texto
   </BaseButton>
   ```

3. **Performance com muitos itens**:
   ```tsx
   // ✅ Usar virtualization para listas grandes
   <VirtualizedBaseList 
     items={thousandsOfItems}
     itemHeight={60}
     maxVisible={10}
   />
   ```

## Roadmap Futuro

- [ ] Componentes de formulário especializados
- [ ] Sistema de tokens de design
- [ ] Temas dark/light automático  
- [ ] Componentes de dados (tabelas, charts)
- [ ] Biblioteca de ícones integrada
- [ ] Storybook documentation
- [ ] Visual regression testing

## Suporte

Para dúvidas ou melhorias:
1. Consulte a documentação inline nos componentes
2. Veja exemplos em `/docs/examples/`
3. Execute os testes: `npm run test:components`
4. Abra issue no repositório interno