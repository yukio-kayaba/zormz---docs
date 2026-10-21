---
layout: ../../layouts/Doc.astro
title: INSERT
description: Inserta una fila o varias, recupera sus identificadores y elige la conexión de ejecución.
---

`DB.Insert()` construye una inserción a partir de una tabla y una lista de columnas. Encadena `Values()` para asignar los valores y `execute()` para enviar la operación a la base de datos.

Los ejemplos utilizan `categorias`, del esquema del proyecto. Configura la conexión e importa tu tabla antes de ejecutarlos.

```ts
import { DB } from 'zormz';

const resultado = await DB.Insert(categorias(), [
  categorias.nombrecategoria,
  categorias.descripcion,
])
  .Values(['disponible', 'Accesorios para celulares'])
  .Returning(categorias.idcategoria)
  .execute();
```

## Columnas

El primer argumento es la tabla de destino; el segundo es el array de columnas que recibirán los datos. El orden de las columnas debe coincidir con el orden de los valores de cada fila.

```ts
const consulta = DB.Insert(categorias(), [
  categorias.nombrecategoria, // Primer valor de cada fila.
  categorias.descripcion, // Segundo valor de cada fila.
]);
```

Las columnas no incluidas dependerán de los valores por defecto y las restricciones del esquema de tu base de datos.

## Values

Para una sola fila, pasa un array con los valores:

```ts
await DB.Insert(categorias(), [
  categorias.nombrecategoria,
  categorias.descripcion,
])
  .Values(['disponible', 'Cargadores y cables USB'])
  .execute();
```

`Values()` admite valores `string`, `number`, `boolean` o `null`. El tipo y las restricciones de cada columna deben permitir el valor que envías.

<h2 id="insercion-multiple">Inserción múltiple</h2>

Pasa un array de filas para insertar varios registros en una misma operación. Cada fila debe contener los valores de todas las columnas seleccionadas, en el mismo orden.

```ts
const resultado = await DB.Insert(categorias(), [
  categorias.nombrecategoria,
  categorias.descripcion,
])
  .Values([
    ['disponible', 'Accesorios para celulares'],
    ['data', 'Cargadores y cables USB'],
    ['disponible', 'Audífonos y parlantes'],
  ])
  .Returning(categorias.idcategoria)
  .execute();
```

## Returning

Indica la columna de identificación que quieres recuperar después de insertar. En los ejemplos del proyecto se utiliza la clave primaria de la tabla.

```ts
const ids = await DB.Insert(categorias(), [
  categorias.nombrecategoria,
  categorias.descripcion,
])
  .Values(['disponible', 'Tabletas y dispositivos portátiles'])
  .Returning(categorias.idcategoria)
  .execute();

console.log(ids);
```

Con `Returning`, las salidas compartidas del proyecto muestran un array de identificadores en ambos motores. Los números dependen de los registros y de la secuencia de cada base; no tienen por qué coincidir.

## Respuestas entre motores

Una inserción múltiple con `Returning(categorias.idcategoria)` permite consumir los identificadores con la misma estructura de array. Este ejemplo usa los valores de la inserción MySQL del registro compartido:

```ts
const consulta = DB.Insert(categorias(), [
  categorias.nombrecategoria,
  categorias.descripcion,
])
  .Values([
    ['disponible', 'valor insertado 1'],
    ['disponible', 'valor insertado 2'],
  ])
  .Returning(categorias.idcategoria);

const idsMysql = await consulta.execute();
const idsPg = await consulta.execute(false, pgConex.getConexion());

idsMysql?.forEach((id) => console.log('ID MySQL:', id));
idsPg?.forEach((id) => console.log('ID PostgreSQL:', id));
```

### Salida observada · MySQL

```ts
[39, 40];
```

### Salida observada · PostgreSQL

```ts
[22, 23];
```

Estos arrays se extrajeron de las operaciones INSERT del lote que compartiste. En ese registro, las descripciones insertadas en PostgreSQL eran diferentes; aquí se muestra cómo reutilizar los mismos valores en ambos motores. Los identificadores son ejemplos observados, no valores que una nueva ejecución deba devolver.

Tu aplicación recibe un array en los dos casos y puede usar el mismo recorrido. Cada llamada inserta filas en su propia base; no sincroniza los IDs entre motores.

## execute

Ejecuta la inserción construida. Puedes mostrar el SQL y seleccionar una conexión explícita:

| Parámetro       | Descripción                                                  |
| --------------- | ------------------------------------------------------------ |
| `see`           | Opcional. `true` muestra la consulta SQL.                    |
| `OtherConexion` | Opcional. Conexión sobre la que se ejecutará esta inserción. |

```ts
await DB.Insert(categorias(), [
  categorias.nombrecategoria,
  categorias.descripcion,
])
  .Values(['data', 'Componentes de reparación'])
  .execute(true);
```

## Diferentes conexiones

También puedes construir una inserción una sola vez y ejecutarla sobre conexiones distintas. Aquí `initBD`, `initPg` y `generateTables` pertenecen a la configuración del proyecto:

```ts
await initBD();
const pgConex = await initPg();
const { categorias } = generateTables;

const consulta = DB.Insert(categorias(), [
  categorias.nombrecategoria,
  categorias.descripcion,
])
  .Values([
    ['disponible', 'Accesorios para celulares'],
    ['data', 'Cargadores y cables USB'],
  ])
  .Returning(categorias.idcategoria);

const resultMysql = await consulta.execute(true);
console.log(resultMysql);

const resultPg = await consulta.execute(true, pgConex.getConexion());
console.log(resultPg);
```

Cada `execute()` realiza una escritura en la base seleccionada. Este ejemplo inserta las filas en las dos bases; las operaciones son independientes y no forman una transacción compartida.
