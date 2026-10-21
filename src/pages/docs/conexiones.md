---
layout: ../../layouts/Doc.astro
title: Conexiones
description: Elige tu motor y conecta ZORMZ con tu base de datos.
---

## MySQL

Usa `connecionLocal` para definir el host, puerto y credenciales. El identificador del motor es `"mysql"`.

```ts
import { getConexion } from 'zormz';
import type { connecionLocal } from 'zormz';

const conexionMysql: connecionLocal = {
  database: 'pruebas',
  host: 'localhost',
  password: 'TU_PASSWORD',
  port: 3306,
  user: 'root',
};

const mysql = getConexion('mysql', conexionMysql);
```

## PostgreSQL

Para PostgreSQL utiliza el identificador `"pg"` y el puerto de tu servidor:

```ts
import { getConexion } from 'zormz';
import type { connecionLocal } from 'zormz';

const conexionPg: connecionLocal = {
  database: 'pruebas',
  host: 'localhost',
  password: 'TU_PASSWORD',
  port: 5432,
  user: 'postgres',
};

const pg = getConexion('pg', conexionPg);
```

Sustituye los valores de ejemplo por los de tu entorno. Mantén las credenciales reales fuera del código compartido.

## Cadena de conexión

El material del proyecto también incluye el tipo `connecionRed` para representar una cadena de conexión:

```ts
import type { connecionRed } from 'zormz';

const configuracion: connecionRed = {
  connectionString: 'postgresql://USUARIO:PASSWORD@localhost:5432/pruebas',
};
```

## Conserva tu conexión

Puedes guardar el objeto que devuelve `getConexion` y utilizarlo más adelante. Esto permite trabajar con varias conexiones; consulta la [guía de múltiples conexiones](/docs/multiples-conexiones/).
