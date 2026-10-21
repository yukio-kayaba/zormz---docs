---
layout: ../../layouts/Doc.astro
title: Múltiples conexiones
description: Mantén varias conexiones y elige dónde ejecutar cada consulta.
---

## Elige una conexión al ejecutar

ZORMZ permite conservar conexiones a MySQL y PostgreSQL. El segundo parámetro de `execute` selecciona la conexión sobre la que se ejecutará la consulta:

```ts
.execute(true, conexion)
```

| Parámetro         | Uso                                       |
| ----------------- | ----------------------------------------- |
| Primer parámetro  | Muestra la consulta SQL cuando es `true`. |
| Segundo parámetro | Selecciona la conexión de ejecución.      |

## Ejemplo con PostgreSQL

Una vez configurado `pg` con `getConexion("pg", configuracionPg)`, puedes usar su conexión explícitamente. La tabla `categorias` corresponde a los ejemplos del proyecto:

```ts
const datos = await DB.Select([
  categorias.idcategoria,
  categorias.nombrecategoria,
])
  .from(categorias())
  .execute(true, pg.getConexion());
```

## Consultas desde el objeto de conexión

Los ejemplos también muestran cómo construir una consulta directamente desde el objeto devuelto por `getConexion`:

```ts
const datos = await pg
  .Select([categorias.nombrecategoria])
  .from(categorias())
  .execute();
```

## Una forma común de leer las respuestas

El cambio de conexión no exige reescribir el consumo de las filas de SELECT o de los identificadores de INSERT con `Returning`. En las salidas compartidas del proyecto:

| Operación            | MySQL            | PostgreSQL       | Cómo consumirla          |
| -------------------- | ---------------- | ---------------- | ------------------------ |
| SELECT               | Array de objetos | Array de objetos | `filas.map(fila => ...)` |
| INSERT con Returning | `[39, 40]`       | `[22, 23]`       | `ids.forEach(id => ...)` |

La estructura coincide; los valores pertenecen a cada base. Revisa las [respuestas de SELECT](/docs/select/#respuestas-entre-motores) y las [respuestas de INSERT](/docs/insert/#respuestas-entre-motores) para ver las queries junto a sus salidas.

En el registro de ejecución por lotes, UPDATE todavía presenta una diferencia: `[1]` en MySQL y `1` en PostgreSQL. Esa operación requiere distinguir o normalizar la respuesta; la estructura común mostrada aquí corresponde a SELECT e INSERT con `Returning`.

## Próximas secciones

Puedes ver el flujo completo de una query reutilizada en [SELECT: misma query, diferentes conexiones](/docs/select/#misma-query-diferentes-conexiones) y el ejemplo equivalente de [INSERT](/docs/insert/#diferentes-conexiones).

También puedes [generar tablas](/docs/generar-tablas/) y [eliminar tablas](/docs/eliminar-tablas/) en una conexión específica. Para enviar varias consultas en una sola request, consulta [Multi funciones · Batch](/docs/multi-funciones/). La referencia de funciones SQL se ampliará en una siguiente etapa.
