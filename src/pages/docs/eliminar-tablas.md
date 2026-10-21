---
layout: ../../layouts/Doc.astro
title: Eliminar tablas
description: Elimina la estructura de una tabla desde la conexión configurada o desde una conexión explícita.
---

`dropTable()` elimina una tabla de la base de datos. También puedes usar `DropTable()` desde el objeto de una conexión.

Esta operación elimina la estructura y sus datos. Para eliminar solamente registros conservando la tabla, utiliza `DB.Delete()`.

## Parámetros

```ts
await dropTable(nombreTabla, conexion);
```

| Parámetro     | Qué recibe                                                        |
| ------------- | ----------------------------------------------------------------- |
| `nombreTabla` | Nombre de la tabla que se eliminará. Por ejemplo, `categorias()`. |
| `conexion`    | Opcional. Conexión explícita donde se eliminará la tabla.         |

No necesitas pasar `$columns`: para eliminar se proporciona el nombre de la tabla.

## Una tabla en MySQL

```ts
import { dropTable } from 'zormz';

await initBD();
const { categorias } = generateTables;

await dropTable(categorias());
```

`initBD()` es la función de tu proyecto que configura MySQL. `generateTables` contiene las definiciones presentadas en [Tables](/docs/tables/).

## Una tabla en PostgreSQL

```ts
const conexPg = await initPg();
const { categorias } = generateTables;

await conexPg.DropTable(categorias());
```

`initPg()` devuelve el objeto de conexión del proyecto. La función importada se llama `dropTable`; el método de la conexión se escribe `DropTable`.

## Varias tablas en ambos motores

Este ejemplo sigue tu flujo: primero elimina las tablas en PostgreSQL y después en MySQL.

```ts
async function eliminarTablas() {
  await initBD();
  const conexPg = await initPg();
  const { categorias, productoPrueba, permisos, pedidos } = generateTables;

  await conexPg.DropTable(categorias());
  await conexPg.DropTable(productoPrueba());
  await conexPg.DropTable(permisos());
  await conexPg.DropTable(pedidos());

  console.log('aqui sigue MYSQL');
  await dropTable(categorias());
  await dropTable(productoPrueba());
  await dropTable(permisos());
  await dropTable(pedidos());
}

// Ejecuta esta función únicamente cuando quieras eliminar estas tablas.
// await eliminarTablas();
```

Cada llamada se ejecuta en su base de datos. Si tu esquema tiene dependencias entre tablas, adapta el orden de eliminación a esas relaciones.

## Variación: conexión explícita

La función importada permite seleccionar una conexión como segundo argumento:

```ts
const conexPg = await initPg();
const { pedidos } = generateTables;

await dropTable(pedidos(), conexPg.getConexion());
```

Esta forma permite elegir la base sin depender de la conexión configurada para la función global.

## Variación: recorrer una lista de tablas

```ts
await initBD();
const conexPg = await initPg();
const { categorias, productoPrueba, permisos, pedidos } = generateTables;
const tablas = [categorias, productoPrueba, permisos, pedidos];

for (const tabla of tablas) {
  await conexPg.DropTable(tabla());
}

for (const tabla of tablas) {
  await dropTable(tabla());
}
```

Para volver a crear las estructuras desde tus definiciones, consulta [Generar tablas](/docs/generar-tablas/).
