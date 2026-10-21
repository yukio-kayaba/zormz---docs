---
layout: ../../layouts/Doc.astro
title: Consultas
description: Un ejemplo por operación. Construye tu consulta paso a paso.
---

> Estos fragmentos usan tablas ya definidas: `categorias`, `pedidos` y `productoPrueba`, presentes en los ejemplos del proyecto. Requieren una conexión configurada y los imports correspondientes de ZORMZ. La definición y generación de tablas se documentará en la siguiente etapa.

## Leer registros · SELECT

Consulta la [referencia de SELECT](/docs/select/) para explorar `from`, `where`, las uniones, la ordenación y la paginación. También puedes desplegar SELECT en el menú lateral.

Selecciona columnas, indica la tabla y aplica una condición:

```ts
const datos = await DB.Select([
  categorias.idcategoria,
  categorias.nombrecategoria,
])
  .from(categorias())
  .where(eq(categorias.idcategoria, 1))
  .execute();
```

Para seleccionar sin enumerar las columnas:

```ts
const datos = await DB.Select().from(categorias()).execute();
```

## Insertar registros · INSERT

En la [referencia de INSERT](/docs/insert/) encontrarás cada paso por separado: columnas, `Values`, inserción múltiple, `Returning` y conexiones.

Indica las columnas y agrega las filas en el mismo orden. `Values` permite insertar varios registros:

```ts
const resultado = await DB.Insert(categorias(), [
  categorias.nombrecategoria,
  categorias.descripcion,
])
  .Values([
    ['disponible', 'Accesorios para celulares'],
    ['data', 'Cables y cargadores'],
  ])
  .Returning(categorias.idcategoria)
  .execute();
```

## Actualizar registros · UPDATE

La [referencia de UPDATE](/docs/update/) explica la clase `UpdateManage`, la alternativa con `UP`, las expresiones y la ejecución en diferentes conexiones.

`UP` construye la modificación y `where` delimita los registros que se actualizan. Este ejemplo resta cuatro unidades al stock:

```ts
const resultado = await DB.Update(productoPrueba())
  .set([
    UP(productoPrueba.stockactual, productoPrueba.stockactual.sub(4), true),
  ])
  .where(eq(productoPrueba.idproducto, 4))
  .execute();
```

## Eliminar registros · DELETE

Este ejemplo elimina los pedidos con identificador `2` o `3`:

```ts
await DB.Delete(pedidos())
  .where(ORQ(pedidos.idpedido, 2, 3))
  .execute();
```

`Delete` elimina los registros que cumplen la condición. La eliminación de la estructura de una tabla es una operación diferente.

## Relacionar tablas · JOIN

Compara las columnas de las tablas que quieres relacionar:

```ts
const datos = await DB.Select([
  productoPrueba.nombreComercial,
  categorias.nombrecategoria,
])
  .from(productoPrueba())
  .innerJOIN(
    categorias(),
    eq(productoPrueba.idCategoria, categorias.idcategoria),
  )
  .execute();
```

## Limitar los resultados

Usa `LIMIT` y `OFFSET` para limitar la cantidad y desplazar el inicio de los registros:

```ts
const datos = await DB.Select([categorias.idcategoria])
  .from(categorias())
  .LIMIT(10)
  .OFFSET(2)
  .execute();
```

## Ver el SQL generado

El primer parámetro de `execute` permite visualizar la consulta SQL:

```ts
await DB.Select().from(categorias()).execute(true);
```
