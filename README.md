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

No se requiere una base de datos para mostrar la documentación. Se usa Astro con CSS puro.

## Organización

- `src/pages/docs/`: contenido Markdown de las guías y referencias.
- `src/pages/index.astro`: portada.
- `src/layouts/`: estructura general y estructura de las guías.
- `src/components/DocsSidebar.astro`: menú desplegable de la documentación.
- `src/data/navigation.ts`: guías, métodos y orden de navegación.
- `src/scripts/`: cambio de tema y comportamiento compartido de copiar código.
- `src/styles/docs.css`: entrada de estilos; importa la base Keel y los archivos de sitio, documentación, código y responsive.

Ejecuta `npm run format` para formatear el código o `npm run format:check` para comprobarlo.

La documentación cubre instalación, conexiones, consultas, SELECT, INSERT y UPDATE. Las referencias muestran cómo reutilizar una consulta con MySQL y PostgreSQL. UPDATE incluye la clase UpdateManage. El menú lateral sigue la sección visible al desplazarse y reconoce enlaces con fragmentos. Funciones y generación de tablas quedan para la siguiente etapa. Los ejemplos son documentación ilustrativa basada en el material proporcionado; no se ejecutan contra una base de datos en este sitio.
