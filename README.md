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

La configuración utiliza `site: https://yukio-kayaba.github.io` y `base: /zormz---docs`. La raíz `/` redirige a `/zormz---docs/` en el servidor de desarrollo y la vista previa, conservando los parámetros de la URL. Al publicar en GitHub Pages, sirve el contenido de `dist/` en ese repositorio; la raíz del dominio GitHub pertenece a otro sitio y no la controla este repositorio.

## SEO e indexación

Cada página genera título, descripción propia, URL canónica absoluta, metadatos sociales y datos estructurados de ZORMZ. `/zormz---docs/sitemap.xml` se genera automáticamente a partir de la portada y los archivos Markdown de `src/pages/docs/`.

Después de publicar estos cambios:

1. Abre [Google Search Console](https://search.google.com/search-console/) y añade la propiedad de prefijo `https://yukio-kayaba.github.io/zormz---docs/`.
2. Verifica la propiedad con el archivo HTML que proporciona Google, guardándolo en `public/` y publicándolo, o con su etiqueta de verificación en `src/layouts/Layout.astro`. Usa el valor real proporcionado por tu cuenta.
3. Envía `https://yukio-kayaba.github.io/zormz---docs/sitemap.xml` en Sitemaps.
4. Inspecciona la URL de la portada, prueba la URL publicada y pulsa «Solicitar indexación». Revisa después el informe de indexación.
5. Incluye el enlace de documentación en el campo `homepage` del paquete npm y en el README del repositorio de ZORMZ para facilitar el descubrimiento desde enlaces públicos reales.

El archivo robots.txt válido debe estar en `https://yukio-kayaba.github.io/robots.txt`, en el repositorio que controla la raíz del dominio. Un robots.txt dentro de `/zormz---docs/` no controla el rastreo. Si administras ese sitio raíz, comprueba que no bloquea esta documentación y añade `Sitemap: https://yukio-kayaba.github.io/zormz---docs/sitemap.xml` al archivo existente. No reemplaces reglas de otros proyectos sin revisarlas.

La solicitud de indexación requiere tu cuenta verificada. El sitemap y las mejoras de SEO facilitan el rastreo, pero no garantizan posiciones ni aparición inmediata. Referencia: [solicitar un nuevo rastreo a Google](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

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
