# Implementación WebSocket con Fallback Automático

## 📋 Resumen

Sistema de WebSocket implementado para todas las rutas del dashboard con fallback automático a API REST cuando WebSocket no está disponible.

## 🏗️ Arquitectura

### 1. **WebSocketService** (`src/services/WebSocketService.js`)
Servicio centralizado que gestiona múltiples conexiones WebSocket simultáneas:

- ✅ Manejo de múltiples canales simultáneos
- ✅ Reconexión automática inteligente (máx 3 intentos)
- ✅ Heartbeat para mantener conexiones vivas
- ✅ Fallback automático a API cuando WebSocket falla
- ✅ Sistema de eventos para suscripción a actualizaciones

**Canales soportados:**
- `sensor_data` - Datos de sensores ESP32
- `heart_rate_today` - Frecuencia cardíaca del día
- `heart_rate_stats` - Estadísticas de frecuencia cardíaca
- `heart_rate` - Timeline de frecuencia cardíaca
- `desires_tracking` - Seguimiento de deseos
- `desires_stats` - Estadísticas de deseos
- `prediction_timeline` - Timeline de predicciones
- `prediction_summary` - Resumen de predicciones
- `daily_summary` - Resumen diario
- `weekly_comparison` - Comparación semanal
- `active_window` - Ventana activa
- `habit_stats` - Estadísticas de hábitos
- `habit_tracking` - Seguimiento de hábitos

### 2. **useDashboardWebSocket** (`src/hooks/useDashboardWebSocket.js`)
Hook genérico que combina WebSocket con React Query:

```javascript
const { data, isLoading, isRealtime, isConnected } = useSensorData(consumidorId);
```

**Características:**
- Intenta conectar WebSocket primero
- Si WebSocket falla, usa API REST automáticamente
- Mantiene caché sincronizado con react-query
- Permite transformación de datos en tiempo real
- Actualización automática con intervalos configurables

### 3. **Hooks específicos exportados:**

```javascript
// Sensores
import { useSensorData } from '../hooks/useDashboardWebSocket';

// Frecuencia cardíaca
import { useHeartRateToday, useHeartRateStats, useHeartRate } from '../hooks/useDashboardWebSocket';

// Deseos
import { useDesiresTracking, useDesiresStats } from '../hooks/useDashboardWebSocket';

// Predicciones
import { usePredictionTimeline, usePredictionSummary } from '../hooks/useDashboardWebSocket';

// Resúmenes
import { useDailySummary, useWeeklyComparison } from '../hooks/useDashboardWebSocket';

// Ventanas y hábitos
import { useActiveWindow, useHabitStats, useHabitTracking } from '../hooks/useDashboardWebSocket';
```

## 🚀 Uso en Componentes

### Ejemplo: DashboardSensors

```javascript
import { useSensorData } from '../../hooks/useDashboardWebSocket';

export default function DashboardSensors() {
  const user = authService.getCurrentUser();
  const consumidorId = user?.consumidor_id;
  
  // ✅ Hook con WebSocket + fallback automático
  const { data: sensorData, isRealtime } = useSensorData(consumidorId);
  
  return (
    <div>
      {/* Indicador de modo */}
      <span>
        {isRealtime ? '🔴 TIEMPO REAL' : '📡 API REST'}
      </span>
      
      {/* Usar datos normalmente */}
      {sensorData?.map(reading => (
        <div key={reading.id}>{reading.value}</div>
      ))}
    </div>
  );
}
```

## 🔄 Flujo de Funcionamiento

```
1. Componente se monta
   ↓
2. Hook intenta conectar WebSocket
   ↓
3a. ✅ WebSocket conecta → Recibe datos en tiempo real
   ↓
4a. isRealtime = true, isConnected = true
   
3b. ❌ WebSocket falla → Usa API REST automáticamente
   ↓
4b. isRealtime = false, usa react-query con polling
```

## 📊 Indicadores de Estado

Los componentes ahora muestran:
- **🔴 TIEMPO REAL**: Conectado por WebSocket
- **📡 API REST**: Usando API con polling automático
- **DESCONECTADO**: Sin datos disponibles

## 🔧 Configuración Backend Requerida

El backend debe tener consumers Django Channels para cada canal:

```python
# backend/consumers.py
class SensorDataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.consumidor_id = self.scope['url_route']['kwargs']['consumidor_id']
        await self.channel_layer.group_add(
            f"sensor_data_{self.consumidor_id}",
            self.channel_name
        )
        await self.accept()
    
    async def sensor_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'sensor_update',
            'data': event['data']
        }))
```

**URLs WebSocket esperadas:**
```
wss://backend9b-production.up.railway.app/ws/sensor_data/{consumidor_id}/?token={token}
wss://backend9b-production.up.railway.app/ws/heart_rate_today/{consumidor_id}/?token={token}
wss://backend9b-production.up.railway.app/ws/heart_rate_stats/{consumidor_id}/?token={token}
...etc
```

## 🎯 Ventajas del Sistema

1. **Transparente**: Los componentes no necesitan saber si usan WebSocket o API
2. **Resiliente**: Fallback automático sin intervención
3. **Eficiente**: WebSocket reduce carga del servidor cuando está disponible
4. **Compatible**: Funciona con infraestructura existente
5. **Observable**: Indicadores visuales muestran el modo de conexión

## 🔍 Debug

Para ver logs de WebSocket:

```javascript
// En la consola del navegador
wsService.getStats(); // Ver estadísticas de conexiones

// Deshabilitar WebSocket globalmente (solo API REST)
wsService.disable();

// Habilitar WebSocket
wsService.enable();
```

## 📝 Notas

- Los hooks mantienen la API de react-query (`data`, `isLoading`, `error`)
- El sistema es compatible con autenticación JWT vía query param
- Reconexión automática con backoff exponencial
- Heartbeat cada 30 segundos mantiene conexiones vivas
- Cleanup automático al desmontar componentes
