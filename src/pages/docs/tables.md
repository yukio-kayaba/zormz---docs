---
layout: ../../layouts/Doc.astro
title: Tables
description: Entiende cómo ZORMZ representa una tabla y cómo sus columnas te ayudan a construir SQL.
---

Una tabla definida con ZORMZ tiene dos usos complementarios: puedes llamarla para obtener su nombre o acceder a sus propiedades para referirte a las columnas. Es la misma definición, utilizada en partes diferentes de una consulta.

```ts
const { productoPrueba } = generateTables;

productoPrueba(); // Nombre de la tabla: 'productoPrueba'.
productoPrueba.nombreComercial; // Referencia a la columna nombreComercial.
productoPrueba.stockactual.add(1); // Expresión SQL: sumar uno al stock actual.
```

Estas expresiones describen la consulta. No leen filas ni cambian datos por sí solas.

## defineTable

`defineTable(nombre, columnas)` recibe dos parámetros y devuelve la representación de una tabla para usarla desde TypeScript.

| Parámetro  | Qué recibe                                                                                                            |
| ---------- | --------------------------------------------------------------------------------------------------------------------- |
| `nombre`   | El nombre de la tabla en la base de datos, como `"pedidos"`.                                                          |
| `columnas` | Un objeto cuyas claves son los nombres de las columnas y cuyos valores son sus definiciones, como `int().Required()`. |

En el proyecto, las tablas se declaran directamente dentro del objeto exportado `generateTables`:

<div class="schema-example">

```ts
import { defineTable, int, varchar, money, timestamp, bool } from 'zormz';

export const generateTables = {
  pedidos: defineTable('pedidos', {
    idpedido: int().Required().Pk().$(),
    estado: varchar(100)
      .Required()
      .Check(['pendiente', 'completado', 'rechazado'])
      .Default('pendiente')
      .$(),
    fechacreacion: timestamp().now().$(),
    fechaconfirmacion: timestamp()
      .comment('campo para la confirmacion de pedidos')
      .$(),
    fecharetiro: timestamp().$(),
    idcolaboradorsolicita: int().Unsingned().Required(),
    idcolaboradordespacha: int().Unsingned().Default(0),
    observaciones: varchar(300),
  }),
  categorias: defineTable('categorias', {
    idcategoria: int().Pk().$(),
    nombrecategoria: varchar(100).Check(['disponible', 'data']).Required().$(),
    descripcion: varchar(250).$(),
    estado: bool().default(true).$(),
  }),
  productoPrueba: defineTable('productoPrueba', {
    idproducto: int().Pk().$(),
    nombreComercial: varchar(200).Required().$(),
    descripcion: varchar(200).Required().$(),
    idCategoria: int().Required().Comment('esto es una prueba').$(),
    precioCompra: money().default(0).$(),
    precioVenta: money().required().$(),
    stockactual: int().Default(0).$(),
    stockminimo: int().Default(0).$(),
    activo: bool().default(true).$(),
    fecharegistro: timestamp().now().$(),
    fechaUpdate: timestamp().onUpdate(),
  }),
  colaborador: defineTable('colaborador', {
    idcolaborador: int().Pk().$(),
    idusuario: int().Required().$(),
    nombrecompleto: varchar(150).$(),
    dni: varchar(9).$(),
    rol: varchar(50).$(),
    diastrabajo: varchar(200).Default('sabado - domingo').$(),
    activo: bool().default(true).$(),
  }),
  detallepedido: defineTable('detallepedido', {
    iddetalle: int().Pk().$(),
    idpedido: int().Default(0).$(),
    idproducto: int().Default(0).$(),
    cantidad: int().Default(1).$(),
  }),

  permisos: defineTable('permisos', {
    idPermiso: int().Pk().$(),
    nombre: varchar(100).$(),
    descripcion: varchar(250).$(),
    estado: bool().default(true),
  }),

  detallespermisos: defineTable('detallespermisos', {
    iddetallepermiso: int().Pk().$(),
    idcolaborador: int().$(),
    idppermiso: int().Default(0).$(),
  }),
  usuarios: defineTable('usuarios', {
    iduser: int().Pk().$(),
    correo: varchar(150).Required().$(),
    contra: varchar(150).Required().$(),
  }),
};
```

</div>

Para utilizar una tabla, extráela del objeto:

```ts
const { productoPrueba } = generateTables;
```

Los siguientes ejemplos utilizan esa misma tabla y sus columnas. TypeScript conoce sus propiedades y puede ofrecer autocompletado al escribir consultas.

Definir la tabla en el código no crea su estructura en la base de datos. Para hacerlo, consulta [Generar tablas](/docs/generar-tablas/).

## Tipos de columnas

Cada propiedad del objeto de columnas comienza con una función que indica su tipo. Los métodos encadenados configuran esa definición.

| Función                         | Parámetros                        | Qué define                   |
| ------------------------------- | --------------------------------- | ---------------------------- |
| `int()`                         | Sin argumentos.                   | Una columna entera.          |
| `varchar(cantidad?)`            | Longitud opcional.                | Una columna de texto.        |
| `money(presicion?, decimales?)` | Precisión y decimales opcionales. | Una columna monetaria.       |
| `timestamp()`                   | Sin argumentos.                   | Una columna de fecha y hora. |
| `bool()`                        | Sin argumentos.                   | Una columna booleana.        |

El esquema del proyecto también utiliza `bool()` para columnas booleanas. Los métodos disponibles y sus mayúsculas dependen del tipo: por ejemplo, `int().Required()` y `money().required()` tienen una escritura diferente. Abre el tipo que necesites para consultar sus métodos y ejemplos encadenados.

<p class="type-explorer-label">ELIGE TU TIPO DE COLUMNA</p>
<nav class="type-explorer" aria-label="Explorar tipos de columnas">
<a class="type-tile" href="#int" data-type="int"><span class="type-tile-top"><span>01 / TIPO</span><span aria-hidden="true">↗</span></span><span class="type-symbol" aria-hidden="true">123</span><strong>INT</strong><span class="type-description">Enteros</span><span class="type-count">8 métodos <span aria-hidden="true">→</span></span></a>
<a class="type-tile" href="#varchar" data-type="varchar"><span class="type-tile-top"><span>02 / TIPO</span><span aria-hidden="true">↗</span></span><span class="type-symbol" aria-hidden="true">Aa</span><strong>VARCHAR</strong><span class="type-description">Texto</span><span class="type-count">6 métodos <span aria-hidden="true">→</span></span></a>
<a class="type-tile" href="#money" data-type="money"><span class="type-tile-top"><span>03 / TIPO</span><span aria-hidden="true">↗</span></span><span class="type-symbol" aria-hidden="true">$</span><strong>MONEY</strong><span class="type-description">Dinero</span><span class="type-count">4 métodos <span aria-hidden="true">→</span></span></a>
<a class="type-tile" href="#timestamp" data-type="timestamp"><span class="type-tile-top"><span>04 / TIPO</span><span aria-hidden="true">↗</span></span><span class="type-symbol" aria-hidden="true">◷</span><strong>TIMESTAMP</strong><span class="type-description">Fecha y hora</span><span class="type-count">5 métodos <span aria-hidden="true">→</span></span></a>
<a class="type-tile" href="#bool" data-type="bool"><span class="type-tile-top"><span>05 / TIPO</span><span aria-hidden="true">↗</span></span><span class="type-symbol" aria-hidden="true">✓</span><strong>BOOL</strong><span class="type-description">Verdadero / falso</span><span class="type-count">4 métodos <span aria-hidden="true">→</span></span></a>
</nav>

<details class="column-reference" id="int">
<summary><span class="type-heading"><span class="type-summary-symbol" aria-hidden="true">123</span><span><strong>INT</strong><span class="type-subtitle">Enteros · Ver métodos y ejemplos</span></span></span><span class="type-summary-action">8 métodos <span class="type-arrow" aria-hidden="true">＋</span></span></summary>

`int()` no recibe argumentos. Crea la definición de una columna entera y permite configurar sus propiedades mediante métodos encadenados. Todos los métodos que aparecen a continuación devuelven la misma instancia.

```ts
idpedido: int().Required().Pk().$();
```

<div class="type-methods">

<section class="method-card">

### Required()

Sin parámetros. Marca la columna como requerida (`requerido = true`), para que no admita `NULL` en su definición.

```ts
idusuario: int().Required();
```

</section>

<section class="method-card">

### Pk()

Sin parámetros. Para una columna `INT`, activa tanto la clave primaria como el autoincremento (`pk = true` y `autoIncrement = true`). No necesitas añadir `AutoIncrement()` para activar ese indicador cuando ya usas `Pk()`.

```ts
idpedido: int().Required().Pk();
```

En el código compartido, `Pk()` no modifica por sí mismo el indicador `requerido`; el ejemplo declara `Required()` explícitamente.

</section>

<section class="method-card">

### Comment(comentario)

Recibe un `string` y lo guarda como comentario de la columna.

```ts
idCategoria: int().Required().Comment('esto es una prueba');
```

</section>

<section class="method-card">

### Unique()

Sin parámetros. Marca la columna con la propiedad de unicidad (`unique = true`).

```ts
idusuario: int().Required().Unique();
```

Este método no activa el autoincremento ni marca la columna como clave primaria en el código compartido.

</section>

<section class="method-card">

### Unsingned(numeroPositivosInicio = 0)

Permite números positivos e indica desde dónde empiezan los valores permitidos. Recibe un número opcional; su valor por defecto es `0`.

```ts
idcolaboradorsolicita: int().Unsingned(0).Required();
```

El método rechaza un argumento negativo con el error `Unsingned() solo permite numeros positivos`. Guarda el uso de esta propiedad y el valor inicial en la definición de la columna. El nombre de la API se escribe `Unsingned`, tal como aparece en el proyecto.

</section>

<section class="method-card">

### AutoIncrement()

Sin parámetros. Activa el autoincremento y marca la columna como requerida (`autoIncrement = true` y `requerido = true`).

```ts
idregistro: int().AutoIncrement();
```

En el código compartido, este método no activa `pk`; para declarar la clave primaria se utiliza `Pk()`.

</section>

<section class="method-card">

### Default(value)

Recibe un `number` y lo guarda como valor por defecto de la columna. No activa `Required()`, `Pk()` ni `AutoIncrement()`.

```ts
stockactual: int().Default(0);
```

</section>

<section class="method-card">

### $()

En versiones antiguas, `.$()` era necesario para generar la base de datos. Actualmente devuelve la misma instancia sin modificar la definición y ya no es necesario para esa generación. Se mantiene en los ejemplos antiguos por compatibilidad.

```ts
idpedido: int().Required().Pk().$();
```

</section>

</div>

</details>

<details class="column-reference" id="varchar">
<summary><span class="type-heading"><span class="type-summary-symbol" aria-hidden="true">Aa</span><span><strong>VARCHAR</strong><span class="type-subtitle">Texto · Ver métodos y ejemplos</span></span></span><span class="type-summary-action">6 métodos <span class="type-arrow" aria-hidden="true">＋</span></span></summary>

`varchar(cantidad)` define una columna de texto con la longitud indicada. Los métodos devuelven la misma instancia, de modo que puedes encadenar la configuración de cada columna.

```ts
export const generateTables = {
  permisos: defineTable('permisos', {
    idPermiso: int().Pk().$(),
    nombre: varchar(100).$(),
    descripcion: varchar(250).$(),
  }),
};
```

Aquí `nombre` usa una longitud de `100` y `descripcion` una de `250`. Puedes añadir las restricciones y valores por defecto en la misma cadena.

<div class="type-methods">

<section class="method-card">

### Check(datos)

Recibe un array de strings con los valores permitidos para la columna. La implementación guarda esos valores en la definición de VARCHAR para que se utilicen al generar su estructura.

```ts
estado: varchar(100)
  .Required()
  .Check(['pendiente', 'completado', 'rechazado'])
  .Default('pendiente')
  .$();
```

En este ejemplo, la lista contiene tres estados y el valor por defecto es uno de ellos. `Check()` configura la definición; no ejecuta una consulta al llamarlo.

</section>

<section class="method-card">

### Required()

Sin parámetros. Marca la columna como requerida para que no admita `NULL`.

```ts
nombre: varchar(100).Required().$();
```

</section>

<section class="method-card">

### Comment(comentario)

Recibe un `string` y lo guarda como comentario de la columna.

```ts
descripcion: varchar(250).Required().Comment('Descripción del permiso').$();
```

</section>

<section class="method-card">

### Unique()

Sin parámetros. Activa la propiedad de unicidad de la columna.

```ts
nombre: varchar(100).Required().Unique().$();
```

</section>

<section class="method-card">

### Default(textoDefecto)

Recibe un `string` y lo guarda como valor por defecto de la columna.

```ts
diastrabajo: varchar(200).Default('sabado - domingo').$();
```

</section>

<section class="method-card">

### $()

En versiones antiguas era necesario terminar la definición con `.$()` para generar la base de datos. Actualmente ya no es necesario: su implementación solo devuelve la misma instancia. Por eso lo puedes seguir encontrando en las definiciones existentes del proyecto.

```ts
nombre: varchar(100).$();
```

</section>

<section class="method-card">

### Configuración encadenada

Cada llamada configura una propiedad de la misma columna. Puedes reunir los métodos en una sola definición:

```ts
nombre: varchar(100)
  .Required()
  .Unique()
  .Comment('Nombre del permiso')
  .Default('sin nombre')
  .$();
```

Los métodos disponibles aquí son `Check`, `Required`, `Comment`, `Unique`, `Default` y `$`, respetando esas mayúsculas.

</section>

</div>

</details>

<details class="column-reference" id="money">
<summary><span class="type-heading"><span class="type-summary-symbol" aria-hidden="true">$</span><span><strong>MONEY</strong><span class="type-subtitle">Dinero · Ver métodos y ejemplos</span></span></span><span class="type-summary-action">4 métodos <span class="type-arrow" aria-hidden="true">＋</span></span></summary>

`money()` define una columna pensada para manejar dinero. ZORMZ reúne el uso de los tipos decimales `NUMERIC` y `DECIMAL` bajo una sola API, adaptando la definición al motor utilizado. Así puedes mantener la misma definición en MySQL y PostgreSQL.

```ts
export const generateTables = {
  precios: defineTable('precios', {
    idprecio: int().Pk().$(),
    precioCompra: money().default(0).$(),
    precioVenta: money().required().$(),
  }),
};
```

<div class="type-methods">

<section class="method-card">

### Precisión y decimales

La firma es `money(presicion?, decimales?)`. Puedes indicar la precisión y la cantidad de decimales al definir la columna:

```ts
precioVenta: money(10, 2).required().$();
```

En este ejemplo, la precisión es `10` y la cantidad de decimales es `2`. Estos parámetros configuran el tipo de columna; no asignan un precio.

</section>

<section class="method-card">

### required()

Sin parámetros. Marca la columna como requerida para que no admita `NULL`.

```ts
precioVenta: money().required().$();
```

</section>

<section class="method-card">

### default(value)

Recibe un `number` y lo guarda como valor por defecto de la columna.

```ts
precioCompra: money().default(0).$();
```

Este método configura el valor por defecto; no marca la columna como requerida.

</section>

<section class="method-card">

### comment(comentario)

Recibe un `string` y lo guarda como comentario de la columna.

```ts
precioVenta: money().required().comment('Precio de venta del producto').$();
```

</section>

<section class="method-card">

### $()

En versiones antiguas era necesario terminar la definición con `.$()` para generar la base de datos. Actualmente ya no es necesario: su implementación devuelve la misma instancia sin modificar la definición. Se conserva por compatibilidad con las definiciones existentes.

```ts
precioCompra: money().default(0).$();
```

</section>

<section class="method-card">

### Configuración encadenada

Todos estos métodos devuelven la misma instancia, por lo que puedes combinar sus opciones en una sola definición:

```ts
precioVenta: money(10, 2)
  .required()
  .default(0)
  .comment('Precio de venta del producto')
  .$();
```

En MONEY se escriben `required`, `default` y `comment` en minúsculas. Mantén esa escritura al encadenarlos.

</section>

</div>

</details>

<details class="column-reference" id="timestamp">
<summary><span class="type-heading"><span class="type-summary-symbol" aria-hidden="true">◷</span><span><strong>TIMESTAMP</strong><span class="type-subtitle">Fecha y hora · Ver métodos y ejemplos</span></span></span><span class="type-summary-action">5 métodos <span class="type-arrow" aria-hidden="true">＋</span></span></summary>

`timestamp()` define una columna de fecha y hora. No recibe argumentos. Sus métodos permiten hacerla requerida, añadir un comentario, establecer la fecha actual por defecto o actualizarla automáticamente cuando cambia el registro.

```ts
export const generateTables = {
  pedidos: defineTable('pedidos', {
    idpedido: int().Required().Pk().$(),
    fechacreacion: timestamp().required().now().$(),
    fechaconfirmacion: timestamp()
      .comment('campo para la confirmacion de pedidos')
      .$(),
    fechaUpdate: timestamp().required().now().onUpdate().$(),
  }),
};
```

Todos estos métodos devuelven la misma instancia para configurar cada columna mediante una cadena. La configuración describe el comportamiento de la columna al generar su estructura; llamar a estos métodos no inserta ni actualiza registros por sí solo.

<div class="type-methods">

<section class="method-card">

### required()

Sin parámetros. Marca la columna como requerida para que no admita `NULL`.

```ts
fechacreacion: timestamp().required().now().$();
```

</section>

<section class="method-card">

### comment(comentario)

Recibe un `string` y lo guarda como comentario de la columna.

```ts
fechaconfirmacion: timestamp()
  .comment('campo para la confirmacion de pedidos')
  .$();
```

</section>

<section class="method-card">

### now()

Sin parámetros. Configura la fecha y hora actual como valor por defecto de la columna. Sirve, por ejemplo, para registrar la creación de una fila cuando la inserción no proporciona un valor para esa columna.

```ts
fechacreacion: timestamp().required().now().$();
```

`now()` configura el valor por defecto; no activa por sí mismo `required()` ni la actualización automática.

</section>

<section class="method-card">

### onUpdate()

Sin parámetros. Activa la actualización automática de la fecha y hora cuando se actualiza el registro.

```ts
fechaUpdate: timestamp().required().now().onUpdate().$();
```

En esta cadena, `now()` configura el valor inicial por defecto y `onUpdate()` configura las actualizaciones posteriores. Son opciones independientes: `onUpdate()` no activa `now()` ni `required()` por sí mismo.

Para ver cómo actualizar un registro con `UpdateManage`, consulta [Ver updateDoc →](/docs/update/).

</section>

<section class="method-card">

### $()

En versiones antiguas era necesario terminar la definición con `.$()` para generar la base de datos. Actualmente ya no es necesario: este método devuelve la misma instancia sin modificar la definición. Se conserva por compatibilidad con las definiciones existentes.

```ts
fechacreacion: timestamp().now().$();
```

</section>

<section class="method-card">

### Configuración encadenada

Puedes combinar todas las opciones en una sola definición:

```ts
fechaUpdate: timestamp()
  .required()
  .comment('Fecha de la última actualización del registro')
  .now()
  .onUpdate()
  .$();
```

Los métodos se escriben `required`, `comment`, `now` y `onUpdate`, respetando esas mayúsculas y minúsculas.

</section>

</div>

</details>

<details class="column-reference" id="bool">
<summary><span class="type-heading"><span class="type-summary-symbol" aria-hidden="true">✓</span><span><strong>BOOL</strong><span class="type-subtitle">Verdadero o falso · Ver métodos y ejemplos</span></span></span><span class="type-summary-action">4 métodos <span class="type-arrow" aria-hidden="true">＋</span></span></summary>

`bool()` define una columna booleana para valores `true` o `false`. No recibe argumentos. Es útil para representar estados como un permiso habilitado o un producto activo.

```ts
export const generateTables = {
  permisos: defineTable('permisos', {
    idPermiso: int().Pk().$(),
    estado: bool().default(true).$(),
  }),
};
```

Todos los métodos devuelven la misma instancia para que puedas configurar la columna en cadena.

<div class="type-methods">

<section class="method-card">

### required()

Sin parámetros. Marca la columna como requerida para que no admita `NULL`.

```ts
estado: bool().required().default(true).$();
```

`false` es un valor booleano válido; una columna requerida no obliga a que su valor sea `true`.

</section>

<section class="method-card">

### Comment(comentario)

Recibe un `string` y lo guarda como comentario de la columna. En BOOL, `Comment` comienza con mayúscula.

```ts
estado: bool()
  .Comment('Indica si el permiso está habilitado')
  .default(true)
  .$();
```

</section>

<section class="method-card">

### default(value)

Recibe un `boolean` y lo guarda como valor por defecto de la columna.

```ts
estado: bool().default(true).$();
```

También puedes configurar `false` como valor por defecto:

```ts
activo: bool().default(false).$();
```

`default()` no activa `required()` por sí mismo.

</section>

<section class="method-card">

### $()

En versiones antiguas era necesario terminar la definición con `.$()` para generar la base de datos. Actualmente ya no es necesario: devuelve la misma instancia sin modificar la definición. Se conserva por compatibilidad con las definiciones existentes.

```ts
estado: bool().default(true).$();
```

</section>

<section class="method-card">

### Configuración encadenada

```ts
estado: bool()
  .required()
  .Comment('Indica si el permiso está habilitado')
  .default(true)
  .$();
```

Respeta la escritura de los métodos: `required`, `Comment`, `default` y `$`.

</section>

</div>

</details>

<h2 id="tabla-como-funcion">¿Por qué se usa productoPrueba()?</h2>

La definición es invocable: `productoPrueba()` devuelve el nombre `'productoPrueba'`. Por eso se usa con paréntesis donde el constructor necesita el nombre de la tabla:

```ts
const datos = await DB.Select([productoPrueba.nombreComercial])
  .from(productoPrueba())
  .execute();
```

| Expresión                           | Qué representa                            | Dónde se utiliza                                         |
| ----------------------------------- | ----------------------------------------- | -------------------------------------------------------- |
| `productoPrueba()`                  | El nombre de la tabla.                    | `from`, `Insert`, `Update` y las uniones.                |
| `productoPrueba.nombreComercial`    | Una referencia a la columna con su tabla. | SELECT, filtros, columnas de INSERT y cambios de UPDATE. |
| `productoPrueba.stockactual.add(1)` | Una expresión sobre la columna.           | Por ejemplo, un incremento en UPDATE.                    |

Internamente, ZORMZ utiliza un `Proxy` sobre una función. Al llamarla, entrega el nombre; al acceder a una columna, construye su referencia. No necesitas crear otra tabla ni otra instancia para cada forma de uso.

<h2 id="referencias-de-columnas">¿Qué contiene una columna?</h2>

`productoPrueba.stockactual` representa una columna; no contiene el stock de un registro concreto. La referencia incluye la tabla y el nombre de la columna:

```ts
console.log(productoPrueba.stockactual.table); // 'productoPrueba'
console.log(productoPrueba.stockactual.column); // 'stockactual'
```

Esta información permite al constructor identificar la columna incluso cuando una consulta combina varias tablas. También permite construir condiciones comparando columnas o valores:

```ts
import { DB, eq } from 'zormz';

const datos = await DB.Select([
  productoPrueba.nombreComercial,
  productoPrueba.stockactual,
])
  .from(productoPrueba())
  .where(eq(productoPrueba.idproducto, 5))
  .execute();

// Los valores reales están en las filas que devuelve execute().
for (const fila of datos) {
  console.log(fila.nombreComercial, fila.stockactual);
}
```

Consulta [SELECT](/docs/select/) para ver filtros, uniones y ejecución.

<h2 id="definicion-y-consulta">Dos momentos: definir y consultar</h2>

Los métodos de la definición de una columna describen su estructura. Los métodos de una referencia construyen expresiones para una consulta.

```ts
// Definición: tipo entero y valor por defecto.
stockactual: int().Default(0);

// Consulta: expresión que suma uno al valor almacenado.
productoPrueba.stockactual.add(1);
```

| Método al definir | Para qué sirve                                |
| ----------------- | --------------------------------------------- |
| `int()`           | Declara una columna de tipo entero.           |
| `varchar(150)`    | Declara una columna de texto con su longitud. |
| `Pk()`            | Marca una columna como clave primaria.        |
| `Required()`      | Declara que la columna no admite `NULL`.      |
| `Default(0)`      | Define un valor por defecto en el esquema.    |

En versiones antiguas, `.$()` era necesario para generar la base de datos. Actualmente ya no es necesario; se conserva por compatibilidad con esas definiciones.

<h2 id="metodos-de-columnas">¿Para qué sirven add, sub, mul y div?</h2>

Las referencias de columnas incluyen métodos para describir operaciones aritméticas sobre el valor almacenado:

| Método                              | Operación SQL conceptual         |
| ----------------------------------- | -------------------------------- |
| `productoPrueba.stockactual.add(1)` | `productoPrueba.stockactual + 1` |
| `productoPrueba.stockactual.sub(4)` | `productoPrueba.stockactual - 4` |
| `productoPrueba.stockactual.mul(2)` | `productoPrueba.stockactual * 2` |
| `productoPrueba.stockactual.div(2)` | `productoPrueba.stockactual / 2` |

No realizan la operación en JavaScript al llamarlos. Devuelven una descripción con la columna, el operador y el valor; el constructor la transforma en SQL cuando se ejecuta la consulta. Úsalos sobre columnas numéricas compatibles con la operación.

Por ejemplo, puedes incrementar el stock con `UpdateManage`, sin consultar primero su valor:

```ts
import { DB, UpdateManage, eq } from 'zormz';

const cambios = new UpdateManage();
cambios.add(productoPrueba.stockactual, productoPrueba.stockactual.add(1));

await DB.Update(productoPrueba())
  .set(cambios)
  .where(eq(productoPrueba.idproducto, 5))
  .execute();
```

[Ver updateDoc →](/docs/update/#expresiones) para aprender a combinar cambios con `UpdateManage`, filtrar las filas y ejecutar UPDATE.

## Alias

`as()` asigna un nombre a una columna en el resultado de SELECT. No cambia el nombre de la columna en la base de datos:

```ts
const datos = await DB.Select([
  productoPrueba.nombreComercial.as('nombreProducto'),
  productoPrueba.stockactual,
])
  .from(productoPrueba())
  .execute();
```

Las filas devueltas usarán `nombreProducto` como nombre de esa propiedad y conservarán `stockactual` para la columna sin alias.

Así puedes elegir los nombres que necesita tu aplicación o diferenciar columnas con el mismo nombre al relacionar tablas.

<h2 id="columns">¿Qué es $columns?</h2>

`productoPrueba.$columns` da acceso a las definiciones originales de las columnas: el objeto que pasaste a `defineTable`. Se utiliza para describir la estructura de la tabla, por ejemplo en la generación de tablas.

```ts
productoPrueba(); // Nombre: 'productoPrueba'.
productoPrueba.$columns; // Definiciones originales: idproducto, nombreComercial y stockactual.
productoPrueba.stockactual; // Referencia para construir consultas sobre stock.
```

`$columns` no contiene filas ni resultados de consultas. Para consultar datos usa `DB.Select()` y `execute()`.
