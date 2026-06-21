"""Ruta de estado de la aplicación."""

from fastapi import APIRouter

router_estado = APIRouter(prefix='', tags=['estado'])


@router_estado.get('/estado')
async def obtener_estado():
    """
    Obtiene el estado de la aplicación.

    Returns:
        dict: Estado actual de la aplicación.
    """
    return {'estado': 'funcionando'}
