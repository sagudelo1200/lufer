const claseSeccion = 'bg-white rounded-2xl shadow-sm p-4';
const claseTitulo =
  'text-sm font-bold text-orange-600 uppercase tracking-wide mb-3 flex items-center gap-2';
const claseLineaTitulo = 'flex-1 h-px bg-orange-100 self-center';

export default function BuscadorPlaca({
  valor,
  onChange,
  onBuscar,
  inputRef,
  error,
  inputProps = {},
  children,
}) {
  const getClean = (s) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

  const handleChange = (e) => {
    const raw = e.target.value || '';
    const clean = getClean(raw);
    const name = e.target.name || inputProps.name;
    // llamar al onChange del padre con formato compatible (event-like)
    onChange && onChange({ target: { value: clean, name } });
    // si ya tiene 6 chars limpios, ejecutar búsqueda automática (padre decide si es válido)
    if (clean.length === 6) {
      onBuscar && onBuscar(clean);
    }
  };
  return (
    <div className={claseSeccion}>
      <h2 className={claseTitulo}>
        Búsqueda por placa <span className={claseLineaTitulo} />
        <i className='fa-solid fa-magnifying-glass text-orange-300 text-xs' />
      </h2>
      <div className='flex gap-2'>
        <input
          type='text'
          ref={inputRef}
          value={valor}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onBuscar && onBuscar(getClean(e.target.value));
            }
          }}
          placeholder='Ej: KDU369'
          maxLength={6}
          className={`flex-1 border rounded-xl px-3 py-2.5 text-sm uppercase tracking-widest focus:outline-none focus:ring-2 transition-all bg-white ${
            error
              ? 'border-red-400 focus:ring-red-300'
              : 'border-slate-200 focus:ring-orange-400/50 focus:border-orange-400'
          }`}
          {...inputProps}
        />
        <button
          type='button'
          onClick={() => onBuscar && onBuscar(getClean(valor))}
          className='px-4 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-semibold hover:bg-slate-900 active:bg-black transition-colors cursor-pointer'
        >
          <i className='fa-solid fa-search mr-1.5'></i> Buscar
        </button>
      </div>
      {error && (
        <p className='mt-2 text-xs font-medium text-red-500'>
          <i className='fa-solid fa-triangle-exclamation mr-1'></i>
          {error}
        </p>
      )}
      {children}
    </div>
  );
}
