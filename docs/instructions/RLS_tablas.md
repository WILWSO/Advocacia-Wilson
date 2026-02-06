# RLS DE LAS TABLAS EN DATABASE - OFICIAL

## RELGAS GENERALES
1. 
  
## 1. TABLA <clientes> 
### RLS 
1. Roles `Admin`, `Advogado` y `Assistente` pueden SELECT, INSERT, UPDATE
2. Solo Role `Admin` puede DELETE
SOLO FRONTEND: Restricción de UPDATE en los campos `nome_completo`, `status` para Roles `Advogado` y `Assistente`



