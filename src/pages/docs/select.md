---
layout: ../../layouts/Doc.astro
title: SELECT
description: Selecciona tus columnas y encadena los pasos de tu consulta.
---

`DB.Select()` construye una consulta de lectura. Cada método configura una parte de la consulta; `execute()` la envía a la base de datos.

```ts
import { DB, eq } from 'zormz';
// categorias es una tabla previamente definida en tu proyecto.

const datos = await DB.Select([
  categorias.idcategoria,
  categorias.nombrecategoria,
])
  .from(categorias())
  .where(eq(categorias.idcategoria, 1))
  .execute();
```

Los ejemplos de esta página usan `categorias` y `productoPrueba`, del esquema compartido del proyecto. Configura una conexión e importa tus definiciones de tablas antes de ejecutarlos.

## Misma query, diferentes conexiones

Construye la consulta una sola vez y decide la conexión al ejecutarla. No necesitas volver a escribir el `Select`, sus columnas ni sus filtros para consultar MySQL y PostgreSQL.

En este ejemplo, `initBD()` configura la conexión MySQL utilizada por `DB` e `initPg()` devuelve el objeto de conexión PostgreSQL. Son funciones de inicialización de tu proyecto; `generateTables` contiene tus tablas definidas.

```ts
await initBD();
const pgConex = await initPg();
const { productoPrueba, categorias } = generateTables;

// Construimos la query una sola vez.
const consulta = DB.Select([
  productoPrueba.nombreComercial,
  productoPrueba.descripcion,
])
  .from(productoPrueba())
  .where(eq(productoPrueba.activo, true))
  .LIMIT(5);

// La conexión MySQL configurada para DB.
const resultMysql = await consulta.execute(true);
console.log(resultMysql);

// La misma query, ahora sobre PostgreSQL.
const ResultPG = await consulta.execute(true, pgConex.getConexion());
console.log(ResultPG);
```

El primer parámetro `true` muestra el SQL generado. El segundo parámetro selecciona una conexión para esa ejecución; si se omite, se usa la conexión configurada en el constructor de la consulta.

Ambas bases deben tener las tablas y columnas consultadas. Cada ejecución devuelve los datos de su propia base; compartir la query no implica que los resultados sean iguales. `categorias` se extrae junto con las tablas del proyecto, aunque esta consulta solo utiliza `productoPrueba`.

## Respuestas entre motores

ZORMZ entrega las filas como un array de objetos tanto en MySQL como en PostgreSQL. Tu código puede recorrer el resultado de la misma manera, sin extraer manualmente `rows` al cambiar a PostgreSQL.

Por ejemplo, con las conexiones inicializadas y las tablas del proyecto:

```ts
const consulta = DB.Select([categorias.nombrecategoria])
  .from(categorias())
  .LIMIT(2);

const mysql = await consulta.execute();
const pg = await consulta.execute(false, pgConex.getConexion());

// La misma forma de consumir cualquiera de los dos resultados.
const nombresMysql = mysql.map((fila) => fila.nombrecategoria);
const nombresPg = pg.map((fila) => fila.nombrecategoria);
```

### Salida de ejemplo · MySQL

```ts
[{ nombrecategoria: 'disponible' }, { nombrecategoria: 'disponible' }];
```

### Salida de ejemplo · PostgreSQL

```ts
[{ nombrecategoria: 'disponible' }, { nombrecategoria: 'disponible' }];
```

Estas dos filas aparecen al inicio de las respuestas de categorías compartidas del proyecto. La salida está recortada para ilustrar la consulta con `LIMIT(2)`; no es una nueva ejecución contra las bases.

### Filas con fechas y valores nulos

La consulta de pedidos del registro compartido también conserva los nombres de las propiedades:

```ts
const consulta = DB.Select([
  pedidos.estado,
  pedidos.idpedido,
  pedidos.fechaconfirmacion,
]).from(pedidos());

const mysql = await consulta.execute();
const pg = await consulta.execute(false, pgConex.getConexion());
```

Este registro aparece en ambas salidas, aunque en posiciones distintas:

```ts
// Extracto común de ambas respuestas.
{ estado: 'pendiente', idpedido: 2, fechaconfirmacion: null }
```

El formato común evita tener que cambiar el acceso a las filas al elegir otra conexión. Los valores, la cantidad de registros y el orden dependen de cada base. Para controlar el orden, utiliza `OrderBy`; para comparar valores de fechas o tipos SQL especiales, comprueba también la configuración de los drivers.

## Seleccionar columnas

Pasa un array de columnas para elegir los campos del resultado. Sin argumentos, se seleccionan todas las columnas:

```ts
const categoriasCompletas = await DB.Select().from(categorias()).execute();
```

## from

Define la tabla principal de la consulta. Al invocar una tabla definida con ZORMZ, `categorias()` proporciona su nombre al constructor.

```ts
const datos = await DB.Select([categorias.nombrecategoria])
  .from(categorias())
  .execute();
```

## where

Filtra los registros con una condición. Usa helpers como `eq` para comparar una columna con un valor, o `AND` para combinar condiciones.

```ts
import { DB, AND, eq } from 'zormz';

const productos = await DB.Select([
  productoPrueba.nombreComercial,
  productoPrueba.stockactual,
])
  .from(productoPrueba())
  .where(
    AND(eq(productoPrueba.idCategoria, 1), eq(productoPrueba.activo, true)),
  )
  .execute();
```

## innerJOIN

Devuelve las filas que tienen coincidencia en ambas tablas. Recibe la tabla que se une y la condición que relaciona sus columnas.

```ts
const productos = await DB.Select([
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

En este caso, un producto aparece solamente si su categoría tiene una coincidencia.

## leftJoin

Conserva todos los registros de la tabla principal, aunque no tengan coincidencia en la tabla que se une. Las columnas del lado sin coincidencia se devuelven como `NULL`.

```ts
const productos = await DB.Select([
  productoPrueba.nombreComercial,
  categorias.nombrecategoria,
])
  .from(productoPrueba())
  .leftJoin(
    categorias(),
    eq(productoPrueba.idCategoria, categorias.idcategoria),
  )
  .execute();
```

Así puedes listar productos aunque no tengan una categoría coincidente. Un filtro posterior en `where` sobre la categoría puede excluir las filas sin coincidencia.

## rigthJoin

Conserva todas las filas de la tabla situada a la derecha de la unión. En la API publicada el método se escribe `rigthJoin`.

```ts
const datos = await DB.Select([
  productoPrueba.nombreComercial,
  categorias.nombrecategoria,
])
  .from(productoPrueba())
  .rigthJoin(
    categorias(),
    eq(productoPrueba.idCategoria, categorias.idcategoria),
  )
  .execute();
```

Este ejemplo incluye categorías que todavía no tienen productos relacionados.

## OrderBy

Ordena los resultados con uno o más criterios. Cada criterio recibe una `columna` y un `type`: `"ASC"` para orden ascendente o `"DESC"` para descendente.

```ts
const datos = await DB.Select()
  .from(categorias())
  .OrderBy({ columna: categorias.idcategoria, type: 'ASC' })
  .LIMIT(10)
  .execute();
```

## LIMIT

Limita la cantidad de filas devueltas. Este ejemplo solicita un máximo de diez categorías:

```ts
const datos = await DB.Select().from(categorias()).LIMIT(10).execute();
```

## OFFSET

Indica cuántas filas se omiten antes de devolver los resultados. Combínalo con `LIMIT` para recorrer páginas. Para obtener páginas estables, establece también un orden.

```ts
const datos = await DB.Select([categorias.idcategoria])
  .from(categorias())
  .OrderBy({ columna: categorias.idcategoria, type: 'ASC' })
  .LIMIT(10)
  .OFFSET(20)
  .execute();
```

Este ejemplo omite las primeras veinte filas y solicita hasta diez más.

## execute

Ejecuta la consulta y devuelve una promesa con un array de resultados. Usa `await` para obtener las filas.

```ts
const datos = await DB.Select().from(categorias()).execute(true);
```

| Parámetro      | Descripción                                            |
| -------------- | ------------------------------------------------------ |
| `see`          | Opcional. Con `true`, muestra el SQL generado.         |
| `conexionSust` | Opcional. Selecciona una conexión para esta ejecución. |

Para ejecutar explícitamente sobre una conexión PostgreSQL ya configurada:

```ts
const datos = await DB.Select()
  .from(categorias())
  .execute(true, pg.getConexion());
```

Revisa [múltiples conexiones](/docs/multiples-conexiones/) para configurar este flujo.
