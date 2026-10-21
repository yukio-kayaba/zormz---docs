---
layout: ../../layouts/Doc.astro
title: Generar tablas
description: Crea la estructura de tus tablas en MySQL y PostgreSQL a partir de las mismas definiciones.
---

`defineTable()` describe las tablas en TypeScript. Para crear su estructura en la base de datos, utiliza `generateTable()` o el método `GenerateTable()` de una conexión.

Los ejemplos usan el objeto `generateTables` del proyecto, explicado en [Tables](/docs/tables/). `initBD()` inicializa MySQL e `initPg()` devuelve el objeto de conexión PostgreSQL; ambas son funciones de tu aplicación.

## Parámetros

```ts
await generateTable(tabla, columnas, seeSQL, conexion);
```

| Parámetro  | Qué recibe                                                     |
| ---------- | -------------------------------------------------------------- |
| `tabla`    | Nombre de la tabla. Por ejemplo, `pedidos()`.                  |
| `columns`  | Definiciones de las columnas. Por ejemplo, `pedidos.$columns`. |
| `seeSQL`   | Opcional. `true` muestra el SQL generado.                      |
| `conexion` | Opcional. Conexión explícita para esta generación.             |

`pedidos()` identifica la tabla y `pedidos.$columns` proporciona su estructura. Este último argumento no contiene filas ni resultados de consultas.

## Una tabla en MySQL

```ts
import { generateTable } from 'zormz';

await initBD();
const { pedidos } = generateTables;

await generateTable(pedidos(), pedidos.$columns, true);
```

Aquí se utiliza la conexión MySQL inicializada para el proyecto.

## Una tabla en PostgreSQL

Puedes llamar al método de la conexión para indicar directamente dónde se creará la tabla:

```ts
const conexPg = await initPg();
const { pedidos } = generateTables;

await conexPg.GenerateTable(pedidos(), pedidos.$columns, true);
```

Respeta las mayúsculas: la función importada se llama `generateTable` y el método de la conexión se llama `GenerateTable`.

## Varias tablas en ambos motores

Este es el flujo de generación utilizado en el proyecto. Cada `await` termina antes de continuar con la siguiente tabla:

```ts
async function generar() {
  await initBD(); // MySQL.
  const conexPg = await initPg(); // PostgreSQL.

  const { pedidos, categorias, productoPrueba, permisos } = generateTables;

  await generateTable(pedidos(), pedidos.$columns, true);
  await generateTable(categorias(), categorias.$columns, true);
  await generateTable(productoPrueba(), productoPrueba.$columns, true);
  await generateTable(permisos(), permisos.$columns, true);

  console.log('aqui sigue PG');
  await conexPg.GenerateTable(pedidos(), pedidos.$columns, true);
  await conexPg.GenerateTable(categorias(), categorias.$columns, true);
  await conexPg.GenerateTable(productoPrueba(), productoPrueba.$columns, true);
  await conexPg.GenerateTable(permisos(), permisos.$columns, true);
}

// Ejecuta esta función desde el punto de entrada de tu proyecto.
// await generar();
```

Se reutilizan las mismas definiciones para los dos motores. Cada llamada actúa sobre su propia base de datos.

## Variación: conexión explícita

La función importada también acepta una conexión como cuarto argumento:

```ts
const conexPg = await initPg();
const { categorias } = generateTables;

await generateTable(
  categorias(),
  categorias.$columns,
  true,
  conexPg.getConexion(),
);
```

Puedes usar esta forma o `conexPg.GenerateTable(...)` según cómo organices tu aplicación.

## Variación: recorrer una lista de tablas

Si prefieres evitar llamadas repetidas, reúne las tablas y recórrelas manteniendo la ejecución secuencial:

```ts
await initBD();
const conexPg = await initPg();
const { pedidos, categorias, productoPrueba, permisos } = generateTables;
const tablas = [pedidos, categorias, productoPrueba, permisos];

for (const tabla of tablas) {
  await generateTable(tabla(), tabla.$columns, true);
}

for (const tabla of tablas) {
  await conexPg.GenerateTable(tabla(), tabla.$columns, true);
}
```

Para retirar la estructura de una tabla, consulta [Eliminar tablas](/docs/eliminar-tablas/).
