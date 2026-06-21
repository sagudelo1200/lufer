"""Router principal de la API."""

from fastapi import APIRouter

from .rutas import estado

router = APIRouter()

# Registrar routers de rutas
router.include_router(estado.router_estado)

__all__ = ['router']
