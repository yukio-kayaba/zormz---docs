---
layout: ../../layouts/Doc.astro
title: UPDATE
description: Organiza los cambios con UpdateManage, filtra los registros y ejecuta tu actualización.
---

`DB.Update()` actualiza registros de una tabla. Usa la clase `UpdateManage` para reunir los cambios y pásala a `set()`. Después delimita las filas con `where()` y ejecuta la consulta.

Este ejemplo utiliza `productoPrueba`, del esquema compartido del proyecto. Configura una conexión e importa la definición de tu tabla antes de ejecutarlo.

```ts
import { DB, UpdateManage, eq } from 'zormz';

const cambios = new UpdateManage();
cambios.add(productoPrueba.descripcion, 'Descripción actualizada');
cambios.add(productoPrueba.stockminimo, productoPrueba.stockminimo.add(1));

const resultado = await DB.Update(productoPrueba())
  .set(cambios)
  .where(eq(productoPrueba.idproducto, 5))
  .execute();

console.log(resultado);
```

## UpdateManage

`UpdateManage` es la clase dedicada a preparar las modificaciones. Mantiene una lista de cambios y permite agregar cada uno por separado antes de construir el UPDATE.

```ts
const cambios = new UpdateManage();

cambios.add(productoPrueba.descripcion, 'Producto disponible');
cambios.add(productoPrueba.activo, true);
```

Resulta útil para reunir cambios de distintas partes de tu código, por ejemplo, los campos opcionales de un formulario:

```ts
const cambios = new UpdateManage();

if (nuevaDescripcion !== undefined) {
  cambios.add(productoPrueba.descripcion, nuevaDescripcion);
}

if (nuevoStockMinimo !== undefined) {
  cambios.add(productoPrueba.stockminimo, nuevoStockMinimo);
}

if (cambios.length > 0) {
  await DB.Update(productoPrueba())
    .set(cambios)
    .where(eq(productoPrueba.idproducto, idProducto))
    .execute();
}
```

`nuevaDescripcion`, `nuevoStockMinimo` e `idProducto` son valores proporcionados por tu aplicación. La comprobación de longitud evita construir una actualización sin cambios.

## add

`cambios.add(columna, nuevoValor)` agrega una modificación a la lista. Admite valores directos y expresiones construidas desde una columna.

```ts
const cambios = new UpdateManage();
cambios.add(productoPrueba.descripcion, 'Nuevo texto');
cambios.add(productoPrueba.stockactual, productoPrueba.stockactual.sub(4));
```

`add()` modifica la instancia y no devuelve un constructor encadenable: realiza cada llamada por separado. `getUpdates()` devuelve la propia lista, aunque puedes pasar `cambios` directamente a `set()`.

## set

Recibe las modificaciones que se aplicarán a los registros. Puedes usar la instancia de `UpdateManage` o un array construido con `UP()`.

```ts
const consulta = DB.Update(productoPrueba())
  .set(cambios)
  .where(eq(productoPrueba.idproducto, 5));
```

La consulta se ejecuta cuando llamas a `execute()`.

## UP

Para cambios puntuales, `UP()` permite construir cada modificación dentro de un array:

```ts
import { DB, UP, eq } from 'zormz';

await DB.Update(productoPrueba())
  .set([
    UP(productoPrueba.descripcion, 'Descripción actualizada'),
    UP(productoPrueba.stockactual, productoPrueba.stockactual.sub(4), true),
  ])
  .where(eq(productoPrueba.idproducto, 4))
  .execute();
```

La clase `UpdateManage` te permite preparar estos cambios sin construir manualmente el array de `UP`.

## Expresiones

Puedes operar sobre el valor de una columna directamente en la base de datos:

| Expresión        | Operación                           |
| ---------------- | ----------------------------------- |
| `columna.add(1)` | Suma uno al valor actual.           |
| `columna.sub(4)` | Resta cuatro al valor actual.       |
| `columna.mul(2)` | Multiplica el valor actual por dos. |
| `columna.div(2)` | Divide el valor actual entre dos.   |

```ts
const cambios = new UpdateManage();
cambios.add(productoPrueba.stockminimo, productoPrueba.stockminimo.add(1));

await DB.Update(productoPrueba())
  .set(cambios)
  .where(eq(productoPrueba.idproducto, 5))
  .execute();
```

No necesitas leer primero el stock en JavaScript para construir este incremento.

## where

Selecciona los registros que recibirán los cambios. Puedes combinar condiciones con `AND()`:

```ts
import { AND, eq } from 'zormz';

const consulta = DB.Update(productoPrueba())
  .set(cambios)
  .where(
    AND(eq(productoPrueba.idproducto, 5), eq(productoPrueba.idCategoria, 1)),
  );
```

Sin una condición `where`, la actualización puede afectar a todas las filas de la tabla. Usa un filtro cuando quieras modificar registros concretos.

## execute

Ejecuta la actualización y devuelve la cantidad de filas afectadas por el motor. Una salida ilustrativa cuando se afecta una fila es:

```ts
const resultado = await consulta.execute(true);
console.log(resultado);

// 1
```

| Parámetro      | Descripción                                                       |
| -------------- | ----------------------------------------------------------------- |
| `seeQuery`     | Opcional. `true` muestra el SQL y los valores de las condiciones. |
| `conexionSust` | Opcional. Selecciona una conexión para esta ejecución.            |

El número depende de los registros coincidentes y del comportamiento del motor al actualizar valores. Este ejemplo muestra el uso de `execute()` directamente; en el registro por lotes compartido, UPDATE aparece como `[1]` en MySQL y `1` en PostgreSQL.

## Diferentes conexiones

Puedes construir la actualización una vez y ejecutarla sobre MySQL y PostgreSQL. `initBD`, `initPg` y `generateTables` son parte de la configuración de tu proyecto:

```ts
await initBD();
const pgConex = await initPg();
const { productoPrueba } = generateTables;

const cambios = new UpdateManage();
cambios.add(productoPrueba.descripcion, 'Descripción actualizada');

const consulta = DB.Update(productoPrueba())
  .set(cambios)
  .where(eq(productoPrueba.idproducto, 5));

const resultMysql = await consulta.execute(true);
console.log(resultMysql);

const resultPg = await consulta.execute(true, pgConex.getConexion());
console.log(resultPg);
```

Cada ejecución actualiza su propia base de datos. Reutilizar la consulta no sincroniza las bases ni crea una transacción entre ambas.
