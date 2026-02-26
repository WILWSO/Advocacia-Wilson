# 📮 Módulo CEP - Consulta de Endereços Brasil

Módulo **100% autoconido e portável** para consulta de CEP usando a API gratuita [ViaCEP](https://viacep.com.br/).

## ✨ Características

- ✅ **Zero dependências externas** (apenas React e lucide-react)
- ✅ **TypeScript completo** com types seguros
- ✅ **Cache inteligente** em memória
- ✅ **Debounce automático** para auto-search
- ✅ **Retry automático** em caso de falha
- ✅ **Timeout configurável**
- ✅ **Feedback visual** (loading, success, error)
- ✅ **Componentes standalone** prontos para usar
- ✅ **Hook reutilizável** para lógica customizada
- ✅ **100% acessível** (ARIA labels, keyboard navigation)
- ✅ **Formatação automática** do CEP

## 📦 Instalação

Simplesmente copie a pasta `features/cep` para seu projeto React/TypeScript.

```bash
# Estrutura resultante:
src/features/cep/
├── components/
├── hooks/
├── services/
├── types/
├── utils/
├── config/
├── constants/
├── index.ts
└── README.md (este arquivo)
```

## 🚀 Uso Rápido

### 1. Componente CEPInput (Mais Simples)

Input completo com busca integrada:

```tsx
import { CEPInput } from '@/features/cep'

function MeuFormulario() {
  const [cep, setCep] = useState('')

  const handleAddressFound = (data) => {
    console.log('Endereço:', data)
    // data.logradouro  -> rua
    // data.bairro      -> bairro
    // data.localidade  -> cidade
    // data.uf          -> estado
  }

  return (
    <CEPInput
      value={cep}
      onChange={setCep}
      onAddressFound={handleAddressFound}
      autoSearch={true}           // Busca automática ao completar 8 dígitos
      showSearchButton={true}     // Mostrar botão "Buscar"
      enableCache={true}          // Habilitar cache
    />
  )
}
```

### 2. Hook useCEPLookup (Mais Flexível)

Para total controle sobre a busca:

```tsx
import { useCEPLookup } from '@/features/cep'

function MeuFormulario() {
  const [cep, setCep] = useState('')
  
  const { searchCEP, loading, data, error } = useCEPLookup({
    enableCache: true,
    onSuccess: (cepData) => {
      // Preencher formulário automaticamente
      setEndereco(cepData.logradouro)
      setBairro(cepData.bairro)
      setCidade(cepData.localidade)
      setEstado(cepData.uf)
    }
  })

  const handleSearchClick = async () => {
    const result = await searchCEP(cep)
    if (result.success) {
      console.log('Encontrado:', result.data)
    }
  }

  return (
    <div>
      <input value={cep} onChange={(e) => setCep(e.target.value)} />
      <button onClick={handleSearchClick} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar CEP'}
      </button>
      {error && <p>Erro: {error.message}</p>}
    </div>
  )
}
```

### 3. Serviço fetchCEP (Baixo Nível)

Para uso direto sem React:

```tsx
import { fetchCEP } from '@/features/cep'

const buscarEndereco = async () => {
  const response = await fetchCEP('01310-100')
  
  if (response.success) {
    console.log('CEP:', response.data.cep)
    console.log('Rua:', response.data.logradouro)
    console.log('Cidade:', response.data.localidade)
  } else {
    console.error('Erro:', response.error.message)
  }
}
```

## 📖 API Completa

### Componente CEPInput

```tsx
interface CEPInputProps {
  value: string                              // CEP atual
  onChange: (value: string) => void          // Callback de mudança
  onAddressFound?: (data: CEPData) => void   // Callback quando encontrar
  autoSearch?: boolean                       // Busca automática (default: false)
  disabled?: boolean                         // Desabilitar input
  className?: string                         // Classes CSS adicionais
  placeholder?: string                       // Placeholder (default: '00000-000')
  showSearchButton?: boolean                 // Mostrar botão (default: true)
  enableCache?: boolean                      // Habilitar cache (default: true)
}
```

### Hook useCEPLookup

```tsx
const {
  loading,              // boolean - está buscando?
  error,                // CEPError | null
  data,                 // CEPData | null
  searchCEP,            // (cep: string) => Promise<CEPResponse>
  searchCEPDebounced,   // (cep: string) => void - com debounce
  reset,                // () => void - limpar estado
  clearCache,           // () => void - limpar cache
  hasData,              // boolean - tem dados?
  hasError,             // boolean - tem erro?
  isIdle,               // boolean - está ocioso?
} = useCEPLookup(options)
```

#### Opções do Hook

```tsx
interface UseCEPLookupOptions {
  enableCache?: boolean                      // Habilitar cache (default: true)
  cacheTimeout?: number                      // Timeout do cache (default: 1h)
  autoSearch?: boolean                       // Auto-search (default: false)
  debounceMs?: number                        // Delay do debounce (default: 500ms)
  onSuccess?: (data: CEPData) => void        // Callback de sucesso
  onError?: (error: CEPError) => void        // Callback de erro
}
```

### Tipos CEPData

```tsx
interface CEPData {
  cep: string          // "01310-100"
  logradouro: string   // "Avenida Paulista"
  complemento: string  // "de 612 a 1510 - lado par"
  bairro: string       // "Bela Vista"
  localidade: string   // "São Paulo"
  uf: string           // "SP"
  ibge: string         // "3550308"
  gia: string          // "1004"
  ddd: string          // "11"
  siafi: string        // "7107"
}
```

### Utilidades

```tsx
import { formatCEP, cleanCEP, validateCEP } from '@/features/cep'

// Formatar: 12345678 -> 12345-678
const formatted = formatCEP('12345678')

// Limpar: 12345-678 -> 12345678
const cleaned = cleanCEP('12345-678')

// Validar
const result = validateCEP('12345-678')
// -> { isValid: true } ou { isValid: false, error: 'mensagem' }
```

## ⚙️ Configuração

Customize o comportamento editando `config/cep.config.ts`:

```tsx
export const CEP_CONFIG = {
  api: {
    baseURL: 'https://viacep.com.br/ws',
    timeout: 5000,      // 5 segundos
    retries: 2,         // 2 tentativas
  },
  cache: {
    enabled: true,
    timeout: 3600000,   // 1 hora
    maxItems: 50,       // Máximo no cache
  },
  debounce: {
    delay: 500,         // 500ms
  },
}
```

## 🎨 Customização de Estilos

O componente usa Tailwind CSS. Você pode:

1. **Passar className** para sobrescrever estilos
2. **Editar componentes** diretamente em `components/`
3. **Usar suas próprias classes** no projeto

## 🧪 Exemplos Avançados

### Integrar com React Hook Form

```tsx
import { CEPInput } from '@/features/cep'
import { useForm, Controller } from 'react-hook-form'

function FormularioCliente() {
  const { control, setValue } = useForm()

  const handleAddressFound = (data) => {
    setValue('endereco', data.logradouro)
    setValue('bairro', data.bairro)
    setValue('cidade', data.localidade)
    setValue('estado', data.uf)
  }

  return (
    <Controller
      name="cep"
      control={control}
      render={({ field }) => (
        <CEPInput
          value={field.value}
          onChange={field.onChange}
          onAddressFound={handleAddressFound}
          autoSearch
        />
      )}
    />
  )
}
```

### Busca Manual com Botão Separado

```tsx
import { useCEPLookup, CEPSearchButton } from '@/features/cep'

function FormularioManual() {
  const [cep, setCep] = useState('')
  const { searchCEP, loading, data } = useCEPLookup()

  return (
    <div className="flex gap-2">
      <input
        value={cep}
        onChange={(e) => setCep(e.target.value)}
        className="flex-1"
      />
      <CEPSearchButton
        cep={cep}
        onSearch={() => searchCEP(cep)}
        loading={loading}
      />
    </div>
  )
}
```

## 🔧 Troubleshooting

### CEP não encontrado
- Verifique se o CEP existe em https://viacep.com.br/
- Nem todos os CEPs estão na base do ViaCEP

### Erro de CORS
- A API ViaCEP permite CORS por padrão
- Se estiver em desenvolvimento local, certifique-se que o dev server está configurado

### Cache não funciona
- Verifique se `enableCache` está `true`
- O cache expira após `cacheTimeout` (default: 1h)
- Use `clearCache()` para limpar manualmente

## 📄 Licença

Este módulo é de código aberto e pode ser usado livremente em seus projetos.

## 🤝 Contribuindo

Para melhorar este módulo:
1. Edite os arquivos na pasta `features/cep/`
2. Mantenha a estrutura modular
3. Documente mudanças neste README

## 📚 Recursos

- [Documentação ViaCEP](https://viacep.com.br/)
- [Buscar CEP](https://buscacepinter.correios.com.br/)

---

**Desenvolvido com ❤️ para projetos React + TypeScript**
