---
layout: ../../layouts/Doc.astro
title: Instalación
description: Agrega ZORMZ a tu proyecto y empieza a trabajar desde TypeScript.
---

## Instala el paquete

Desde la terminal de tu proyecto, ejecuta:

```bash
npm install zormz
```

ZORMZ permite trabajar con MySQL y PostgreSQL. Antes de ejecutar consultas, configura una conexión a tu base de datos.

## Importación ESM

Importa las herramientas que necesitas para tu consulta:

```ts
import { DB, getConexion, eq } from 'zormz';
import type { connecionLocal } from 'zormz';
```

## Importación CommonJS

Si tu proyecto utiliza CommonJS, puedes usar `require`:

```js
const { DB, getConexion, eq } = require('zormz');
```

## ¿Qué sigue?

Configura el motor y los datos de acceso en la [guía de conexiones](/docs/conexiones/). Después podrás explorar cada operación por separado en los ejemplos de consultas.

> Primera versión de la documentación. Los ejemplos se basan en el material disponible del proyecto; la referencia completa de la API se incorporará más adelante.
