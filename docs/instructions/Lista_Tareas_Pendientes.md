&nbsp;Lista de Tareas Pendientes:

1\. NavBar - Menú "Página": Crear nuevo menú/link/botón "Página" con submenús para mostrar cada sección de la página principal
2\. Botón "Contato": Verificar si es redundante y eliminarlo si lleva al mismo lugar
3\. Superposición de secciones: Corregir primera sección que se sobrepone a la segunda en pantallas Desktop
4\. Navegación AdminDashboard: Cuando usuario está logado en página inicial, agregar forma de volver a AdminDashboard
5\. Sidebar fijo: Hacer sidebar de /Admin fijo cuando se hace scroll
6\. Componente Notification: Crear componente para envolver todos los mensajes de la aplicación
7\. Responsividad completa: Certificar que todo esté funcionando con responsividad para celulares, tablets, iPads, desktops y laptops
8\. Social Destaques: En la sección "SOCIAL DESTAQUES" de la página inicial, cuando no haya ninguna noticia en destaque, simplemente no mostrar la sección


NUEVAS IMPLEMENTACIONES: 25/01/2026

1\. ok. Vamos hacer algunas cosas importantes: crear types para Processos\_juridicos y refactorizar ProcessosPage. Recomienda los pasos y yo decido.


\##############################################
26/01/2026 08:07 - NUEVAS IMPLEMENTACIONES:
\##############################################

1\. ProcessoPage.tsx: 
&nbsp;	a) Setar el focus en el primer campo editable cada vez que un modal es abierto;
&nbsp;	b) Modal "cadastrar Novo Clñiente" al pulsar botón "Novo" dentro del Modal "Novo Processo" no está usando el sistema de notificaciones;
&nbsp;	c) Modal "cadastrar Novo Clñiente" al pulsar botón "Novo" dentro del Modal "Novo Processo" genera error al pulsar "Salvar";
&nbsp;	d) Implementar en los filtros, que al digitar en "buscar", los demás filtros cambien para todos;

2\. Supabase: 
&nbsp;	a) Tabla Clientes - Modificar campo "data\_cadastro" a "data\_criacao";
ok, todo funciona muy bien. Ahora vamos hacer un commit antes de empezar con la refactorización de SocialPage/SocialPublicPage para centralizar Posts y Comentarios.

3.SOCIAL: 
&nbsp;	a) Aplique el mismo patrón de refactorización a SocialPage/SocialPublicPage para centralizar Posts y Comentarios?
&nbsp;	b) VIDOES CARD: en la seccion "Destaques" no muestra el thumbnail del video de YouTube, solo un icono de play. 
&nbsp;	


\##############################
27/01/2026 7:30h
\##############################

1\. Verifica si hay errores en el componente/modulo (nombre) y si el nombre del componente/modulo está consistente con el nombre del archivo y de los imports. Explicacion breve de funcionalidad.

1\. SUPABASE
&nbsp;	a) Tabla posts\_sociais - Crear 2 nuevos campos: "criado\_por" luego del campo "data\_criacao" y "atualizado\_por" luego del campo "data\_atualizacao".
&nbsp;	b) Por cuestión de estetica, los campos de auditoria deben ser los últimos en todas las tablas que los contiene: usuarios, processos\_juridicos, clientes y posts\_sociais en este orden: "data\_criacao", "criado\_por", "data\_atualizacao", "atualizado\_por".

# TESTS
### 2\. MODALES:
&nbsp;	a) Los modales en ediccion o create pierden los datos cargados antes de guardar caso el usuario pulsa acidentalmente afuera del area del form. Noto que hay un sistema de mensages meesages.ts que fue pensado en esto, ejemplo:  DISCARD\_CHANGES: 'Descartar alterações não salvas?', qué podemos hacer para mejorar eso y aplicar a todos los modales que sufren del mismo problema? 

---

## 🆕 CORRECCIONES APLICADAS: 02/02/2026

### ✅ Errores Críticos Corregidos

1. **React Hooks Order Error (AgendaPage)**
   - ❌ Error: "React has detected a change in the order of Hooks"
   - ✅ Solución: Hooks siempre se ejecutan en el mismo orden
   - 📁 Archivos: `AgendaPage.tsx`, `useProcessos.ts`

2. **HTTP 406 Error en Usuarios**
   - ❌ Error: "Failed to load resource: 406 Not Acceptable"
   - ✅ Solución: Headers globales agregados en cliente Supabase
   - 📁 Archivo: `supabase.ts`

3. **Foreign Key Constraint en Clientes**
   - ❌ Error: "violates foreign key constraint clientes_creado_por_fkey"
   - ✅ Solución: Script de migración creado
   - 📁 Archivo: `database/migration-fix-creado-por-constraint.sql`
   - ⚠️ **ACCIÓN REQUERIDA**: Ejecutar migración en Supabase Dashboard

### 📝 Documentación Creada

- `docs/ERRORES_CORREGIDOS_2026-02-02.md` - Documento completo con:
  - Descripción detallada de cada error
  - Soluciones aplicadas
  - Pasos para ejecutar migración
  - Checklist de verificación

### 🔧 Próximos Pasos Requeridos

1. **Ejecutar Migración de Base de Datos**:
   ```
   Abrir: database/migration-fix-creado-por-constraint.sql
   Ejecutar en: Supabase Dashboard → SQL Editor
   ```

2. **Verificar Políticas RLS**:
   - Revisar archivo: `database/rls-policies.sql`
   - Asegurar permisos de lectura en tabla `usuarios`

3. **Probar Funcionalidad**:
   - Recargar aplicación
   - Crear nuevo cliente
   - Verificar AgendaPage sin errores

---

## TAREAS PENDIENTES ANTERIORES 

\*\*\*\*\*\*\* Aplicar la solución "mostrar la caja de confirmacion al pulsar fuera del modal sin guardar las modificaciones" a AgendaPage. (useAudienciaForm.ts) // Si hay cambios no guardados, pedir confirmación. La doble confirmacion al pulsar "Descartar" acontece porque invoca el handleClose de BaseModal.tsx 

#### Flujo MODAL:
Usuario cierra modal → llama onClose={processoForm.resetForm}
FormModal recibe hasUnsavedChanges={processoForm.hasChanges}
FormModal → BaseModal verifica hasUnsavedChanges (línea 46-56)
Si hay cambios, BaseModal muestra diálogo estándar del sistema con:

✅ Título: "Descartar alterações?"
✅ Mensaje: del CONFIRMATION\_MESSAGES.DISCARD\_CHANGES
✅ Botones: "Descartar" (amarillo) / "Continuar editando" (secundario)
✅ Tipo: warning


3\. AGENDA:
&nbsp;	a) Crear una Página "AgendaPage" e implementar una sistema de agenda que integre con las Audiencias de los processos y con google Calendar. Esta página debe ser la primera a cargar en la Area Administrativa y solo se ve por usuarios logados.

4\. BELL NOTIFICATION - Implementar:

&nbsp;	a) Actividad creada/modificada en agenda, en processos, en clientes, en usuario, en social.
&nbsp;	

vamos hacer una prueba y aplicar AdminPageLayouten la pagina ProcessosPage tambien?

Ahora puedes continuar con:
1\. Implementar el componente visual del calendario en AgendaPage
2\. Crear el modal para crear/editar audiencias
3\. Configurar las credenciales de Google Calendar API


* crear filtros de agenda por Usuario Logado.
* Considerando que cada Audiencia se relaciona con un processo y para cada processo hay un abogado responsable, haz el filtro por esta información.
* Agregar filtro en Agenda por processos\_juridicos


#### TESTES AGENDA:
* El sistema de Agenda debe configurar stats y compromisos listados especìficos para el Abogado o Admin logado. Logica: Cada Abogado o Admin ve solo su propia agenda. Assistente ve la agenda de todos. 
* La parte superior de Agenda donde figura Hoy, fecha, mes | semana ! disa ! lista, cuando seleccionada en "Dia", "Semana", "Mes" se corta al disminuir pantalla, la fecha por extenso se amontona. Necesita mejorar la responsividad en este punto. Tambien quiero invertir el orden para "Lista | Dia | Semana | Mes"
* El bootón "HOY" y las flechitas no reaccionan. El filtro por processo deberia cambiar para filtrar "Audiencias" solo cuando esté en la opcion de lista y selecionar entre mostrar todas, mostrar vencidas y por vencer.
* La opción lista debe iniciar seleccionada por defecto.
* El icono de la hora no aparece en el browser de firefox, pero es insoluble por causa del navegador.
* Quiero que corrija el Modal de Audiencias  para que use el mismo patrón que Procesos (pasando hasUnsavedChanges al FormModal)
* Quiero implementar **polling periódico** a las audiencias de forma completamente transparente para que la base de datos se actualice con la UI sin recargar manualmente la pagina.

*ÁRBOL DE AGENDA:*
src/
  components/
    admin/
      <AudienciasFormModal> //Modal para creación y edición de audiencias
    agenda/
      <CalendarioDia>
      <CalendarioLista>
      <CalendarioMes>
      <CalendarioSemana>
  hooks/
    data-access/
      <useAudiencias>
    forms/  
      <useAudienciaForm>
  pages/
    <AgendaPage> //Abre el modal AudienciasFormModal
  types/
    <Audiencia>
  utils/
    <AudienciaHelpers>



### TESTES CLIENTES
* En el modal "Novo Cliente", el puntero del mouse cambia sobre el input "nome completo" para los tres Roles. No me gusta este cambio del puntero bajo ninguna circustancia. Me gusta dejar inactivo los inputs cuando necesario conforme el campo "Status". Pero en caso de creacion de Nuevo cliente, no cabe.

* Hay parpadeo en los cards de Clientes y creo ser por causa del **polling periódico**. No me quites el polling periodico, pero mejora el asunto de los parpadeos, debe ser silencioso como en audiencias.

* Los documentos de clientes deben ser guardados en el campo Jsonb `documentos_cliente` de la tabla clientes que debe relacionarse con el bucket privado `documentos_cliente`.

* Leer el Documento `docs/RLS_tablas.md` para establecer RLS backend y frontend para la tabla <clientes>. Diagnosticar las triggers y politicas en tabla <clientes> y eliminar las duplicadas. Archivo Modelo para diagnostico <diagnostico-triggers-clientes.sql> 

* ✅ FRONTEND: Formatear inputs en tiempo real para los campos del tipo "VARCHAR" ingresados por el usuario → MAYÚSCULAS, los campos "email" → minúsculas. Los campos tipo "TEXT"(texto libre/comentarios/Descripción/observaciones, etc) y Campos ENUM (opciones predefinidas) → Sin cambios.
  - Implementación: formateo en tiempo real en `handleFormChange`/`handleFieldChange`
  - VARCHAR (nome_completo, cpf, etc.) → MAYÚSCULAS ✨ (inmediato)
  - EMAIL (email, cliente_email) → minúsculas (en onBlur)
  - TEXT (descricao, observacoes, conteudo) → SIN FORMATEAR (como usuario escribe)
  - ENUM (status, role, tipo) → SIN FORMATEAR (predefinidos)
  - Archivo: `src/utils/fieldFormatters.ts`

* Casos Cubiertos:
✅ Crear cliente con CPF/CNPJ existente - Detectado antes de enviar
✅ Editar cliente sin cambiar CPF/CNPJ - Permitido (mismo cliente)
✅ Editar cliente cambiando a CPF/CNPJ existente - Bloqueado con mensaje
✅ Email duplicado - Mensaje específico
✅ Estado civil inválido - Mensaje específico
✅ Fecha inválida - Mensaje específico
✅ Inputs nunca reciben null/undefined (convertidos a '')
✅ BD recibe null para campos opcionales vacíos (gracias a formatFieldValue en submit)

Archivo Modificado:
useClienteForm.ts:150-225 - Validación y manejo de errores mejorados

* FRONTEND: El campo Estado admite solo dos caracteres, esto está bueno para Brasil, pero, para casos que el cliente sea de otro país, y solo si es de otro país, deberia aceptar el nombre completo del estado.

* Me gusta como los campos restrictos en el modal clientes están inactivos y color amarillito. Pero no me gusta el lugar que está la frase "Somente Admin pode alterar". esta frase yo quisiera que utilizar la imagen del candado frente al label como un toolltip on right para entregar este mensaje. Dejar dentro del input solo la información del dato y el color amarillito.



*ÁRBOL DE CLIENTES:*
src/
  components/    
  hooks/
    data-access/
      <useClientes>
    filters/
      <useClienteFilters>
    forms/  
      <useClienteForm> 
  pages/
    <ClientesPage> //Abre el modal AudienciasFormModal
  types/
    <cliente>
 

### TESTES PROCESSOS
* No quiero clase de restricción para el cursor en el modal de "processos" en ninguna circunstancia. Me gusta como los campos restrictos en el modal clientes están inactivos y color amarillito.

* MODAL DE CREAR/EDITAR PROCESSOS: Al seleccionar cliente en el selector de opciones debe cargar automaticamente los campos "email do cliente" y telefone do cliente". Los campos "email do cliente" y telefone do cliente" nunca deben ser cargados manualmente. Deben aparecer unicamente como informativos.

* usar Colapse para el modal crear/editar processos en los campos `Documentos do processo`, `Links do processo` y `Jurisprudencia`.

* Hay parpadeo en los cards cada vez que recarga el **polling periodico**.

* Aparece doble asterisco en los campos restrictivos, uno rojo y otro normal: Problema estaba en el label in ProcessoPage. La constante <RestrictedSelect> dentro de <restrictedFormField> ya trae un asterisco rojo por defecto.

* Vamos a eliminar el toolltip y transferir el mensaje escrito para frente al locker en color amarillo fuerte entre parentesis.

* Vamos a SOLUCIONAR tambien estos casos:
✅ Crear processos con "Numero do Processo" existente - Detectado antes de enviar
✅ Editar processo sin cambiar "Numero do Processo" - Permitido (mismo processo)
✅ Editar processo cambiando a "Numero do Processo" existente - Bloqueado con mensaje
✅ Prioridade, Área do Direito, Polo do Cliente, Status - Mensaje específico
✅ Advogado Responsável, Selecione o Cliente - Mensaje específico
✅ Fecha inválida - Mensaje específico
✅ Inputs nunca reciben null/undefined (convertidos a '')
✅ BD recibe null para campos opcionales vacíos (gracias a formatFieldValue en submit)
✅ Valores numericos nunca recibir "". Ejemplo: valor_causa: number | null (nunca ""), valor_honorarios: number | null (nunca "")

* Los mensajes inline del modal siempre mostrar sobre el campo que provocó el mensaje.

* No me está permitiendo adicionar más de un documento al processo. La consola esta limpia, aparece mensaje de exito, pero el documento 2 no sube.

* El cursor del mouse nunca, hjamás, en ninguna parte del sistema, bajo ninguna circunstancia debe aparecer como <not-allowed>

* UI/UX en Links do Processo en el formulario de crear/editar processo. Mover el boton "Adicionar Link" para mostrar en la misma linea del titulo "Links do Processo" y eliminar el boton "ver" traendo la lista de links guardados al cuerpo del acordeon. Para la responsividad en pantallas menores,  Los botones "Adicionar Link" y "Adicionar Jurisprudencia" se convierte en "+".

* Verificar las RLS y triggers del Backend con la Qry <GENERIC_check-riquered...> y sincronizar Frontend
* Veificar los campos obligatorios del Backend con la Qry <GENERIC_check-rls...> y sincronizar Frontend

* Verificar si hay una regla interna de frontend que impide que el Role: "Assistente" o "Advogado" edita processos que no sean propios. Respuesta: (NO) Restricciones existentes (por campo, no por ownership):🔒 Advogado: No puede editar numero_processo, titulo, advogado_responsavel 🔒 Assistente: No puede editar numero_processo, titulo, advogado_responsavel, status

* Aplicar al modal "Cadastrar Novo Cliente" que abre con el Boton "Novo" al crear nuevo proceso, los mismos patrones del modal principal de clientes "Novo Cliente": formateto de inputs, restriccion de campos, reglas de negocio, validación, etc, sin duplicacion de codigo.

* Es normal que cuando abro la herramienta de inspección (F12) los modales se cierren automaticamente aunque estoy en modo crear/editar? RESPUESTA: No, eso no es normal. (El useEffect que maneja el listener de teclado (Escape) tenía dependencias incorrectas)



### TESTES USUARIOS
#### MODAL NOVO USUARIO: 
  1. La foto del perfil no muestra al cargar archivo o no esta cargando.
  2. UX: El label del input "Nome *" deve explicar al usuario que sera mostrado al logar.
  3. Aplicar los mismos patrones del modal de clientes/Processos: formateto de inputs, restriccion de campos, reglas de negocio, validación, etc, sin duplicacion de codigo. 
  4. FRONTEND: Cambiar opcion "RG" para "DNI" del campo selector "Tipo de Documento". 
  5. BACKEND: Renombrar el campo "Localidade" para "Cidade" y reflejar en el FRONTEND.
  6. NUEVOS CAMPOS - BACKEND y FRONTEND:
    a) equipe: boolean (sim o nao). Frontend: tipo checked
    b) educacao: array para informaciones Exwmplo: [Bacharel em Direito - Universidade Federal do Tocantins (UFT)', 'Especialização em Direito do trabalho, etc].
    c) especialidades: array para informaciones Exemplo: ['Direito Trabalhista', 'Direito eleitoral', etc]
    d) bio: text Exemplo: Dra. Rosimeire Albuquerque possui vasta experiencia em Direito eleitoral, especialmente no ramo de assessoria política. Com a excelência e atendimento humanizado, seus problemas serão resolvidos com clareza e transparencia.'
    El CAMPO `redes_sociais` del Backend va registrar minimamente:
      I) linkedin: cole aqui o link de acesso - Frontend
      II) instagram: cole aqui o link de acesso - Frontend

  ##### Patrones YA implementados
  1. Sistema de formateo automático - formatFormData() de fieldFormatters.ts
    Ya usa formatFormData() en líneas 195, 238, 271
    ✅ VARCHAR → MAYÚSCULAS, email → minúsculas
  2. Detección de cambios no guardados - useUnsavedChanges()
    ✅ Implementado para crear/editar/password
    ✅ hasCreateFormChanges, hasEditFormChanges, hasPasswordFormChanges
  3. FormModal con hasUnsavedChanges
    ✅     ⚠️ Modales usan <FormModal hasUnsavedChanges={...}> - PARCIALMENTE IMPLEMENTADO: Varios campos en modales de usuarios aún usan setFormData() directamente en lugar de handleFieldChange(), evitando la detección de cambios no guardados.
  4. Sistema de notificaciones inline
    ✅ useInlineNotification() implementado
    ✅ Mensajes de error/success/warning
  5. Componente RestrictedFormField: Hice la consulta utilizando el script GENERIC_check-required-fields y estos son los campos obligatorios de la tabla `usuarios` en la base de datos: (copiar jsonb)
  
  6. Validaciones:  
    ✅ Campos con Icono de Candado 🔒:
         Aparecen deshabilitados visualmente (opacity 70%)
         No son editables (pointer-events: none)
         Muestran mensaje de restricción con icono de candado
    ✅ Campos Editables:
         Asterisco rojo (*) para campos requeridos
         Validación HTML5 (required attribute)
         Formateo en tiempo real (email lowercase, nome uppercase)
    ✅ Permisos por Usuario:
         Admin: Puede editar todos los campos de cualquier usuario
         Usuario normal: Solo puede editar sus propios datos básicos (nome, email)
         Role: Solo visible y editable por administradores

* VERIFICACIONES FINALES:
  ✅ 1) Eliminar CNPJ de las opciones del select "Tipo de Documento".
  ✅ 2) Utilizar <getUserDisplayName> de AuthLogin para concatenar (titulo + nombre) en NavBar y ModalView "Detalhes do Usuario" 
  ✅ 3) El campo "Titulo" no debe convertirse en MAYUSCULAS, sino, quedar como el usuario lo digita.
  ✅ 4) FRONTEND: Los datos de los Cards en la página inicial seccion "Especialistas" y de la página "Equipe" deben consumir de la base de datos. Actualmente consume de `teamMemberData` exportado de Data/DataTeamMember. Solo la foto seguirá siendo la de la carpeta Public/images. ¿Cual es la mejor manera?  
  ✅ 5) Solo usuarios de la tabla `usuarios` campo `ativo=true` y `posicao` = "Socio" pueden aparecer en la sección "Especialistas".
  ✅ 6) Solo usuarios de la tabla `usuarios` campo `ativo=true` y `equipe=true` pueden aparecer en la página "Equipe"
  ✅ 7) El layout de los CARDS deben mantenerse como estan.
  ✅ 8) FRONTEND: El campo "senha" debe ser obligatorio.
  ✅ 9) BACKEND Y FRONTEND: Crear el campo `posicao` con las opciones "Socio", "Associado" o "Parceiro". 
  ✅ 10) El campo "posicao" en el modal "Detalhes do Usuário" debe mostrarse en un badge al lado del Role.

* IMAGES_SITE_STATIC - Funcionamiento:
  Especialistas (home): Muestra la primera imagen (images[0])
  Equipe (TeamPage): Muestra la segunda imagen (images[1]) o primera si no hay segunda
  Flexibilidad: Puedes agregar tantas imágenes como quieras al <IMAGE_MAP> en <useTeamMembers.ts>