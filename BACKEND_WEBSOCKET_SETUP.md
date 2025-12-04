# Configuración del Backend para WebSocket

## 🔴 Problema Actual

El frontend está intentando conectar a WebSocket pero el backend retorna **404 Not Found**:

```
[WARNING] Not Found: /ws/sensor_data/22/
[WARNING] Not Found: /ws/heart_rate_today/22/
[WARNING] Not Found: /ws/heart_rate_stats/22/
```

**Solución temporal**: El sistema funciona correctamente con API REST como fallback automático. Los datos se actualizan cada 5-10 segundos.

---

## 🛠️ Para Implementar WebSocket en el Backend

### 1. Instalar Django Channels

```bash
pip install channels channels-redis daphne
```

### 2. Configurar `settings.py`

```python
# settings.py

INSTALLED_APPS = [
    'daphne',  # ⚠️ DEBE estar ANTES de django.contrib.staticfiles
    'django.contrib.admin',
    # ... otras apps
    'channels',
]

# ASGI Application
ASGI_APPLICATION = 'backend.asgi.application'

# Channel Layers (Redis en producción)
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('redis', 6379)],  # O tu URL de Redis
        },
    },
}

# En desarrollo (sin Redis):
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}
```

### 3. Crear `asgi.py`

```python
# backend/asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django_asgi_app = get_asgi_application()

from backend import routing  # Importar después de django_asgi_app

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(routing.websocket_urlpatterns)
        )
    ),
})
```

### 4. Crear `routing.py`

```python
# backend/routing.py
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/sensor_data/(?P<consumidor_id>\w+)/$', consumers.SensorDataConsumer.as_asgi()),
    re_path(r'ws/heart_rate_today/(?P<consumidor_id>\w+)/$', consumers.HeartRateTodayConsumer.as_asgi()),
    re_path(r'ws/heart_rate_stats/(?P<consumidor_id>\w+)/$', consumers.HeartRateStatsConsumer.as_asgi()),
    re_path(r'ws/desires_tracking/(?P<consumidor_id>\w+)/$', consumers.DesiresTrackingConsumer.as_asgi()),
    re_path(r'ws/desires_stats/(?P<consumidor_id>\w+)/$', consumers.DesiresStatsConsumer.as_asgi()),
]
```

### 5. Crear Consumers

```python
# backend/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()

class BaseAuthConsumer(AsyncWebsocketConsumer):
    """Consumer base con autenticación JWT"""
    
    async def connect(self):
        # Obtener token del query string
        query_string = self.scope['query_string'].decode()
        params = dict(x.split('=') for x in query_string.split('&') if '=' in x)
        token = params.get('token')
        
        if not token:
            await self.close(code=4001)
            return
        
        # Validar token
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            self.scope['user'] = await self.get_user(user_id)
        except Exception:
            await self.close(code=4001)
            return
        
        # Obtener consumidor_id de la URL
        self.consumidor_id = self.scope['url_route']['kwargs']['consumidor_id']
        self.group_name = f'{self.channel_prefix}_{self.consumidor_id}'
        
        # Unirse al grupo
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Enviar datos iniciales
        await self.send_initial_data()
    
    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """Manejar mensajes del cliente"""
        data = json.loads(text_data)
        
        if data.get('type') == 'ping':
            await self.send(text_data=json.dumps({'type': 'pong'}))
        elif data.get('type') == 'request_data':
            await self.send_initial_data()
    
    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()
    
    async def send_initial_data(self):
        """Implementar en subclases"""
        pass


class SensorDataConsumer(BaseAuthConsumer):
    channel_prefix = 'sensor_data'
    
    async def send_initial_data(self):
        """Enviar lecturas iniciales de sensores"""
        data = await self.get_sensor_data()
        await self.send(text_data=json.dumps({
            'type': 'sensor_update',
            'data': data
        }))
    
    @database_sync_to_async
    def get_sensor_data(self):
        from api.models import LecturaSensor
        lecturas = LecturaSensor.objects.filter(
            consumidor_id=self.consumidor_id
        ).order_by('-created_at')[:10]
        
        return [
            {
                'id': l.id,
                'accel_x': float(l.accel_x),
                'accel_y': float(l.accel_y),
                'accel_z': float(l.accel_z),
                'gyro_x': float(l.gyro_x),
                'gyro_y': float(l.gyro_y),
                'gyro_z': float(l.gyro_z),
                'created_at': l.created_at.isoformat(),
            }
            for l in lecturas
        ]
    
    async def sensor_update(self, event):
        """Enviar actualización desde channel layer"""
        await self.send(text_data=json.dumps(event))


class HeartRateTodayConsumer(BaseAuthConsumer):
    channel_prefix = 'heart_rate_today'
    
    async def send_initial_data(self):
        data = await self.get_heart_rate_today()
        await self.send(text_data=json.dumps({
            'type': 'heart_rate_update',
            'data': data
        }))
    
    @database_sync_to_async
    def get_heart_rate_today(self):
        from api.views.dashboard_views import get_heart_rate_today_data
        return get_heart_rate_today_data(self.consumidor_id)
    
    async def heart_rate_update(self, event):
        await self.send(text_data=json.dumps(event))


class HeartRateStatsConsumer(BaseAuthConsumer):
    channel_prefix = 'heart_rate_stats'
    
    async def send_initial_data(self):
        data = await self.get_heart_rate_stats()
        await self.send(text_data=json.dumps({
            'type': 'heart_rate_stats_update',
            'data': data
        }))
    
    @database_sync_to_async
    def get_heart_rate_stats(self):
        from api.views.dashboard_views import get_heart_rate_stats_data
        return get_heart_rate_stats_data(self.consumidor_id)
    
    async def heart_rate_stats_update(self, event):
        await self.send(text_data=json.dumps(event))


# Repetir para otros consumers...
class DesiresTrackingConsumer(BaseAuthConsumer):
    channel_prefix = 'desires_tracking'
    # Implementar similar...

class DesiresStatsConsumer(BaseAuthConsumer):
    channel_prefix = 'desires_stats'
    # Implementar similar...
```

### 6. Enviar Actualizaciones en Tiempo Real

Cuando se crean nuevos datos, enviar a través del channel layer:

```python
# En tus views o signals
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def send_sensor_update(consumidor_id, lectura_data):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'sensor_data_{consumidor_id}',
        {
            'type': 'sensor_update',
            'data': lectura_data
        }
    )

# Ejemplo en una view
@api_view(['POST'])
def create_sensor_reading(request):
    lectura = LecturaSensor.objects.create(**request.data)
    
    # Enviar actualización WebSocket
    send_sensor_update(lectura.consumidor_id, {
        'id': lectura.id,
        'accel_x': float(lectura.accel_x),
        # ... resto de campos
    })
    
    return Response(...)
```

### 7. Deploy en Railway

Agregar a `Procfile` o comando de inicio:

```bash
# Usar Daphne en lugar de Gunicorn
daphne -b 0.0.0.0 -p $PORT backend.asgi:application
```

O en Railway Settings:
```
Start Command: daphne -b 0.0.0.0 -p $PORT backend.asgi:application
```

### 8. Variables de Entorno Railway

```env
REDIS_URL=redis://red-xxxxx.railway.app:6379
```

---

## 🎯 Estado Actual del Frontend

✅ **El sistema funciona perfectamente sin WebSocket**
- Usa API REST con polling automático
- Actualización cada 5-10 segundos
- Sin errores visibles para el usuario
- Fallback totalmente transparente

✅ **Cuando se implemente WebSocket en backend**
- El frontend conectará automáticamente
- Actualizaciones en tiempo real
- Reducción de carga del servidor
- Sin cambios necesarios en el frontend

## 📝 Notas

1. El frontend ya está **100% preparado** para WebSocket
2. Los errores de conexión están **silenciados** en producción
3. El sistema es **resiliente** y funciona con o sin WebSocket
4. La implementación del backend es **opcional** pero recomendada para mejor performance

---

## 🔍 Verificar Funcionamiento

Una vez implementado el backend, verificar en consola del navegador:

```javascript
// Ver estadísticas de WebSocket
wsService.getStats()

// Debe mostrar:
// {
//   totalConnections: 3,
//   activeConnections: 3,
//   channels: [
//     { channel: "sensor_data_22", state: "OPEN", isActive: true },
//     { channel: "heart_rate_today_22", state: "OPEN", isActive: true },
//     ...
//   ]
// }
```
