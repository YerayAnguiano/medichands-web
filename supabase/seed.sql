-- ==============================================================================
-- MEDICHANDS WEB — SEED DE DATOS INICIALES (ARTÍCULOS CIENTÍFICOS OFICIALES)
-- Ejecutar en Supabase Dashboard -> SQL Editor para poblar los 4 artículos base.
-- ==============================================================================

INSERT INTO public.posts (
    slug,
    title,
    excerpt,
    content,
    cover_image,
    category,
    author_name,
    author_email,
    is_team_author,
    reading_time_minutes,
    likes_count,
    is_published,
    published_at
) VALUES 
(
    'avance-clave-termografia-copas-3d-max30205',
    'Avance clave en termografía mamaria: Validación de copas 3D en TPU con sensores MAX30205',
    'Investigadores de la Universidad de Colima consolidan el kit ergonómico de copas impresas en TPU biocompatible con 16 biosensores de grado clínico para triaje continuo desde el hogar.',
    'El cáncer de mama continúa siendo una de las mayores problemáticas de salud pública a nivel global. En respuesta a las barreras económicas y el dolor asociado a la mastografía convencional, el equipo de investigación de MedicHands en la Facultad de Ingeniería Mecánica y Eléctrica (FIME) de la Universidad de Colima ha dado un paso decisivo hacia la accesibilidad diagnóstica.

### La Innovación en Hardware
En lugar de depender de prendas textiles confeccionadas a medida —las cuales generan cuellos de botella logísticos y dificultades para el lavado—, MedicHands ha estandarizado un **kit de dos copas impresas en 3D utilizando Poliuretano Termoplástico (TPU 95A)** de grado médico. 

Este diseño ofrece ventajas fundamentales:
1. **Adaptabilidad universal:** La usuaria coloca el kit dentro de cualquier sostén personal sin modificar su vestimenta diaria.
2. **Higiene garantizada:** Las copas se extraen fácilmente para su limpieza y desinfección superficial.
3. **Sensores MAX30205 de Grado Clínico:** Cada copa integra 8 sensores digitales por contacto directo (16 en total entre ambos senos), conformando una matriz bilateral de alta sensibilidad ($\pm 0.1^\circ\text{C}$, estándar ASTM E1112).

### Segmentación Anatómica de Acea Nebril
La disposición de los sensores sigue el modelo quirúrgico de segmentos mamarios de *Acea Nebril (2011)*, cubriendo los cuadrantes superiores e inferiores y la zona periareolar. Esta configuración permite aislar aumentos térmicos localizados (*hotspots*) provocados por la neoangiogénesis tumoral.

> *"El objetivo no es sustituir las pruebas radiológicas en hospital, sino empoderar a las mujeres con una herramienta preventiva que detecte asimetrías térmicas antes de que la masa sea palpable."*',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    'Investigación UCol',
    'Jetzael Yeray Anguiano Solis',
    'yerayanguiano@gmail.com',
    false,
    4,
    148,
    true,
    '2026-10-13T10:00:00.000Z'
),
(
    'por-que-abandonamos-sostenes-textiles-copas-tpu',
    'Por qué abandonamos los sostenes textiles tradicionales por el kit de copas ergonómicas 3D',
    'Análisis de viabilidad industrial y confort biomecánico: cómo la transición a copas impresas redujo el costo unitario de manufactura de $4,293 a $1,580 MXN.',
    'Durante las primeras fases de desarrollo del proyecto MedicHands se exploró la confección de corpiños instrumentados con sensores embebidos en tela. No obstante, el estudio de viabilidad técnica e industrial reveló limitaciones operativas críticas:

### Los Tres Retos del Wearable Textil
* **Complejidad de tallas:** Mantener inventario para diversas copas y contornos exigía fabricar decenas de patrones textiles distintos.
* **Mantenimiento y lavado:** Los ciclos de lavado dañaban el cableado flexible y degradaban la fijación de los sensores.
* **Aislamiento térmico:** El tejido no lograba aislar de forma constante las interferencias de la temperatura ambiental.

### La Solución en Polímero TPU 95A
Al migrar hacia un par de copas independientes de poliuretano termoplástico de 61 gramos cada una, la manufactura se centraliza en impresión 3D FDM de alta velocidad. El plan de negocio a 5 años estima una reducción del costo unitario de **$4,293.28 MXN a $1,580.00 MXN**, democratizando el costo final para las usuarias y programas de salud comunitaria.',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    'Ingeniería de Hardware',
    'Citlalli Sarai Rivera Escareño',
    'citlallisarar@gmail.com',
    false,
    3,
    95,
    true,
    '2026-10-10T14:30:00.000Z'
),
(
    'fundamento-fisiologico-neoangiogenesis-temperatura',
    'Fundamento biológico: La neoangiogénesis y los gradientes térmicos en la detección temprana',
    'Las células cancerosas requieren glucólisis acelerada y nuevos vasos sanguíneos, generando elevaciones térmicas localizadas detectables en la piel.',
    'La base científica de MedicHands reposa en un fenómeno oncológico demostrado: para que un tumor crezca más allá de dos milímetros cúbicos, debe secretar factores de crecimiento vascular endotelial (VEGF), iniciando la **neoangiogénesis**.

### Flujo Sanguíneo y Tasa Metabólica
Esta vascularización desordenada y la tasa hipermetabólica tumoral disipan calor hacia los tejidos circundantes, generando gradientes en la epidermis de **0.8°C a 3.2°C** por encima del tejido normal contralateral.

### Regla Explicable de Asimetría Térmica
En lugar de depender de algoritmos de inteligencia artificial opacos ("caja negra"), el software de MedicHands procesa en el borde (*Edge Computing*) una regla de asimetría intermamaria contralateral:
$$\Delta T = |T_{\text{izquierdo}, i} - T_{\text{derecho}, i}| > 0.8^\circ\text{C}$$

Si el diferencial persistente supera los $0.8^\circ\text{C}$, el sistema asigna una **alerta cromática de nivel Rojo**, recomendando de manera transparente una consulta médica especializada.',
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
    'Fundamento Científico',
    'Efraín Alejandro Arias Meza',
    'efrainarias@gmail.com',
    false,
    5,
    184,
    true,
    '2026-10-05T09:15:00.000Z'
),
(
    'precision-tecnica-articulo-cientifico-universidad-colima',
    '94.2% de precisión técnica: Resultados del artículo científico publicado por la Universidad de Colima',
    'Validación del motor asíncrono en Go y la escala cromática de 3 niveles sobre una población sintética multivariada de 150 individuos.',
    'Investigadores de la Universidad de Colima publicaron formalmente el artículo titulado *"Asynchronous Monitoring System for Thermal Anomalies Associated with Breast Tumor Formation"*.

### Metodología de Validación
Ante la falta de bases de datos termográficas públicas en México, el equipo desarrolló un modelo matemático en Python para simular una población sintética de 150 sujetos, integrando variaciones de índice de masa corporal (IMC), edad y una probabilidad de anomalía del 12%.

### Resultados Clave
* **Sujetos normales:** Asimetría promedio de $0.127^\circ\text{C}$.
* **Sujetos con anomalía:** Asimetría promedio de $0.813^\circ\text{C}$, con picos locales de hasta $38.3^\circ\text{C}$.
* **Precisión del software:** **94.2%** en la asignación correcta del nivel de alerta cromática (Blanco, Amarillo o Rojo).

El estudio subraya que este resultado valida la arquitectura lógica del sistema y el flujo asíncrono, constituyendo la base para los futuros ensayos físicos en modelos de silicona y pacientes clínicos.',
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
    'Publicación Oficial',
    'Equipo MedicHands',
    'contacto@medichands.org',
    true,
    4,
    210,
    true,
    '2026-09-28T16:00:00.000Z'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    excerpt = EXCLUDED.excerpt,
    content = EXCLUDED.content,
    cover_image = EXCLUDED.cover_image,
    category = EXCLUDED.category,
    author_name = EXCLUDED.author_name,
    author_email = EXCLUDED.author_email,
    is_team_author = EXCLUDED.is_team_author,
    reading_time_minutes = EXCLUDED.reading_time_minutes,
    is_published = EXCLUDED.is_published,
    published_at = EXCLUDED.published_at;
