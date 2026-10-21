export const tableLifecycle = [
  { slug: 'generar-tablas', title: 'Generar tablas' },
  { slug: 'eliminar-tablas', title: 'Eliminar tablas' },
];

export const guides = [
  { slug: 'instalacion', title: 'Instalación' },
  { slug: 'conexiones', title: 'Conexiones' },
  { slug: 'consultas', title: 'Consultas' },
  { slug: 'multiples-conexiones', title: 'Múltiples conexiones' },
];

export const references = [
  {
    slug: 'tables',
    title: 'Tables',
    sections: [
      ['definetable', 'defineTable()'],
      ['tipos-de-columnas', 'Tipos de columnas'],
      ['int', 'int() y sus métodos'],
      ['varchar', 'varchar() y sus métodos'],
      ['money', 'money() y sus métodos'],
      ['timestamp', 'timestamp() y sus métodos'],
      ['bool', 'bool() y sus métodos'],
      ['tabla-como-funcion', '¿Por qué tabla()?'],
      ['referencias-de-columnas', 'Referencias de columnas'],
      ['definicion-y-consulta', 'Definir y consultar'],
      ['metodos-de-columnas', 'Métodos de columnas'],
      ['alias', 'as() y alias'],
      ['columns', '$columns'],
    ],
  },
  {
    slug: 'select',
    title: 'SELECT',
    sections: [
      ['misma-query-diferentes-conexiones', 'Una query, varias conexiones'],
      ['respuestas-entre-motores', 'Respuestas MySQL / PostgreSQL'],
      ...[
        'from',
        'where',
        'innerJOIN',
        'leftJoin',
        'rigthJoin',
        'OrderBy',
        'LIMIT',
        'OFFSET',
        'execute',
      ].map((method) => [method.toLowerCase(), `${method}()`]),
    ],
  },
  {
    slug: 'insert',
    title: 'INSERT',
    sections: [
      ['columnas', 'Tabla y columnas'],
      ['values', 'Values()'],
      ['insercion-multiple', 'Inserción múltiple'],
      ['returning', 'Returning()'],
      ['respuestas-entre-motores', 'Respuestas MySQL / PostgreSQL'],
      ['execute', 'execute()'],
      ['diferentes-conexiones', 'Diferentes conexiones'],
    ],
  },
  {
    slug: 'update',
    title: 'UPDATE',
    sections: [
      ['updatemanage', 'Clase UpdateManage'],
      ['add', 'add()'],
      ['set', 'set()'],
      ['up', 'UP()'],
      ['expresiones', 'Expresiones aritméticas'],
      ['where', 'where()'],
      ['execute', 'execute() y respuesta'],
      ['diferentes-conexiones', 'Diferentes conexiones'],
    ],
  },
  {
    slug: 'multi-funciones',
    title: 'Multi funciones · Batch',
    sections: [
      ['batch', 'Batch()'],
      ['preparar-consultas', '.batch()'],
      ['exec', '.exec()'],
      ['mysql', 'Ejemplo MySQL'],
      ['postgresql', 'Ejemplo PostgreSQL'],
      ['respuestas', 'Leer las respuestas'],
    ],
  },
];

export const documentPages = [...tableLifecycle, ...guides, ...references];
