# Bitácora Diaria

Agenda/bitácora diaria personal para seguimiento de hábitos, comidas, consumo y reflexión. Aplicación web estática (PWA), sin backend: todos los datos se guardan en el `localStorage` del navegador.

## Funcionalidades

- **Hoy**: hábitos diarios (ejercicio, leer, test autoescuela, lavarse los dientes), tareas semanales personalizables y reflexión del día.
- **Comidas**: desayuno, comida y cena, con hora, descripción y una nota de salud (1-5).
- **Consumo**: cigarros y joints del día, compra de paquetes de tabaco con gasto mensual/anual, media mensual y comparación con el mes anterior.
- **Stats**: mapa de calor mensual de todos los hábitos (incluye tareas semanales, alimentación y gasto en tabaco), progreso de hábitos, gráfica de consumo y comparativa mes a mes.
- **Ajustes**: tareas semanales personalizables (añadir/eliminar libremente, guardadas por dispositivo), recordatorio diario mediante notificaciones y copia de seguridad (exportar/importar datos en JSON).

## Uso local

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000` en el navegador.

## Instalar en iPhone (recomendado para el recordatorio diario)

1. Aloja estos archivos en un hosting con HTTPS (por ejemplo GitHub Pages) o ábrelos en local.
2. Abre la URL en Safari.
3. Pulsa el botón Compartir → "Añadir a pantalla de inicio".
4. Abre la app desde el icono añadido y, en la pestaña **Ajustes**, pulsa "Permitir notificaciones" y activa el recordatorio.

> Nota: iOS solo entrega notificaciones locales mientras la app está abierta o en segundo plano reciente. Un recordatorio fiable a cualquier hora con la app completamente cerrada requeriría un servidor de Web Push, fuera del alcance de esta app estática.

## Datos

Toda la información se guarda solo en este dispositivo/navegador. Usa "Exportar datos" en Ajustes periódicamente para tener una copia de seguridad.
