# 🐾 Paseandog

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-orange)
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Inertia](https://img.shields.io/badge/Inertia.js-2-9553E9)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3FCF8E?logo=supabase&logoColor=white)
![Render](https://img.shields.io/badge/deploy-Render-46E3B7?logo=render&logoColor=black)

**Planificador del cuidado del perro.** A partir de los datos del perro y del horario del dueño, el core de Paseandog genera una agenda semanal de salidas, comidas y paseos.

🔗 **App en línea:** https://paseandog.onrender.com
🎥 **Video de la entrega:** _(agregar el link de Loom o YouTube)_

---

## 📑 Índice

1. [Descripción del proyecto](#-descripción-del-proyecto)
2. [Estado del proyecto](#-estado-del-proyecto)
3. [Funcionalidades](#-funcionalidades)
4. [Cómo la administración alimenta al core](#-cómo-la-administración-alimenta-al-core)
5. [Requisitos de la entrega](#-requisitos-de-la-entrega)
6. [Acceso al proyecto](#-acceso-al-proyecto)
7. [Tecnologías utilizadas](#-tecnologías-utilizadas)
8. [Arquitectura](#-arquitectura)
9. [Modelo de datos de la administración](#-modelo-de-datos-de-la-administración)
10. [Persona desarrolladora](#-persona-desarrolladora)
11. [Licencia](#-licencia)

---

## 📖 Descripción del proyecto

Paseandog ayuda a los dueños a organizar el cuidado diario de sus perros. Su core, el servicio **`PlanificadorAgenda`**, recorre los datos del perro (edad, raza, peso y enfermedades) y el horario del dueño, y genera una agenda semanal con:

- **Salidas para las necesidades**, según la edad del perro.
- **Comidas**, con la porción calculada por peso.
- **Paseos**, hasta completar los minutos que necesita su raza.
- **Compensaciones** cuando un paseo queda incompleto, y **alternativas** cuando el dueño no está.

El core no inventa estas reglas: las lee de la base de datos. Las carga el **administrador**, desde la aplicación.

Proyecto final de **Ingeniería Web**, Universidad de las Américas (UDLA).

## 🚧 Estado del proyecto

| Módulo | Estado |
|---|---|
| Administración (catálogos que alimentan al core) | ✅ Terminado |
| Gestión de usuarios | ✅ Terminado |
| Deploy en Render | ✅ Terminado |
| Módulos del dueño (perros, horario, contactos) | 🔄 En desarrollo |
| Core `PlanificadorAgenda` y reporte de cumplimiento | 🔄 En desarrollo |

## ✨ Funcionalidades

### Administración
- **CRUD de 6 catálogos:** razas, etapas, enfermedades, dietas, actividades de compensación y alternativas en casa.
- **Gestión de usuarios:** consultar, modificar y suspender. Un usuario suspendido no puede iniciar sesión, y el administrador no puede suspenderse a sí mismo.
- **Acceso solo para el administrador:** las rutas `/admin/*` están protegidas con el middleware propio `EsAdmin`. Un dueño que intente entrar recibe un error 403.
- **Validaciones en el back-end** en todos los formularios, con mensajes en español.
- **Integridad de los datos:** no se puede borrar una etapa o una enfermedad que una dieta esté usando.

### Autenticación
- Registro, inicio de sesión y cierre de sesión con el starter kit oficial de Laravel, extendido con **roles** (`admin` y `dueno`) y **suspensión de cuentas**.

## 🔗 Cómo la administración alimenta al core

El administrador no carga datos de un perro en particular, sino **las reglas que el core aplica a los perros de todos los dueños**:

| Catálogo | Qué le da al core |
|---|---|
| **Razas** | Los minutos de paseo al día de cada perro |
| **Etapas** | Según la edad, cada cuántas horas sale el perro y cuántas salidas necesita al día |
| **Enfermedades** | Si limitan la intensidad de los paseos o acortan el intervalo entre salidas |
| **Dietas** | Según la etapa y la enfermedad, cuántas comidas y qué porción por kilo |
| **Actividades de compensación** | Con qué compensar un paseo incompleto. El factor de equivalencia convierte sus minutos en minutos de paseo |
| **Alternativas en casa** | Qué usar cuando el dueño no está: el patio para las necesidades o el dispensador para la comida |

## ✅ Requisitos de la entrega

| Requisito | Cómo se cumple |
|---|---|
| **1. Validación en el back-end de un dato sensible** | Los **rangos de edad de las etapas no se pueden cruzar**. Si se cruzaran, un perro caería en dos etapas y el core no sabría qué intervalo ni cuántas salidas aplicar. La validación está en `EtapaController` y compara contra las etapas guardadas en la base, algo que el navegador no puede hacer. Al editar, la etapa se excluye de la comparación. |
| **2. Dropdowns para las llaves foráneas** | La **dieta** depende de una **etapa** (obligatoria) y de una **enfermedad** (opcional). Ninguna se escribe a mano: se eligen en **dropdowns cargados desde la base**, en **cascada**. Al elegir la etapa, el dropdown de enfermedad solo muestra las que todavía no tienen dieta en esa etapa. En el back-end se valida con `exists` y se impide repetir una combinación. |
| **3. Código en Git, con README, y desplegado** | Este repositorio, y la app en línea en **Render**. |

## 🚀 Acceso al proyecto

### En línea
👉 **https://paseandog.onrender.com**

> El plan gratuito de Render se suspende tras unos minutos sin visitas. La primera carga puede tardar entre 30 y 60 segundos.

### En local

**Requisitos:** PHP 8.2 o superior (con las extensiones `pdo_pgsql` y `pgsql`), Composer, Node.js 18 o superior y una base de datos PostgreSQL.

```bash
# 1. Clonar el repositorio
git clone https://github.com/intimatute06/paseandog.git
cd paseandog

# 2. Instalar las dependencias
composer install
npm install

# 3. Configurar el entorno
cp .env.example .env
php artisan key:generate
```

En el `.env`, configurar la conexión a PostgreSQL y el idioma:

```env
APP_LOCALE=es
DB_CONNECTION=pgsql
DB_HOST=...
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=...
DB_PASSWORD=...
```

```bash
# 4. Crear las tablas
php artisan migrate

# 5. Levantar el proyecto
composer run dev
```

La app queda en **http://localhost:8000**.

**Crear el administrador:** registrarse en `/register` y cambiar la columna `rol` de ese usuario a `admin` en la base de datos. Hay un solo administrador; el resto de usuarios se registran como dueños.

## 🛠️ Tecnologías utilizadas

| Capa | Tecnología |
|---|---|
| Back-end | [Laravel](https://laravel.com) (PHP 8.4) |
| Front-end | [React](https://react.dev) con TypeScript, conectado con [Inertia.js](https://inertiajs.com) |
| Estilos | [Tailwind CSS](https://tailwindcss.com) |
| Base de datos | PostgreSQL en [Supabase](https://supabase.com) |
| Autenticación | Starter kit oficial de Laravel con React |
| Traducciones | [Laravel Lang](https://laravel-lang.com) (español) |
| Deploy | [Render](https://render.com) con Docker |

## 🏗️ Arquitectura

El proyecto sigue el patrón **MVC**:

| Capa | Dónde | Responsabilidad |
|---|---|---|
| **Modelo** | `app/Models` | Modelos Eloquent con sus relaciones. La estructura de la base se crea con migraciones (`database/migrations`). |
| **Vista** | `resources/js/pages` | Páginas de React. Inertia les pasa los datos del controlador como props. |
| **Controlador** | `app/Http/Controllers/Admin` | Reciben las peticiones, validan en el back-end y guardan. |

**Otros archivos clave:**

- `app/Http/Middleware/EsAdmin.php`: restringe las rutas de la administración al rol `admin`.
- `routes/web.php`: grupo de rutas del administrador, protegido con `auth` y `admin`.
- `resources/js/components/app-sidebar.tsx`: barra lateral que muestra la sección Administración solo al administrador.
- `Dockerfile`: instala PHP y Node, compila el front-end y corre las migraciones al arrancar en Render.

## 🗃️ Modelo de datos de la administración

| Tabla | Columnas principales | Reglas |
|---|---|---|
| `razas` | nombre, tamaño, nivel de energía, minutos de paseo al día | Nombre único |
| `etapas` | nombre, edad mínima y máxima (meses), intervalo máximo (horas), salidas mínimas al día | Nombre único y rangos de edad sin cruces |
| `enfermedades` | nombre, descripción, intensidad máxima, intervalo máximo, restricción alimentaria | Nombre único; los demás campos son opcionales |
| `dietas` | etapa, enfermedad, comidas al día, porción por kg, recomendaciones | Llaves foráneas a `etapas` y `enfermedades`; una sola dieta por combinación |
| `actividades_compensacion` | nombre, tipo, duración, intensidad, factor de equivalencia, instrucciones | Factor entre 0,1 y 5 |
| `alternativas` | nombre, aplica a (necesidades o comida), instrucciones | Nombre único |

**Convenciones de los datos:**

- **Tamaño de la raza:** según el peso adulto típico. Pequeño, menos de 10 kg; mediano, de 10 a 25 kg; grande, más de 25 kg.
- **Intervalos:** en horas decimales. Por ejemplo, 2.5 equivale a 2 horas y 30 minutos.
- **Factor de equivalencia:** minutos equivalentes = duración de la actividad × factor. Por ejemplo, 10 minutos de olfato con factor 1,5 equivalen a 15 minutos de paseo.

## 👤 Persona desarrolladora

**Inti Matute**
Estudiante de Ingeniería de Software, Universidad de las Américas (UDLA).
GitHub: [@intimatute06](https://github.com/intimatute06)

## 📄 Licencia

Proyecto académico desarrollado para la materia de Ingeniería Web. Sin licencia de uso abierto.
