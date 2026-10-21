export const guides = [
  { slug: 'instalacion', title: 'Instalación' },
  { slug: 'conexiones', title: 'Conexiones' },
  { slug: 'consultas', title: 'Consultas' },
  { slug: 'multiples-conexiones', title: 'Múltiples conexiones' },
];

export const references = [
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
];

export const documentPages = [...guides, ...references];
