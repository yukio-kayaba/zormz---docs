# ZORMZ Docs

Primera versión de la documentación en español de ZORMZ, construida en Astro y adaptada de [Astro Keel](https://github.com/kpab/astro-keel) (MIT). Conserva las fuentes, los tokens de color y la base de estilos de Keel.

## Desarrollo

```bash
npm install
npm run dev
```

## Producción

```bash
npm run build
npm run preview
```

La configuración utiliza `site: https://yukio-kayaba.github.io` y `base: /zormz-docs`. La raíz `/` redirige a `/zormz-docs/` en el servidor de desarrollo y la vista previa, conservando los parámetros de la URL. Al publicar en GitHub Pages, sirve el contenido de `dist/` en ese repositorio; la raíz del dominio GitHub pertenece a otro sitio y no la controla este repositorio.

Starlight está integrado con título ZORMZ y logo Z. Las guías conservan sus rutas y layouts personalizados en `src/pages/docs/`; todavía no utilizan las colecciones `docs` e `i18n` de Starlight, por lo que Astro informa de ellas como vacías al compilar.

No se requiere una base de datos para mostrar la documentación. Se usa Astro con CSS puro.

## Organización

- `src/pages/docs/`: contenido Markdown de las guías y referencias.
- `src/pages/index.astro`: portada.
- `src/layouts/`: estructura general y estructura de las guías.
- `src/components/DocsSidebar.astro`: menú desplegable de la documentación.
- `src/data/navigation.ts`: guías, métodos y orden de navegación.
- `src/scripts/`: cambio de tema y comportamiento compartido de copiar código.
- `src/components/ZMotion.astro`: Z decorativa que serpentea y forma la letra, con pausa y soporte de movimiento reducido.
- `src/styles/home.css`: diseño de la portada, tarjetas de ventajas y animación con profundidad.
- `src/styles/docs.css`: entrada de estilos; importa la base Keel y los archivos de sitio, documentación, código y responsive.

Ejecuta `npm run format` para formatear el código o `npm run format:check` para comprobarlo.

La documentación cubre instalación, conexiones, consultas, Tables, SELECT, INSERT, UPDATE y Multi funciones (Batch). Tables explica las definiciones invocables, las referencias y métodos de columnas, los alias y $columns. Las referencias muestran cómo reutilizar una consulta con MySQL y PostgreSQL. UPDATE incluye la clase UpdateManage. El menú lateral sigue la sección visible al desplazarse y reconoce enlaces con fragmentos. Generar tablas y Eliminar tablas incluyen ejemplos para ambos motores y conexiones explícitas. La referencia de funciones queda para la siguiente etapa. Los ejemplos son documentación ilustrativa basada en el material proporcionado; no se ejecutan contra una base de datos en este sitio.

La referencia de Batch documenta `.batch()` y `.exec()`, incluye la secuencia de cinco operaciones para MySQL y PostgreSQL y sus respuestas observadas. El lote no se presenta como una transacción.
