---
layout: ../../layouts/Doc.astro
title: Multi funciones
description: Envía varias consultas a la base de datos en una sola request con Batch.
---

Con `Batch` puedes reunir varias operaciones y enviarlas en una sola request a la conexión seleccionada. Por ejemplo: leer pedidos, consultar categorías, insertar registros, actualizar un pedido y volver a leerlo.

Esta es una de las funciones nuevas de ZORMZ. Los ejemplos utilizan las tablas del proyecto y las funciones de inicialización `initBD()` e `initPg()`.

## Batch

`DB.Batch([...])` recibe una lista de consultas preparadas con `.batch()`. También puedes usar `pgConex.Batch([...])` para trabajar desde el objeto de una conexión.

```ts
const lote = DB.Batch([
  DB.Select([pedidos.idpedido]).from(pedidos()).batch(),
  DB.Select([categorias.nombrecategoria]).from(categorias()).batch(),
]);

const respuesta = await lote.exec(true);
```

No se trata de llamar a `execute()` varias veces en un bucle: las consultas se reúnen primero y se envían al ejecutar el lote.

<h2 id="preparar-consultas">Preparar cada consulta con .batch()</h2>

Construye cada operación como de costumbre y termina con `.batch()` en lugar de `.execute()`:

```ts
DB.Select([pedidos.estado]).from(pedidos()).batch();
```

Puedes combinar SELECT, INSERT y UPDATE dentro de la misma lista, como en el ejemplo completo. `.batch()` prepara la operación; `.exec()` ejecuta el conjunto.

## exec

`exec(true)` envía el lote y muestra el SQL generado. Utiliza `await` para obtener sus respuestas:

```ts
const respuesta = await lote.exec(true);
```

El ejemplo no configura una transacción. No presupongas que agrupar consultas implica revertir automáticamente las anteriores si una operación falla.

## MySQL

Este lote realiza cinco operaciones. El último SELECT permite observar los pedidos después de la actualización:

```ts
import { DB, UP, eq } from 'zormz';

async function consultasMysql() {
  const { pedidos, categorias } = generateTables;
  await initBD();

  const fechaUpdate = new Date();
  const fechaBD = fechaUpdate.toISOString().slice(0, 19).replace('T', ' ');

  const responseMysql = await DB.Batch([
    DB.Select([pedidos.estado, pedidos.idpedido, pedidos.fechaconfirmacion])
      .from(pedidos())
      .batch(),
    DB.Select([categorias.nombrecategoria]).from(categorias()).batch(),
    DB.Insert(categorias(), [
      categorias.nombrecategoria,
      categorias.descripcion,
    ])
      .Values([
        ['disponible', 'valor insertado 1'],
        ['disponible', 'valor insertado 2'],
      ])
      .Returning(categorias.idcategoria)
      .batch(),
    DB.Update(pedidos())
      .set([UP(pedidos.fechaconfirmacion, fechaBD)])
      .where(eq(pedidos.idpedido, 1))
      .batch(),
    DB.Select([pedidos.estado, pedidos.idpedido, pedidos.fechaconfirmacion])
      .from(pedidos())
      .batch(),
  ]).exec(true);

  console.log('MYSQL : ', responseMysql);
}
```

El formato de `fechaBD` sigue tu ejemplo: parte de una fecha ISO en UTC y elimina su indicador de zona. Su interpretación al guardarla depende de la configuración temporal de la base.

## PostgreSQL

La misma secuencia puede construirse desde `pgConex`. En tu ejemplo, el texto de las descripciones insertadas cambia para distinguir las pruebas:

```ts
import { UP, eq } from 'zormz';

async function consultasPg() {
  const { pedidos, categorias } = generateTables;
  const pgConex = await initPg();

  const fechaUpdate = new Date();
  const fechaBD = fechaUpdate.toISOString().slice(0, 19).replace('T', ' ');

  const responsePg = await pgConex
    .Batch([
      pgConex
        .Select([pedidos.estado, pedidos.idpedido, pedidos.fechaconfirmacion])
        .from(pedidos())
        .batch(),
      pgConex.Select([categorias.nombrecategoria]).from(categorias()).batch(),
      pgConex
        .Insert(categorias(), [
          categorias.nombrecategoria,
          categorias.descripcion,
        ])
        .Values([
          ['disponible', 'esto es una prueba de agregado en multiple 1'],
          ['disponible', 'esto es una prueba de agregado en multiple 2'],
        ])
        .Returning(categorias.idcategoria)
        .batch(),
      pgConex
        .Update(pedidos())
        .set([UP(pedidos.fechaconfirmacion, fechaBD)])
        .where(eq(pedidos.idpedido, 1))
        .batch(),
      pgConex
        .Select([pedidos.estado, pedidos.idpedido, pedidos.fechaconfirmacion])
        .from(pedidos())
        .batch(),
    ])
    .exec(true);

  console.log('PG : ', responsePg);
}
```

Puedes ejecutar ambas funciones desde tu flujo de pruebas, una después de la otra. Cada lote se envía a su propia conexión; no agrupa operaciones de las dos bases en una única request compartida.

## Respuestas

Las posiciones del array de respuestas corresponden al orden de las operaciones del lote:

```ts
const [
  pedidosAntes,
  categoriasLeidas,
  idsInsertados,
  filasAfectadas,
  pedidosDespues,
] = responseMysql;
```

En el registro compartido del proyecto se observaron estas respuestas:

| Posición | Operación              | MySQL             | PostgreSQL        |
| -------- | ---------------------- | ----------------- | ----------------- |
| `0`      | SELECT pedidos antes   | Array de objetos. | Array de objetos. |
| `1`      | SELECT categorías      | Array de objetos. | Array de objetos. |
| `2`      | INSERT con Returning   | `[39, 40]`        | `[22, 23]`        |
| `3`      | UPDATE pedido          | `[1]`             | `1`               |
| `4`      | SELECT pedidos después | Array de objetos. | Array de objetos. |

Los IDs y los datos pertenecen a aquella ejecución; no son valores fijos. En ese registro, UPDATE presenta una diferencia de estructura entre motores que debes tener en cuenta al consumir la posición `3`.

En el pedido `1`, el registro de consola muestra este cambio de fecha en ambos motores:

```text
Antes:   2026-10-21T09:01:22.000Z
Después: 2026-10-21T09:03:06.000Z
```

Para preparar cada operación por separado, revisa [SELECT](/docs/select/), [INSERT](/docs/insert/) y [UPDATE](/docs/update/).
