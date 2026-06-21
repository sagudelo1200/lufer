"""Punto de entrada principal de la aplicación FastAPI."""

from fastapi import FastAPI

from .api.router import router
from .core.configuracion import configuracion


def crear_aplicacion() -> FastAPI:
    """
    Crea y configura la aplicación FastAPI.

    Returns:
        FastAPI: Instancia configurada de la aplicación.
    """
    aplicacion = FastAPI(
        title=configuracion.nombre_aplicacion,
        version=configuracion.version_aplicacion,
        description='API base con arquitectura limpia',
        debug=configuracion.depuracion,
    )

    # Registrar routers
    aplicacion.include_router(router)

    return aplicacion


app = crear_aplicacion()
