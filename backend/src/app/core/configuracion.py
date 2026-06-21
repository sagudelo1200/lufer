"""Configuración de la aplicación usando Pydantic Settings."""

from pydantic_settings import BaseSettings


class Configuracion(BaseSettings):
    """Configuración principal de la aplicación."""

    nombre_aplicacion: str = 'API Base'
    version_aplicacion: str = '0.1.0'
    entorno: str = 'desarrollo'
    depuracion: bool = True

    class Config:
        """Configuración de Pydantic Settings."""

        env_file = '.env'
        env_file_encoding = 'utf-8'
        case_sensitive = False


configuracion = Configuracion()
