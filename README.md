# 5Fantasticos_Front

Mocks iniciales en: https://www.figma.com/files/team/1545877980135630273/project/446795619/5Fantasticos_Mock_Interface?fuid=1545890805473909395

Integrantes:
- KAROL ESTEFANY ESTUPIÑAN VIANCHA 

- SERGIO ALEJANDRO IDARRAGA TORRES 

- JULIAN DAVID CASTIBLANCO REAL 

- SANTIAGO CARMONA PINEDA 

- JUAN CARLOS LEAL CRUZ 

# 🚀 Estrategia de Versionamiento y Branching

## 📋 Tabla de Contenidos
- [🌳 Estrategia de Ramas (Git Flow)](#-estrategia-de-ramas-git-flow)
- [🏷️ Tipos de Ramas](#️-tipos-de-ramas)
- [📝 Convenciones de Nomenclatura](#-convenciones-de-nomenclatura)
- [💬 Convenciones de Commits](#-convenciones-de-commits)

---

## 🌳 Estrategia de Ramas (Git Flow)

> Utilizamos **GitFlow**, un modelo de ramificación robusto que nos permite mantener un desarrollo organizado y controlado.

![GitFlow](docs/images/gitflow.webp)

### ¿Por qué GitFlow?
- ✅ **Desarrollo paralelo:** Múltiples funcionalidades simultáneamente
- ✅ **Releases controlados:** Versiones estables y predecibles  
- ✅ **Hotfixes rápidos:** Corrección inmediata de bugs críticos
- ✅ **Historial limpio:** Trazabilidad completa del código

---

## 🏷️ Tipos de Ramas

### 🎯 `main`
> **Rama de producción** - Código estable y listo para despliegue

| **Aspecto** | **Descripción** |
|-------------|-----------------|
| **🎯 Propósito** | Rama estable con versión final (producción/demo) |
| **📥 Recibe de** | `release/*` y `hotfix/*` únicamente |
| **🏷️ Tags** | Cada merge crea un tag SemVer (`vX.Y.Z`) |
| **🔒 Protección** | PR obligatorio + 1-2 aprobaciones + CI verde |

### 🔧 `develop`  
> **Rama de integración** - Base para nuevas funcionalidades

| **Aspecto** | **Descripción** |
|-------------|-----------------|
| **🎯 Propósito** | Integración continua de trabajo en desarrollo |
| **📥 Recibe de** | `feature/*` y merges de `release/*` |
| **🔒 Protección** | Mismas reglas que `main` |

### ⚡ `feature/*`
> **Ramas de funcionalidad** - Desarrollo de nuevas características

| **Aspecto** | **Descripción** |
|-------------|-----------------|
| **🎯 Propósito** | Desarrollo de funcionalidades, refactors o spikes |
| **🌱 Base** | `develop` |
| **🔄 Cierre** | Merge a `develop` mediante PR |

### 🚀 `release/*`
> **Ramas de preparación** - Estabilización pre-despliegue

| **Aspecto** | **Descripción** |
|-------------|-----------------|
| **🎯 Propósito** | Congelar cambios, testing final, correcciones menores |
| **🌱 Base** | `develop` |
| **🔄 Cierre** | Merge a `main` (con tag) **Y** merge a `develop` |
| **📝 Ejemplo** | `release/1.3.0` |

### 🔥 `hotfix/*`
> **Ramas de emergencia** - Corrección urgente de bugs críticos

| **Aspecto** | **Descripción** |
|-------------|-----------------|
| **🎯 Propósito** | Corregir bugs **críticos** en producción |
| **🌱 Base** | `main` |
| **🔄 Cierre** | Merge a `main` (con tag PATCH) **Y** merge a `develop` |
| **📝 Ejemplos** | `hotfix/fix-login-crash` |

---

## 📝 Convenciones de Nomenclatura

### 🌟 **Feature Branches**

```bash
feature/[nombre-funcionalidad]-sirha_[codigo-jira]
```

**Ejemplos:**
```bash
✅ feature/login-validation-sirha_34
✅ feature/student-dashboard-sirha_67  
✅ feature/api-optimization-sirha_89
```

**Reglas:**
- 🔤 **kebab-case** (palabras separadas por guiones)
- 📏 Máximo **50 caracteres**
- 📋 Descripción **clara y específica**
- 🎫 Código Jira **obligatorio** para trazabilidad

### 🚀 **Release Branches**

```bash
release/[version]
```

**Ejemplos:**
```bash
✅ release/1.3.0
✅ release/2.0.0-beta
```

### 🔥 **Hotfix Branches**

```bash
hotfix/[descripcion-breve-del-fix]
```

**Ejemplos:**
```bash
✅ hotfix/fix-login-crash
✅ hotfix/security-patch
✅ hotfix/database-connection-error
```

---

## 💬 Convenciones de Commits

### 📐 **Formato Estándar**

```bash
[codigo-jira] [tipo]: [descripción específica de la acción]
```

### 🏷️ **Tipos de Commit**

| Tipo | Emoji | Descripción | Ejemplo |
|------|-------|-------------|---------|
| `feat` | ✨ | Nueva funcionalidad | `34-feat: agregar validación de email` |
| `fix` | 🐛 | Corrección de errores | `35-fix: corregir error de navegación` |
| `docs` | 📚 | Cambios en documentación | `36-docs: actualizar README` |
| `style` | 💄 | Formato/estilo (no funcional) | `37-style: mejorar indentación CSS` |
| `refactor` | ♻️ | Refactorización sin cambios funcionales | `38-refactor: optimizar función login` |
| `test` | 🧪 | Agregar o modificar tests | `39-test: agregar tests unitarios` |
| `chore` | 🔧 | Tareas de mantenimiento | `40-chore: actualizar dependencias` |

### ✅ **Buenos Ejemplos**
```bash
git commit -m "26-feat: agregar validación de email en formulario login"
git commit -m "24-fix: corregir error de navegación en header mobile"  
git commit -m "28-test: agregar tests unitarios para servicio usuario"
git commit -m "30-docs: actualizar documentación de API endpoints"
```

### ❌ **Ejemplos a Evitar**
```bash
git commit -m "23-feat: agregar login"           # Muy genérico
git commit -m "24-fix: arreglar bug"             # Sin contexto
git commit -m "cambios varios"                   # Sin código Jira ni tipo
```

### 📋 **Reglas de Commits Específicos**

| # | Regla | Descripción |
|---|-------|-------------|
| 1 | **Un commit = Una acción** | Cada commit representa un cambio lógico completo |
| 2 | **Máximo 72 caracteres** | Legible en todas las herramientas Git |
| 3 | **Usar imperativo** | "agregar", "corregir" (no "agregado", "corrigiendo") |
| 4 | **Ser descriptivo** | Especificar QUÉ se cambió y DÓNDE |
| 5 | **Commits frecuentes** | Muchos commits pequeños > pocos grandes |

### 🎯 **Beneficios de Commits Específicos**

- 🔄 **Rollback preciso:** Revertir solo la parte problemática
- 🔍 **Debugging eficiente:** Identificar cuándo se introdujo un bug  
- 📖 **Historial legible:** Entender la evolución del código
- 🤝 **Colaboración mejorada:** Reviews más fáciles y claras

---
