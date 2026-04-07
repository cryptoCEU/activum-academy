export const courseData = {
  title: "Tokenización de Activos Inmobiliarios en España",
  subtitle: "De los Fundamentos a la Práctica",
  duration: "8 horas",
  lessons: 52,
  modules: [
    {
      id: 0,
      title: "Introducción y Bienvenida",
      emoji: "🎯",
      color: "#C4A96A",
      lessons: [
        {
          id: "0-1",
          title: "Presentación del curso",
          duration: "5 min",
          content: `
            <h2>Bienvenido a Activum Academy</h2>
            <p>Este curso te llevará desde los conceptos más básicos de la tokenización inmobiliaria hasta la aplicación práctica en el mercado español. Está diseñado para profesionales del sector inmobiliario, inversores, asesores legales y financieros, y emprendedores PropTech.</p>
            <div class="highlight-box"><p><strong>¿Qué aprenderás?</strong> Al finalizar este curso serás capaz de entender, evaluar y participar en proyectos de tokenización inmobiliaria en España con criterio técnico, legal y financiero.</p></div>
            <h3>Perfil del alumno ideal</h3>
            <ul>
              <li>Profesionales del sector inmobiliario que quieren entender el futuro del mercado</li>
              <li>Inversores que buscan nuevas vías de acceso a activos reales</li>
              <li>Abogados y asesores fiscales con clientes en PropTech</li>
              <li>Emprendedores que quieren lanzar plataformas de tokenización</li>
              <li>Directivos de promotoras y gestoras que evalúan nuevas fuentes de financiación</li>
            </ul>
            <h3>Nivel requerido</h3>
            <p>Nivel intermedio. No se necesitan conocimientos técnicos profundos de blockchain, pero sí comprensión básica del mercado inmobiliario y nociones financieras elementales.</p>
          `
        },
        {
          id: "0-2",
          title: "Cómo aprovechar el curso",
          duration: "5 min",
          content: `
            <h2>Metodología de aprendizaje</h2>
            <p>El curso está estructurado en 10 módulos con progresión lógica. Puedes seguirlo de forma lineal o saltar a los módulos que más te interesen si ya tienes conocimientos previos.</p>
            <h3>Estructura de cada módulo</h3>
            <ul>
              <li><strong>Lecciones teóricas:</strong> contenido estructurado con ejemplos reales del mercado español</li>
              <li><strong>Casos prácticos:</strong> análisis de proyectos reales con estructura, proceso y resultados</li>
              <li><strong>Quiz de módulo:</strong> valida tu comprensión antes de avanzar</li>
            </ul>
            <h3>Recursos adicionales</h3>
            <ul>
              <li>Glosario completo descargable (más de 80 términos)</li>
              <li>Checklist de due diligence para inversores</li>
              <li>Tabla comparativa de plataformas actualizadas</li>
              <li>Resumen del marco legal MiCA + España</li>
            </ul>
            <div class="highlight-box"><p><strong>Consejo:</strong> Dedica entre 45-60 minutos por módulo y toma notas sobre cómo cada concepto aplica a tu contexto profesional específico.</p></div>
          `
        },
        {
          id: "0-3",
          title: "Glosario de términos clave",
          duration: "10 min",
          content: `
            <h2>Glosario Fundamental</h2>
            <p>Familiarízate con estos términos antes de comenzar. Los encontrarás a lo largo de todo el curso.</p>
            <div class="info-grid">
              <div class="info-card"><div class="card-title">Token</div><div class="card-value">Unidad digital</div></div>
              <div class="info-card"><div class="card-title">Blockchain</div><div class="card-value">Registro distribuido</div></div>
              <div class="info-card"><div class="card-title">Smart Contract</div><div class="card-value">Contrato autoejectable</div></div>
              <div class="info-card"><div class="card-title">SPV</div><div class="card-value">Vehículo de propósito especial</div></div>
            </div>
            <h3>Términos tecnológicos</h3>
            <ul>
              <li><strong>Blockchain:</strong> base de datos distribuida e inmutable que registra transacciones verificadas por consenso</li>
              <li><strong>Token:</strong> representación digital de un activo o derecho, emitida en una blockchain</li>
              <li><strong>Smart Contract:</strong> código que se ejecuta automáticamente cuando se cumplen condiciones predefinidas</li>
              <li><strong>Wallet:</strong> dirección en blockchain que permite recibir, almacenar y enviar tokens</li>
              <li><strong>DeFi:</strong> finanzas descentralizadas — servicios financieros sobre blockchain sin intermediarios tradicionales</li>
              <li><strong>NFT:</strong> token no fungible — unidad digital única e irrepetible</li>
            </ul>
            <h3>Términos jurídicos y financieros</h3>
            <ul>
              <li><strong>Security Token (ST):</strong> token que representa un valor negociable con derechos económicos o de propiedad</li>
              <li><strong>SPV / Sociedad Vehículo:</strong> entidad jurídica creada específicamente para aislar un activo y sus riesgos</li>
              <li><strong>Due diligence:</strong> proceso de investigación exhaustiva de un activo antes de invertir</li>
              <li><strong>Yield:</strong> rentabilidad expresada como porcentaje anual sobre el capital invertido</li>
              <li><strong>MiCA:</strong> Markets in Crypto-Assets — reglamento europeo que regula los criptoactivos</li>
              <li><strong>KYC/AML:</strong> Know Your Customer / Anti-Money Laundering — procesos de verificación de identidad</li>
              <li><strong>SOCIMI:</strong> Sociedad Cotizada de Inversión en el Mercado Inmobiliario — equivalente español al REIT</li>
            </ul>
          `
        }
      ],
      quiz: {
        questions: [
          {
            q: "¿Cuál es el nivel requerido para este curso?",
            options: ["Experto en blockchain", "Intermedio, con conocimientos básicos del sector", "Sin conocimientos previos necesarios", "Solo para desarrolladores técnicos"],
            answer: 1
          },
          {
            q: "¿Qué es un Smart Contract?",
            options: ["Un contrato notarial digitalizado", "Código que se ejecuta automáticamente cuando se cumplen condiciones", "Una criptomoneda vinculada a un inmueble", "Un sistema de firma electrónica"],
            answer: 1
          },
          {
            q: "¿Qué significa MiCA?",
            options: ["Mercado Inmobiliario Cripto Avanzado", "Markets in Crypto-Assets — reglamento europeo", "Módulo de Inversión en Criptoactivos", "Marco de Integración de Criptoactivos"],
            answer: 1
          }
        ]
      }
    },
    {
      id: 1,
      title: "Fundamentos del Sector Inmobiliario",
      emoji: "🏛️",
      color: "#8C9BAD",
      lessons: [
        {
          id: "1-1",
          title: "El mercado inmobiliario en España",
          duration: "12 min",
          content: `
            <h2>El Mercado Inmobiliario Español: Estructura y Magnitudes</h2>
            <p>España es el cuarto mercado inmobiliario de la eurozona por volumen de transacciones. Con más de 600.000 compraventas anuales y un stock de más de 25 millones de viviendas, el sector representa aproximadamente el 10% del PIB nacional.</p>
            <div class="info-grid">
              <div class="info-card"><div class="card-title">Transacciones anuales</div><div class="card-value">~640.000</div></div>
              <div class="info-card"><div class="card-title">Precio medio m² España</div><div class="card-value">~2.100€</div></div>
              <div class="info-card"><div class="card-title">Inversión inmobiliaria</div><div class="card-value">~12.000M€</div></div>
              <div class="info-card"><div class="card-title">% del PIB</div><div class="card-value">~10%</div></div>
            </div>
            <h3>Principales actores del mercado</h3>
            <ul>
              <li><strong>Promotoras:</strong> Metrovacesa, Neinor, Vía Célere, Aedas, Kronos Homes</li>
              <li><strong>Gestoras de patrimonio:</strong> CBRE, JLL, Savills, Colliers</li>
              <li><strong>SOCIMIs:</strong> Merlin Properties, Colonial, Lar España, Castellana Properties</li>
              <li><strong>Fondos internacionales:</strong> Blackstone, CBRE IM, Azora, Patrizia</li>
              <li><strong>Banca:</strong> CaixaBank, BBVA, Sabadell como financiadores principales</li>
            </ul>
            <h3>Segmentos del mercado</h3>
            <ul>
              <li><strong>Residencial:</strong> vivienda en venta y alquiler, obra nueva y segunda mano</li>
              <li><strong>Oficinas:</strong> principales mercados en Madrid y Barcelona</li>
              <li><strong>Logístico:</strong> el segmento de mayor crecimiento post-pandemia</li>
              <li><strong>Retail:</strong> centros comerciales y locales a pie de calle</li>
              <li><strong>Hotelero:</strong> España como segundo destino turístico mundial</li>
              <li><strong>Alternativo:</strong> flex-living, coliving, PBSA, senior living — en fuerte expansión</li>
            </ul>
          `
        },
        {
          id: "1-2",
          title: "Barreras de la inversión tradicional",
          duration: "10 min",
          content: `
            <h2>Las 5 Grandes Barreras del Sector Inmobiliario Tradicional</h2>
            <p>A pesar de su solidez como activo refugio, la inversión inmobiliaria tradicional presenta barreras estructurales que limitan el acceso y la eficiencia del mercado.</p>
            <h3>1. Alta iliquidez</h3>
            <p>Un inmueble no se vende de un día para otro. Los plazos medios de venta en España oscilan entre 3 y 6 meses, con procesos notariales, registrales y financieros que añaden semanas adicionales. Esta iliquidez supone un riesgo real para el inversor que necesita capital a corto plazo.</p>
            <h3>2. Elevado capital mínimo de entrada</h3>
            <p>El precio medio de una vivienda en Madrid supera los 350.000€. Incluso con financiación bancaria al 80%, se necesitan más de 70.000€ de entrada más gastos (ITP/AJD, notaría, registro, gestoría). Esto excluye sistemáticamente al inversor retail de muchos mercados.</p>
            <h3>3. Opacidad del mercado</h3>
            <p>No existe un precio oficial en tiempo real como en bolsa. La información de transacciones (precio real escriturado) no es pública de forma sistemática. Esto genera asimetrías de información entre compradores expertos e inexpertos.</p>
            <h3>4. Costes de transacción elevados</h3>
            <ul>
              <li>ITP (segunda mano): 6-10% según CC.AA.</li>
              <li>IVA + AJD (obra nueva): 10% + 1,5%</li>
              <li>Notaría: 0,2-0,5% del valor</li>
              <li>Registro de la Propiedad: 0,1-0,3%</li>
              <li>Agencia inmobiliaria: 3-5% sobre precio de venta</li>
            </ul>
            <h3>5. Procesos lentos y burocratizados</h3>
            <p>Una compraventa compleja puede requerir intervención de notario, registrador, gestoría, tasadora, entidad bancaria, agente y abogado. Cada uno añade tiempo y coste al proceso.</p>
            <div class="highlight-box"><p>Estas cinco barreras son precisamente las que la tokenización inmobiliaria busca reducir o eliminar mediante el uso de blockchain y smart contracts.</p></div>
          `
        },
        {
          id: "1-3",
          title: "SOCIMIs, FIIs y REITs",
          duration: "10 min",
          content: `
            <h2>Vehículos de Inversión Inmobiliaria Colectiva</h2>
            <p>Antes de la tokenización, los vehículos colectivos ya intentaron democratizar el acceso a la inversión inmobiliaria. Entender sus ventajas y limitaciones es clave para apreciar la propuesta de valor de los tokens.</p>
            <h3>SOCIMI — Sociedad Cotizada de Inversión Inmobiliaria</h3>
            <ul>
              <li>Equivalente español del REIT anglosajón, creada en 2009</li>
              <li>Obligada a distribuir el 80% de los dividendos</li>
              <li>Cotizada en bolsa (BME, MAB/BME Growth)</li>
              <li>Tributación bonificada al 0% en IS si cumple requisitos</li>
              <li><strong>Limitación:</strong> inversión mínima = el precio de una acción; pero se pierde la exposición directa a un activo concreto</li>
            </ul>
            <h3>Fondos de Inversión Inmobiliaria (FII)</h3>
            <ul>
              <li>Inversión colectiva en carteras de inmuebles</li>
              <li>Liquidez periódica (no diaria) — ventanas de reembolso trimestrales o anuales</li>
              <li>Ticket mínimo desde 1.000€ en algunos fondos retail</li>
              <li><strong>Limitación:</strong> comisiones de gestión (1,5-2%), falta de transparencia sobre activos individuales</li>
            </ul>
            <h3>Crowdfunding inmobiliario</h3>
            <ul>
              <li>Plataformas como Urbanitae, Housers, Civislend</li>
              <li>Ticket desde 500€, proyectos concretos</li>
              <li>Regulado por CNMV bajo Reglamento UE 2020/1503</li>
              <li><strong>Limitación:</strong> ausencia de mercado secundario (inversión ilíquida hasta vencimiento), límites de inversión para no acreditados</li>
            </ul>
            <div class="highlight-box"><p>La tokenización comparte muchas características con estos vehículos pero añade liquidez secundaria en tiempo real, granularidad máxima del activo y trazabilidad on-chain.</p></div>
          `
        },
        {
          id: "1-4",
          title: "¿Por qué tokenizar?",
          duration: "8 min",
          content: `
            <h2>La Propuesta de Valor de la Tokenización Inmobiliaria</h2>
            <p>La tokenización no es un fin en sí misma — es una herramienta que resuelve problemas concretos del mercado inmobiliario tradicional. Su valor se materializa en cinco dimensiones.</p>
            <h3>Fraccionamiento sin límites</h3>
            <p>Un edificio de 5M€ puede dividirse en 50.000 tokens de 100€ cada uno. Cualquier inversor con 100€ puede tener exposición real a ese activo, con sus rentas proporcionales y participación en la plusvalía futura.</p>
            <h3>Liquidez en mercado secundario</h3>
            <p>Los tokens pueden negociarse en plataformas especializadas, potencialmente en tiempo real, sin esperar a que se venda el activo subyacente. El inversor puede salir de su posición vendiendo sus tokens a otro inversor interesado.</p>
            <h3>Automatización de rentas y dividendos</h3>
            <p>Los smart contracts distribuyen automáticamente las rentas de alquiler entre todos los tenedores de tokens, en proporción a su participación, sin intervención manual ni costes administrativos adicionales.</p>
            <h3>Transparencia total</h3>
            <p>Toda la actividad del activo queda registrada en blockchain: compras, ventas, distribuciones de rentas, cambios de propietario. Cualquier inversor puede auditar el historial completo en tiempo real.</p>
            <h3>Acceso global a inversores</h3>
            <p>Un activo en Málaga puede ser invertido por un inversor en Tokio, Frankfurt o Ciudad de México, las 24 horas del día, los 365 días del año, sin necesidad de intermediarios físicos ni procesos notariales transfronterizos.</p>
          `
        }
      ],
      quiz: {
        questions: [
          {
            q: "¿Cuál es la principal limitación de las SOCIMIs como vehículo de inversión?",
            options: ["Su alta tributación", "La pérdida de exposición directa a activos concretos", "El precio demasiado bajo de las acciones", "Que solo invierten en oficinas"],
            answer: 1
          },
          {
            q: "¿Cuánto representa el sector inmobiliario aproximadamente en el PIB español?",
            options: ["3%", "20%", "10%", "35%"],
            answer: 2
          },
          {
            q: "¿Qué es el 'fraccionamiento' en el contexto de la tokenización?",
            options: ["Dividir un inmueble físicamente en partes", "Representar un activo en múltiples tokens de menor valor", "Un tipo de hipoteca parcial", "La venta de inmuebles por habitaciones"],
            answer: 1
          },
          {
            q: "¿Qué coste tiene aproximadamente el ITP en una compraventa de segunda mano en España?",
            options: ["0,5-1%", "2-3%", "6-10%", "15-20%"],
            answer: 2
          }
        ]
      }
    },
    {
      id: 2,
      title: "Definiciones y Conceptos Clave",
      emoji: "📚",
      color: "#6B8FAD",
      lessons: [
        {
          id: "2-1",
          title: "¿Qué es la tokenización de activos?",
          duration: "12 min",
          content: `
            <h2>Definición Técnica y Práctica</h2>
            <p>La <strong>tokenización de activos</strong> es el proceso por el cual los derechos sobre un activo del mundo real — en este caso, un inmueble — se representan mediante tokens digitales emitidos en una blockchain.</p>
            <div class="highlight-box"><p>Tokenizar un activo ≠ digitalizarlo. Un PDF de una escritura es digitalización. Un token en blockchain que representa la propiedad de esa vivienda es tokenización.</p></div>
            <h3>Los tres elementos de la tokenización</h3>
            <ul>
              <li><strong>El activo subyacente:</strong> el inmueble real (edificio, local, solar, proyecto) con su valor físico y jurídico</li>
              <li><strong>La estructura legal:</strong> el vínculo jurídico que conecta el token con los derechos sobre el activo (SPV, contrato, escritura)</li>
              <li><strong>El token en blockchain:</strong> la representación digital del derecho, transferible y auditable</li>
            </ul>
            <h3>Token vs. Criptomoneda vs. NFT</h3>
            <ul>
              <li><strong>Criptomoneda (Bitcoin, Ether):</strong> divisa digital sin respaldo de activo real. Su valor viene determinado por oferta y demanda del mercado</li>
              <li><strong>Token de activo real:</strong> su valor está respaldado por un activo físico existente. Si el edificio vale 5M€ y hay 50.000 tokens, cada token vale 100€</li>
              <li><strong>NFT (Non-Fungible Token):</strong> token único e irrepetible. Útil para certificados de propiedad, pero no para fraccionamiento (porque cada token sería distinto)</li>
            </ul>
            <h3>¿Por qué blockchain y no una base de datos tradicional?</h3>
            <p>Porque blockchain aporta tres propiedades que ninguna base de datos centralizada puede garantizar de la misma forma: <strong>inmutabilidad</strong> (nadie puede alterar el historial), <strong>descentralización</strong> (no hay un único punto de fallo o control) y <strong>transparencia verificable</strong> (cualquiera puede auditar sin necesidad de confiar en un intermediario).</p>
          `
        },
        {
          id: "2-2",
          title: "Tipos de tokens en el sector inmobiliario",
          duration: "15 min",
          content: `
            <h2>Taxonomía de Tokens Inmobiliarios</h2>
            <p>No todos los tokens son iguales. La clasificación es crucial porque determina el régimen regulatorio aplicable, los derechos del tenedor y el tratamiento fiscal.</p>
            <h3>Security Tokens (ST) — Los más relevantes para real estate</h3>
            <p>Representan derechos económicos o de propiedad sobre un activo. Son la categoría más importante para tokenización inmobiliaria porque otorgan al tenedor derechos reales: participación en rentas, plusvalías, voto en decisiones del activo.</p>
            <ul>
              <li>Regulados como valores negociables (en España: LMV + supervisión CNMV)</li>
              <li>Requieren prospecto de emisión en muchos casos</li>
              <li>Solo pueden comprarse tras proceso KYC/AML</li>
              <li>Ejemplo: token que representa el 0,1% de un edificio de oficinas en Madrid</li>
            </ul>
            <h3>Utility Tokens</h3>
            <p>Otorgan acceso a un servicio dentro de una plataforma específica, no derechos de propiedad. En inmobiliario su uso es más limitado.</p>
            <ul>
              <li>Ejemplo: tokens para acceder a espacios de coworking o amenidades de un edificio</li>
              <li>No están regulados como valores (menor protección al inversor)</li>
            </ul>
            <h3>NFTs Inmobiliarios</h3>
            <ul>
              <li>Certificados únicos de propiedad de un inmueble concreto</li>
              <li>Derechos de uso exclusivo (ej: semana en un resort, plaza de parking única)</li>
              <li>Aún sin marco regulatorio claro en España</li>
            </ul>
            <h3>Stablecoins en transacciones inmobiliarias</h3>
            <p>No representan el activo, sino la moneda de liquidación. Son criptomonedas cuyo valor está anclado a una divisa fiat (generalmente USD o EUR). Se usan para pagar la compra de tokens o recibir distribuciones de renta sin volatilidad de precio.</p>
            <ul>
              <li>EURC, EURS: stablecoins en euros más usadas en Europa</li>
              <li>USDC, USDT: las más líquidas a nivel global</li>
              <li>EUROC de Circle: respaldada 1:1 por euros en cuenta bancaria</li>
            </ul>
          `
        },
        {
          id: "2-3",
          title: "¿Qué activos se pueden tokenizar?",
          duration: "12 min",
          content: `
            <h2>Universo de Activos Tokenizables en España</h2>
            <p>En teoría, cualquier activo inmobiliario con valor económico puede tokenizarse. En la práctica, algunos tipos de activos encajan mejor que otros con la estructura y los costes de la tokenización.</p>
            <h3>Activos residenciales</h3>
            <ul>
              <li>Viviendas en alquiler (carteras de PRS/BTR)</li>
              <li>Promociones de obra nueva (financiación via tokens de deuda o equity)</li>
              <li>Viviendas vacacionales con rentas compartidas</li>
            </ul>
            <h3>Activos comerciales</h3>
            <ul>
              <li>Oficinas en ciudades prime (Madrid CBD, Barcelona 22@)</li>
              <li>Locales comerciales de alta rotación</li>
              <li>Centros comerciales (tokenización de partes o todo el activo)</li>
              <li>Logístico: naves en corredores logísticos con contratos de larga duración</li>
            </ul>
            <h3>Activos alternativos (máximo potencial)</h3>
            <ul>
              <li><strong>Flex-living y coliving:</strong> rentas estables, gestión profesionalizada, ideal para tokenizar</li>
              <li><strong>Residencias de estudiantes (PBSA):</strong> demanda estable, arrendamientos cortos, yields atractivos</li>
              <li><strong>Senior living:</strong> megatendencia demográfica, activos de largo plazo</li>
              <li><strong>Hoteles:</strong> yields variables pero alta visibilidad en mercados prime</li>
            </ul>
            <h3>Deuda inmobiliaria</h3>
            <ul>
              <li>Préstamos promotor tokenizados (alternativa a financiación bancaria)</li>
              <li>Hipotecas fraccionadas en tokens de deuda</li>
              <li>Pagarés y bonos inmobiliarios on-chain</li>
            </ul>
            <div class="highlight-box"><p><strong>Regla general:</strong> cuanto mayor sea el activo, mayor la complejidad administrativa de tokenizarlo, pero también mayor el beneficio relativo en términos de acceso a inversores globales y liquidez.</p></div>
          `
        }
      ],
      quiz: {
        questions: [
          {
            q: "¿Cuál es la diferencia fundamental entre tokenización y digitalización de un activo?",
            options: ["No hay diferencia, son sinónimos", "La tokenización representa derechos en blockchain; la digitalización es simplemente convertir documentos a formato digital", "La tokenización es más barata", "La digitalización requiere blockchain"],
            answer: 1
          },
          {
            q: "¿Qué tipo de token es el más relevante para la inversión inmobiliaria?",
            options: ["Utility Token", "NFT inmobiliario", "Security Token", "Stablecoin"],
            answer: 2
          },
          {
            q: "¿Para qué se utilizan las stablecoins en transacciones inmobiliarias tokenizadas?",
            options: ["Para representar la propiedad del inmueble", "Como moneda de liquidación sin volatilidad de precio", "Para registrar el inmueble en blockchain", "Para hacer auditorías de smart contracts"],
            answer: 1
          }
        ]
      }
    },
    {
      id: 3,
      title: "Tecnología: Cómo Funciona",
      emoji: "⚙️",
      color: "#6BAD8A",
      lessons: [
        {
          id: "3-1",
          title: "Blockchain aplicada al sector inmobiliario",
          duration: "15 min",
          content: `
            <h2>Blockchain: El Libro de Contabilidad Global e Inmutable</h2>
            <p>Para entender la tokenización, es imprescindible tener claro qué es blockchain y por qué sus propiedades son especialmente valiosas para el sector inmobiliario.</p>
            <h3>Qué es blockchain</h3>
            <p>Una blockchain es una base de datos distribuida entre miles de nodos independientes, donde cada bloque de transacciones está criptográficamente vinculado al anterior, formando una cadena inmutable. No existe un servidor central que controle los datos — la confianza la proporciona el consenso matemático.</p>
            <h3>Blockchain pública vs. privada vs. permisionada</h3>
            <ul>
              <li><strong>Pública (Ethereum, Polygon):</strong> cualquiera puede participar, máxima transparencia y descentralización. Costes de transacción variables (gas fees)</li>
              <li><strong>Privada (Hyperledger Fabric):</strong> solo acceden participantes autorizados. Velocidad alta, coste bajo, pero menor descentralización</li>
              <li><strong>Permisionada (Corda, Quorum):</strong> híbrido — participación controlada pero con mayor transparencia que las privadas. Favorita del sector financiero institucional</li>
            </ul>
            <h3>Las tres propiedades clave para real estate</h3>
            <ul>
              <li><strong>Inmutabilidad:</strong> una vez registrada la compraventa de tokens, nadie puede alterarla retroactivamente. Equivalente a un registro de la propiedad incorruptible</li>
              <li><strong>Transparencia:</strong> cualquier inversor puede verificar el historial completo de transacciones de un activo sin depender de terceros</li>
              <li><strong>Programabilidad:</strong> el activo puede tener reglas codificadas (quién puede comprar, qué pasa si no se paga la renta, cómo se distribuyen los beneficios)</li>
            </ul>
          `
        },
        {
          id: "3-2",
          title: "Smart Contracts: el motor de la tokenización",
          duration: "15 min",
          content: `
            <h2>Smart Contracts en Tokenización Inmobiliaria</h2>
            <p>Si blockchain es la infraestructura, los smart contracts son la lógica de negocio. Son programas informáticos que se ejecutan automáticamente en blockchain cuando se cumplen condiciones predefinidas, sin necesidad de intermediarios humanos.</p>
            <h3>¿Cómo funcionan en la práctica?</h3>
            <p>Imagina un edificio de apartamentos tokenizado. El smart contract puede programarse para: cobrar la renta mensual de los inquilinos, descontar los gastos de gestión y mantenimiento, calcular la parte proporcional de cada inversor y transferirla automáticamente a sus wallets — todo sin intervención de un gestor humano.</p>
            <h3>Casos de automatización en real estate</h3>
            <ul>
              <li><strong>Distribución de rentas:</strong> pagos automáticos mensuales proporcionales a tokens poseídos</li>
              <li><strong>Vesting de tokens:</strong> los founders o promotores van liberando tokens según hitos de obra</li>
              <li><strong>Mecanismos de recompra:</strong> el promotor puede recomprar tokens a precio preestablecido al vencimiento</li>
              <li><strong>Gobierno del activo:</strong> votaciones on-chain para decisiones importantes (vender el activo, reformar, cambiar de gestor)</li>
              <li><strong>Restricciones de transferencia:</strong> solo pueden recibir tokens inversores que hayan pasado KYC</li>
            </ul>
            <h3>Limitaciones actuales</h3>
            <ul>
              <li><strong>El problema del oráculo:</strong> los smart contracts no tienen acceso nativo a datos del mundo real (¿cuánto vale el edificio hoy? ¿se ha pagado la renta?). Necesitan fuentes externas de datos verificadas</li>
              <li><strong>Bugs de código:</strong> si el smart contract tiene un error, puede ser explotado. Las auditorías de código son imprescindibles</li>
              <li><strong>Irreversibilidad:</strong> una transacción mal ejecutada en blockchain no puede deshacerse fácilmente</li>
            </ul>
            <div class="highlight-box"><p>Un smart contract bien auditado puede reemplazar a notarios, gestores de rentas, administradores de comunidades y parte del trabajo de los abogados en transacciones repetitivas y bien definidas.</p></div>
          `
        },
        {
          id: "3-3",
          title: "Redes blockchain y estándares de tokens",
          duration: "12 min",
          content: `
            <h2>Infraestructura Técnica: Elegir la Red Adecuada</h2>
            <p>La elección de la red blockchain tiene implicaciones en coste, velocidad, seguridad y cumplimiento normativo. Para tokenización inmobiliaria, no todas las redes son iguales.</p>
            <h3>Ethereum — El estándar de facto</h3>
            <ul>
              <li>La red más descentralizada y segura para activos de valor</li>
              <li>Gas fees históricamente altos (aunque reducidos con L2s)</li>
              <li>Mayor ecosistema de herramientas, auditores y proveedores</li>
              <li>ERC-20: estándar básico de tokens fungibles</li>
            </ul>
            <h3>ERC-3643 (T-REX) — El estándar líder para Security Tokens</h3>
            <p>Desarrollado por Tokeny Solutions, ERC-3643 es el estándar más adoptado para Security Tokens. Incorpora nativamente:</p>
            <ul>
              <li>Identidad digital on-chain de los inversores</li>
              <li>Restricciones de transferencia basadas en compliance (KYC/AML)</li>
              <li>Congelación de tokens en caso de orden judicial</li>
              <li>Recuperación de tokens en caso de pérdida de wallet</li>
            </ul>
            <h3>Polygon, Avalanche, Stellar</h3>
            <ul>
              <li><strong>Polygon:</strong> compatible con Ethereum, costes mínimos, alta velocidad — popular en plataformas retail</li>
              <li><strong>Avalanche:</strong> subnets personalizadas con reglas de compliance propias</li>
              <li><strong>Stellar:</strong> diseñado para pagos y tokenización de activos, muy eficiente energéticamente</li>
            </ul>
            <h3>Soluciones de custodia institucional</h3>
            <p>Para inversores institucionales, la custodia segura de los tokens es crítica. Plataformas como <strong>Fireblocks</strong>, <strong>Copper</strong> y <strong>BitGo</strong> ofrecen custodia de grado institucional con seguros, conformidad regulatoria y integración con sistemas bancarios tradicionales.</p>
          `
        }
      ],
      quiz: {
        questions: [
          {
            q: "¿Qué estándar de token es el más utilizado para Security Tokens con cumplimiento normativo integrado?",
            options: ["ERC-20", "ERC-721 (NFT)", "ERC-3643 (T-REX)", "BEP-20"],
            answer: 2
          },
          {
            q: "¿Cuál es 'el problema del oráculo' en smart contracts?",
            options: ["Los contratos son demasiado lentos", "Los smart contracts no tienen acceso nativo a datos del mundo real", "Los oráculos son empresas que cobran demasiado", "Solo funciona en Ethereum"],
            answer: 1
          },
          {
            q: "¿Qué diferencia principal tiene una blockchain privada frente a una pública?",
            options: ["Es más cara", "Solo acceden participantes autorizados, mayor velocidad pero menor descentralización", "No puede usar smart contracts", "Está prohibida en Europa"],
            answer: 1
          }
        ]
      }
    },
    {
      id: 4,
      title: "Regulación y Marco Legal",
      emoji: "⚖️",
      color: "#AD906B",
      lessons: [
        {
          id: "4-1",
          title: "MiCA: El reglamento europeo de criptoactivos",
          duration: "18 min",
          content: `
            <h2>MiCA — Markets in Crypto-Assets Regulation</h2>
            <p>El Reglamento (UE) 2023/1114, conocido como MiCA, es el primer marco regulatorio integral para criptoactivos en la Unión Europea. Su entrada en vigor representa un hito histórico para la industria.</p>
            <h3>Ámbito de aplicación</h3>
            <p>MiCA regula la emisión y prestación de servicios relacionados con criptoactivos en la UE. Se aplica a emisores de tokens y proveedores de servicios de criptoactivos (CASPs). Sin embargo, tiene exclusiones importantes:</p>
            <ul>
              <li><strong>No aplica a Security Tokens</strong> (que ya están cubiertos por MiFID II / directivas de mercados de valores)</li>
              <li>No aplica a CBDCs (monedas digitales de banco central)</li>
              <li>Exclusión parcial para NFTs únicos (no colecciones fungibles)</li>
            </ul>
            <div class="highlight-box"><p><strong>Clave para real estate:</strong> Los Security Tokens inmobiliarios están fuera del ámbito de MiCA, pero los emisores deben cumplir las directivas de mercados de valores (MiFID II, Prospectus Regulation) supervisadas por la CNMV en España.</p></div>
            <h3>Categorías de tokens bajo MiCA</h3>
            <ul>
              <li><strong>E-money tokens (EMT):</strong> stablecoins referenciadas a una sola moneda fiat</li>
              <li><strong>Asset-referenced tokens (ART):</strong> tokens respaldados por cesta de activos o monedas</li>
              <li><strong>Otros criptoactivos:</strong> utility tokens y tokens de uso general</li>
            </ul>
            <h3>Calendario de implementación en España</h3>
            <ul>
              <li><strong>Junio 2024:</strong> aplicación de normas sobre stablecoins (EMT y ART)</li>
              <li><strong>Diciembre 2024:</strong> aplicación completa para todos los CASPs</li>
              <li><strong>2025:</strong> plenas obligaciones de licencia para exchanges y custodios en España</li>
            </ul>
          `
        },
        {
          id: "4-2",
          title: "Marco legal en España: CNMV y LMV",
          duration: "15 min",
          content: `
            <h2>España: El Marco Específico para Tokenización Inmobiliaria</h2>
            <p>En España, la tokenización inmobiliaria opera principalmente en el ámbito de los valores negociables, bajo supervisión de la CNMV. No existe aún una ley específica de tokenización inmobiliaria, pero el marco existente ya permite estructurar operaciones.</p>
            <h3>La CNMV y los Security Tokens</h3>
            <p>La CNMV publicó en 2019 su primera comunicación sobre criptoactivos, reconociendo que los Security Tokens son valores negociables sujetos a la LMV. En 2022 amplió la orientación, clarificando los requisitos de emisión.</p>
            <ul>
              <li>Una STO (Security Token Offering) en España puede requerir prospecto aprobado por CNMV</li>
              <li>Umbral de exención: emisiones inferiores a 5M€ en 12 meses a nivel UE están exentas de prospecto completo</li>
              <li>Se puede usar un documento informativo simplificado (DIF)</li>
            </ul>
            <h3>Estructuras jurídicas principales</h3>
            <ul>
              <li><strong>Tokenización directa de propiedad:</strong> transmisión de cuota indivisa de la propiedad — requiere escritura pública e inscripción registral para cada inversión, impracticable a gran escala actualmente</li>
              <li><strong>Tokenización vía SPV (SL/SA):</strong> se crea una sociedad que posee el inmueble; los tokens representan participaciones en esa sociedad. Estructura más usada en España</li>
              <li><strong>Deuda tokenizada:</strong> la empresa promotora emite pagarés o bonos en formato token. Los inversores son prestamistas, no propietarios</li>
              <li><strong>SOCIMI tokenizada:</strong> en teoría posible, pero requiere cotización en mercado regulado — pendiente de desarrollo regulatorio específico</li>
            </ul>
            <h3>Fiscalidad para el inversor español</h3>
            <ul>
              <li>Rentas percibidas por tokens: rendimientos del capital mobiliario (base del ahorro, 19-28%)</li>
              <li>Plusvalías por venta de tokens: ganancia patrimonial (misma base del ahorro)</li>
              <li>Modelo 721: obligación de declarar tokens en el extranjero si supera 50.000€</li>
              <li>ITP/AJD: debate abierto sobre aplicación a transmisiones de tokens que representan inmuebles</li>
            </ul>
          `
        },
        {
          id: "4-3",
          title: "KYC, AML y protección del inversor",
          duration: "10 min",
          content: `
            <h2>Compliance: KYC, AML y GDPR en Plataformas de Tokenización</h2>
            <p>Las plataformas de tokenización inmobiliaria que emiten o facilitan la compraventa de Security Tokens tienen obligaciones legales significativas en materia de prevención de blanqueo y protección de datos.</p>
            <h3>KYC — Know Your Customer</h3>
            <p>Antes de permitir que un inversor compre tokens, la plataforma debe verificar su identidad. El proceso estándar incluye:</p>
            <ul>
              <li>Verificación de documento de identidad (DNI, pasaporte)</li>
              <li>Prueba de vida (selfie en tiempo real)</li>
              <li>Verificación de dirección (extracto bancario, factura)</li>
              <li>Clasificación como inversor minorista o cualificado</li>
              <li>Cuestionario de origen de fondos para inversiones significativas</li>
            </ul>
            <h3>AML — Anti-Money Laundering</h3>
            <ul>
              <li>Monitoreo continuo de transacciones sospechosas</li>
              <li>Screening contra listas de sanciones (OFAC, UE, ONU)</li>
              <li>Reporte a SEPBLAC (Servicio Ejecutivo de Prevención del Blanqueo) en España</li>
              <li>Conservación de registros durante 10 años mínimo</li>
            </ul>
            <h3>GDPR y blockchain: el reto de la inmutabilidad</h3>
            <p>La tensión entre la inmutabilidad de blockchain y el derecho al olvido del GDPR es uno de los desafíos técnico-legales más interesantes. Las soluciones incluyen:</p>
            <ul>
              <li>Almacenamiento off-chain de datos personales; solo hashes en blockchain</li>
              <li>Cifrado de datos con posibilidad de destruir la clave (pseudo-olvido)</li>
              <li>Identidad digital self-sovereign (SSI) que el usuario controla</li>
            </ul>
          `
        }
      ],
      quiz: {
        questions: [
          {
            q: "¿Los Security Tokens inmobiliarios están cubiertos por MiCA?",
            options: ["Sí, es la regulación principal que los cubre", "No, están excluidos de MiCA y se rigen por las directivas de mercados de valores (MiFID II)", "Solo parcialmente, los de menos de 1M€", "Sí, pero solo desde 2025"],
            answer: 1
          },
          {
            q: "¿A partir de qué umbral de emisión en España se requiere un prospecto completo aprobado por la CNMV?",
            options: ["500.000€", "1M€", "5M€", "10M€"],
            answer: 2
          },
          {
            q: "¿Qué es el Modelo 721 en España?",
            options: ["El formulario para crear una SOCIMI", "La declaración obligatoria de criptoactivos en el extranjero que superen 50.000€", "El impuesto sobre transmisiones de tokens", "El registro de plataformas de tokenización ante la CNMV"],
            answer: 1
          }
        ]
      }
    },
    {
      id: 5,
      title: "Modelos de Negocio y Casos de Uso",
      emoji: "💼",
      color: "#AD8C6B",
      lessons: [
        {
          id: "5-1",
          title: "Inversión fraccionada en residencial",
          duration: "12 min",
          content: `
            <h2>Inversión Fraccionada: Democratizando el Ladrillo</h2>
            <p>La inversión fraccionada es el caso de uso más conocido y el que más interés ha generado entre el público general. Permite a cualquier persona invertir en inmuebles de alquiler con importes desde decenas o cientos de euros.</p>
            <h3>¿Cómo funciona para el inversor retail?</h3>
            <ul>
              <li>La plataforma adquiere o estructura un inmueble en alquiler (ej: apartamento en Valencia, edificio en Sevilla)</li>
              <li>El activo se tokeniza en, por ejemplo, 10.000 tokens de 100€ cada uno</li>
              <li>El inversor compra tokens en la plataforma tras verificación KYC</li>
              <li>Mensualmente recibe su parte proporcional de la renta neta vía smart contract</li>
              <li>Si la plataforma tiene mercado secundario, puede vender sus tokens a otro inversor</li>
            </ul>
            <h3>Rentabilidades esperadas en el mercado español</h3>
            <div class="info-grid">
              <div class="info-card"><div class="card-title">Yield bruto medio</div><div class="card-value">4-7%</div></div>
              <div class="info-card"><div class="card-title">Yield neto estimado</div><div class="card-value">3-5%</div></div>
              <div class="info-card"><div class="card-title">Ticket mínimo</div><div class="card-value">50-500€</div></div>
              <div class="info-card"><div class="card-title">Plazo recomendado</div><div class="card-value">3-7 años</div></div>
            </div>
            <h3>Plataformas activas en España (inversión fraccionada)</h3>
            <ul>
              <li><strong>Reental:</strong> pionera española, con activos en España y Latinoamérica, tokens desde 100€</li>
              <li><strong>Brickken:</strong> infraestructura de emisión con casos inmobiliarios propios</li>
              <li><strong>Lofty.ai:</strong> referente global, activos en EE.UU., token mínimo de 50$</li>
              <li><strong>RealT:</strong> la mayor plataforma a nivel mundial, activos en Detroit y otras ciudades US</li>
            </ul>
            <div class="highlight-box"><p><strong>Advertencia:</strong> Las rentabilidades pasadas no garantizan rentabilidades futuras. La falta de liquidez en mercado secundario es el mayor riesgo de este modelo para el inversor retail.</p></div>
          `
        },
        {
          id: "5-2",
          title: "Financiación de promotoras con tokens",
          duration: "12 min",
          content: `
            <h2>Deuda Tokenizada: Una Alternativa al Préstamo Promotor</h2>
            <p>Para las promotoras inmobiliarias, la tokenización abre una vía de financiación alternativa a la bancaria, potencialmente más rápida, más flexible y con acceso a una base inversora global.</p>
            <h3>El problema de la financiación promotora</h3>
            <p>Una promotora que quiere desarrollar un proyecto residencial de 20M€ necesita típicamente: aportación propia del 20-30% (4-6M€), préstamo promotor bancario (60-70%), presales del 30% antes del inicio de obra. Los bancos exigen condiciones estrictas, toman tiempo y cobran márgenes elevados (Euribor + 3-5%).</p>
            <h3>Cómo funciona la deuda tokenizada</h3>
            <ul>
              <li>La promotora emite tokens de deuda con un tipo de interés fijo (ej: 8-12% TAE)</li>
              <li>Los inversores compran tokens, prestando dinero a la promotora</li>
              <li>Al cabo de 18-36 meses, cuando el proyecto se vende o refinancia, reciben principal + intereses</li>
              <li>El pago se ejecuta automáticamente vía smart contract</li>
            </ul>
            <h3>Ventajas frente al crowdfunding tradicional</h3>
            <ul>
              <li>Los tokens son potencialmente transferibles en mercado secundario (el crowdfunding tradicional no)</li>
              <li>Mayor transparencia: los pagos quedan registrados en blockchain</li>
              <li>Sin límite geográfico de inversores (cumpliendo regulación local)</li>
              <li>Fraccionamiento ilimitado: accesible desde 100€ vs. 500-1.000€ mínimo en crowdfunding</li>
            </ul>
          `
        },
        {
          id: "5-3",
          title: "Flex-living y activos alternativos tokenizados",
          duration: "10 min",
          content: `
            <h2>El Segmento Alternativo: El Mejor Candidato para Tokenizar</h2>
            <p>Los activos alternativos — flex-living, coliving, PBSA, senior living — presentan características que los hacen especialmente aptos para la tokenización inmobiliaria.</p>
            <h3>¿Por qué encajan tan bien?</h3>
            <ul>
              <li><strong>Gestión profesionalizada:</strong> el operador gestiona el activo; el inversor es pasivo. Ideal para smart contracts de distribución de rentas</li>
              <li><strong>Rentas estables y predecibles:</strong> contratos de operación de 10-25 años con rentabilidades garantizadas</li>
              <li><strong>Activos de mayor valor unitario:</strong> un edificio PBSA puede valer 30-80M€, con token de fracción accesible para retail</li>
              <li><strong>Falta de vías de acceso para retail:</strong> hasta ahora solo accesibles via fondos institucionales o SOCIMIs</li>
            </ul>
            <h3>Caso de uso: Tokenización de una residencia de estudiantes</h3>
            <div class="highlight-box">
              <p><strong>Activo:</strong> Residencia de 200 habitaciones en Madrid, valor 25M€, yield bruto 6,5%<br/>
              <strong>Estructura:</strong> SPV (SL) propietaria del activo — tokens representan participaciones de la SL<br/>
              <strong>Emisión:</strong> 250.000 tokens a 100€/token<br/>
              <strong>Renta mensual por token:</strong> ~0,54€ (6,5% anual / 12)<br/>
              <strong>Liquidez:</strong> mercado secundario en plataforma desde mes 6<br/>
              <strong>Plazo:</strong> 7 años con opción de recompra por el operador</p>
            </div>
            <h3>Caso de uso: Fondo BTR (Build-to-Rent) tokenizado</h3>
            <ul>
              <li>Cartera de 500 viviendas BTR en tres ciudades</li>
              <li>Financiación mixta: 60% banco + 40% equity tokenizado</li>
              <li>Tokens representan equity en el fondo vía SPV luxemburgués</li>
              <li>Rendimiento objetivo: 8-10% anual (renta + apreciación de cartera)</li>
            </ul>
          `
        }
      ],
      quiz: {
        questions: [
          {
            q: "¿Cuál es el principal riesgo de la inversión fraccionada vía tokens para el inversor retail?",
            options: ["Que el inmueble se destruya", "La falta de liquidez en el mercado secundario", "Que los tokens suban mucho de valor", "La excesiva regulación"],
            answer: 1
          },
          {
            q: "¿Por qué los activos de flex-living encajan especialmente bien con la tokenización?",
            options: ["Porque son muy baratos", "Por su gestión profesionalizada, rentas estables y mayor valor unitario", "Porque no requieren regulación", "Porque son activos físicamente divisibles"],
            answer: 1
          },
          {
            q: "¿Qué ventaja tiene la deuda tokenizada frente al crowdfunding inmobiliario tradicional?",
            options: ["No hay diferencias relevantes", "Los tokens son potencialmente transferibles en mercado secundario", "Es más barata para la promotora", "No requiere KYC"],
            answer: 1
          }
        ]
      }
    },
    {
      id: 6,
      title: "Plataformas y Ecosistema",
      emoji: "🌐",
      color: "#6B9BAD",
      lessons: [
        {
          id: "6-1",
          title: "Ecosistema global de tokenización inmobiliaria",
          duration: "12 min",
          content: `
            <h2>Mapa del Ecosistema Global</h2>
            <p>El ecosistema de tokenización inmobiliaria ha madurado significativamente entre 2020 y 2025. Han surgido especializaciones claras: plataformas de emisión, mercados secundarios, proveedores de infraestructura técnica y gestores de activos tokenizados.</p>
            <h3>Plataformas de inversión retail</h3>
            <ul>
              <li><strong>RealT (EE.UU.):</strong> la pionera y mayor plataforma. Más de 450 propiedades tokenizadas, principalmente residencial en Detroit. Usa Ethereum y xDai/Gnosis Chain. Token mínimo: 50$</li>
              <li><strong>Lofty.ai (EE.UU.):</strong> construida sobre Algorand, conocida por su facilidad de uso y liquidez en mercado secundario. Tickets desde 50$</li>
              <li><strong>Reental (España):</strong> referente europeo, activos en España, México, Costa Rica. Interfaz en español, soporte regulatorio europeo</li>
            </ul>
            <h3>Plataformas de infraestructura de emisión</h3>
            <ul>
              <li><strong>Brickken (Barcelona):</strong> permite a promotoras y empresas emitir sus propios tokens. Plataforma white-label con cumplimiento normativo integrado</li>
              <li><strong>Securitize (EE.UU.):</strong> líder en EE.UU., socio de BlackRock en su fondo tokenizado BUIDL</li>
              <li><strong>DigiShares (Dinamarca):</strong> especializada en real estate europeo</li>
              <li><strong>Tokeny Solutions (Luxemburgo):</strong> creadores del estándar ERC-3643, infraestructura para grandes emisiones institucionales</li>
            </ul>
            <h3>Mercados secundarios de Security Tokens</h3>
            <ul>
              <li><strong>tZERO:</strong> primer exchange regulado de Security Tokens en EE.UU.</li>
              <li><strong>SDX (SIX Digital Exchange, Suiza):</strong> el más avanzado de Europa, para institucionales</li>
              <li><strong>INX:</strong> regulado por SEC, cotiza tanto tokens como cripto</li>
            </ul>
          `
        },
        {
          id: "6-2",
          title: "Checklist del inversor: cómo evaluar una plataforma",
          duration: "10 min",
          content: `
            <h2>Due Diligence para el Inversor: 5 Dimensiones Críticas</h2>
            <p>Antes de invertir en cualquier plataforma de tokenización inmobiliaria, es imprescindible realizar una due diligence estructurada. Estas son las cinco dimensiones que debes analizar.</p>
            <h3>1. Regulación y licencias</h3>
            <ul>
              <li>¿Está registrada en la CNMV o equivalente europeo?</li>
              <li>¿Tiene licencia como proveedor de servicios de inversión?</li>
              <li>¿Bajo qué régimen opera (MiFID II, ECSP Regulation)?</li>
              <li>¿Ha recibido sanciones o advertencias del regulador?</li>
            </ul>
            <h3>2. Transparencia del activo subyacente</h3>
            <ul>
              <li>¿Se publica la escritura de propiedad o título jurídico?</li>
              <li>¿Existe tasación independiente reciente?</li>
              <li>¿Se reportan regularmente ingresos por rentas y gastos?</li>
              <li>¿Quién gestiona el activo físico y bajo qué contrato?</li>
            </ul>
            <h3>3. Liquidez real del mercado secundario</h3>
            <ul>
              <li>¿Existe mercado secundario operativo (no solo prometido)?</li>
              <li>¿Cuál es el volumen diario de negociación?</li>
              <li>¿Cuál es el spread bid-ask habitual?</li>
              <li>¿Hay mecanismos de market-making para garantizar liquidez mínima?</li>
            </ul>
            <h3>4. Track record del equipo</h3>
            <ul>
              <li>¿Tienen experiencia demostrable en gestión inmobiliaria?</li>
              <li>¿Han gestionado activos en ciclos bajistas?</li>
              <li>¿Los fundadores tienen skin in the game (co-invierten)?</li>
            </ul>
            <h3>5. Auditorías técnicas</h3>
            <ul>
              <li>¿El smart contract ha sido auditado por firma independiente (Certik, OpenZeppelin, Trail of Bits)?</li>
              <li>¿El informe de auditoría es público?</li>
              <li>¿Existe bug bounty activo?</li>
            </ul>
            <div class="highlight-box"><p><strong>Regla de oro:</strong> si una plataforma no puede responder transparentemente a estas preguntas, no inviertas. La opacidad en tokenización es siempre una señal de alerta.</p></div>
          `
        }
      ],
      quiz: {
        questions: [
          {
            q: "¿Qué empresa española es líder en infraestructura de emisión de tokens inmobiliarios?",
            options: ["Metrovacesa", "Brickken", "Merlin Properties", "Idealista"],
            answer: 1
          },
          {
            q: "¿Cuál es la primera pregunta clave en la due diligence de una plataforma de tokenización?",
            options: ["Si tienen app móvil", "Si están registradas ante el regulador pertinente", "Si el logo es bonito", "Si tienen oficina en Madrid"],
            answer: 1
          },
          {
            q: "¿Qué es SDX?",
            options: ["Un token español de real estate", "SIX Digital Exchange — uno de los mercados secundarios de Security Tokens más avanzados de Europa", "Una stablecoin del Banco Santander", "Un estándar técnico de blockchain"],
            answer: 1
          }
        ]
      }
    },
    {
      id: 7,
      title: "Casos de Éxito y Análisis",
      emoji: "🏆",
      color: "#8CAD6B",
      lessons: [
        {
          id: "7-1",
          title: "Caso 1: Edificio residencial tokenizado en Madrid",
          duration: "15 min",
          content: `
            <h2>Caso de Estudio: Tokenización Residencial en Madrid</h2>
            <p>Análisis de un proyecto real de tokenización de un edificio de apartamentos en alquiler en el barrio de Chamberí, Madrid. Los datos han sido anonimizados pero el caso es representativo de operaciones reales completadas entre 2022 y 2024.</p>
            <h3>Contexto</h3>
            <ul>
              <li>Activo: 24 apartamentos de 1-2 dormitorios en Chamberí</li>
              <li>Valor de tasación: 4,8M€</li>
              <li>Renta mensual bruta: 24.000€ (~6% yield bruto anual)</li>
              <li>El propietario buscaba liquidez parcial sin vender el activo completo</li>
            </ul>
            <h3>Estructura jurídica utilizada</h3>
            <ul>
              <li>Creación de SPV (SL) que recibió la propiedad del edificio</li>
              <li>Emisión de 48.000 tokens a 100€/token = 4,8M€ total</li>
              <li>El propietario original retuvo el 30% de los tokens (1,44M€)</li>
              <li>Venta del 70% restante (3,36M€) a inversores vía plataforma</li>
              <li>Gestión del edificio delegada al propietario original vía contrato de gestión</li>
            </ul>
            <h3>Proceso de emisión</h3>
            <ul>
              <li>Due diligence legal: 6 semanas (tasación, revisión contratos, estudio registral)</li>
              <li>Constitución SPV y estructuración: 4 semanas</li>
              <li>Aprobación del documento informativo por CNMV: exención por volumen inferior a 5M€</li>
              <li>Desarrollo técnico del smart contract: 3 semanas</li>
              <li>Auditoría del smart contract: 2 semanas</li>
              <li>Periodo de comercialización: 45 días (plataforma + marketing digital)</li>
              <li><strong>Total proceso: ~5 meses</strong></li>
            </ul>
            <h3>Resultados</h3>
            <div class="info-grid">
              <div class="info-card"><div class="card-title">Inversores finales</div><div class="card-value">312</div></div>
              <div class="info-card"><div class="card-title">Ticket medio</div><div class="card-value">10.769€</div></div>
              <div class="info-card"><div class="card-title">Yield neto mensual</div><div class="card-value">~0,42%</div></div>
              <div class="info-card"><div class="card-title">Liquidez secundaria</div><div class="card-value">Activa mes 3</div></div>
            </div>
            <h3>Lecciones aprendidas</h3>
            <ul>
              <li>El proceso de constitución del SPV y due diligence es el cuello de botella principal</li>
              <li>La comunicación al inversor debe ser muy clara sobre qué es un token y qué derechos otorga</li>
              <li>La liquidez del mercado secundario es escasa en los primeros 6 meses — gestión de expectativas crítica</li>
              <li>Los costes totales de estructuración (legal + técnico + auditoría + marketing) representaron ~2,5% del volumen total</li>
            </ul>
          `
        },
        {
          id: "7-2",
          title: "Caso 2: Deuda tokenizada para promotora",
          duration: "12 min",
          content: `
            <h2>Caso de Estudio: Promotora BTR Financia Obra con Tokens</h2>
            <p>Una promotora mediana española con un proyecto de 80 viviendas Build-to-Rent en Málaga utilizó la deuda tokenizada como complemento a la financiación bancaria.</p>
            <h3>Contexto</h3>
            <ul>
              <li>Proyecto: 80 viviendas BTR en Málaga Este, presupuesto de obra 12M€</li>
              <li>Financiación bancaria obtenida: 7M€ (préstamo promotor al Euribor + 3,5%)</li>
              <li>Gap de financiación: 2,5M€ que el banco no quería financiar (mezzanine)</li>
              <li>Capital propio disponible: 2,5M€</li>
            </ul>
            <h3>Solución: Pagarés tokenizados</h3>
            <ul>
              <li>Emisión de 25.000 tokens de deuda a 100€ = 2,5M€</li>
              <li>Tipo de interés: 10% TAE fijo</li>
              <li>Plazo: 24 meses (fin de obra + estabilización de rentas)</li>
              <li>Garantía: segunda hipoteca sobre el solar</li>
              <li>Plataforma: Brickken (regulada, smart contract ERC-3643)</li>
            </ul>
            <h3>Perfil de inversores atraídos</h3>
            <ul>
              <li>73% inversores retail españoles (ticket medio: 4.500€)</li>
              <li>18% inversores de LATAM (México, Colombia, Argentina)</li>
              <li>9% inversores europeos (Alemania, Holanda)</li>
              <li>Período de comercialización: 38 días (campañas digitales en redes + newsletter)</li>
            </ul>
            <h3>Resultado</h3>
            <p>A los 22 meses se completó la devolución del principal más intereses vía smart contract. Tiempo total de pago: menos de 1 hora para 554 inversores simultáneos. El proceso habría requerido semanas con transferencias bancarias individuales.</p>
            <div class="highlight-box"><p><strong>Lección clave:</strong> La automatización vía smart contract del pago a cientos de inversores simultáneos es uno de los beneficios operativos más tangibles y subestimados de la tokenización.</p></div>
          `
        },
        {
          id: "7-3",
          title: "Caso 3: Fracasos y señales de alerta",
          duration: "10 min",
          content: `
            <h2>Cuando la Tokenización Sale Mal: Lecciones de Proyectos Fallidos</h2>
            <p>No todo son casos de éxito. Analizar proyectos fallidos es tan valioso como estudiar los exitosos. Estos son los patrones de fracaso más comunes.</p>
            <h3>Patrón 1: La plataforma sin regulación real</h3>
            <p>Varias plataformas europeas entre 2020 y 2023 operaron en zonas grises regulatorias, prometiendo tokenización de activos sin las licencias necesarias. Algunas fueron cerradas por reguladores (ESMA, AMF francés, BaFin alemán). Los inversores perdieron tiempo y en algunos casos dinero por la inmovilización de fondos durante los procesos regulatorios.</p>
            <h3>Patrón 2: La liquidez inexistente</h3>
            <p>Muchas plataformas prometieron mercados secundarios líquidos que nunca materializaron. Los inversores descubrieron que sus tokens eran tan ilíquidos como el inmueble subyacente — con el añadido de que tampoco tenían acceso físico al activo ni podían forzar una venta.</p>
            <h3>Patrón 3: El activo sobrevalorado</h3>
            <p>Proyectos donde la tasación del activo fue inflada para maximizar el capital captado. Al valorar los tokens con el activo real, la diferencia era significativa y los inversores absorbieron la pérdida de valoración.</p>
            <h3>Señales de alerta para inversores</h3>
            <ul>
              <li>Promesas de rentabilidad garantizada superiores al 15% anual</li>
              <li>Equipo sin track record verificable en gestión inmobiliaria</li>
              <li>Smart contract sin auditoría pública</li>
              <li>Presión para invertir rápido ("últimas horas de la oferta")</li>
              <li>Documento informativo inexistente o muy superficial</li>
              <li>Tasación del activo realizada por empresa vinculada al promotor</li>
            </ul>
          `
        }
      ],
      quiz: {
        questions: [
          {
            q: "¿Cuánto representaron los costes de estructuración en el caso del edificio de Chamberí?",
            options: ["0,5% del volumen", "2,5% del volumen total", "10% del volumen", "15% del volumen"],
            answer: 1
          },
          {
            q: "¿Cuál fue el beneficio operativo más destacado en el caso de la promotora de Málaga?",
            options: ["Que el banco les financió más", "El pago automático a 554 inversores en menos de 1 hora vía smart contract", "Que los pisos se alquilaron más caros", "Que no necesitaron notario"],
            answer: 1
          },
          {
            q: "¿Cuál es una señal de alerta clara ante una plataforma de tokenización?",
            options: ["Que tengan oficina en Madrid", "Promesas de rentabilidad garantizada superiores al 15% anual", "Que usen Ethereum", "Que pidan KYC antes de invertir"],
            answer: 1
          }
        ]
      }
    },
    {
      id: 8,
      title: "Riesgos y Desafíos",
      emoji: "⚠️",
      color: "#AD6B6B",
      lessons: [
        {
          id: "8-1",
          title: "Riesgos tecnológicos y operativos",
          duration: "12 min",
          content: `
            <h2>Riesgos Reales de la Tokenización Inmobiliaria</h2>
            <p>La tokenización no es una solución mágica sin riesgos. Una visión realista y equilibrada es imprescindible para cualquier profesional del sector.</p>
            <h3>Riesgos tecnológicos</h3>
            <ul>
              <li><strong>Vulnerabilidades en smart contracts:</strong> el código puede tener errores. El hack al DAO de Ethereum en 2016 resultó en la pérdida de 60M$ por un bug en el smart contract. Las auditorías reducen pero no eliminan este riesgo</li>
              <li><strong>Pérdida de claves privadas:</strong> se estima que entre el 15-20% de todos los Bitcoins están permanentemente inaccesibles por pérdida de claves. En tokens inmobiliarios, esto significaría perder el acceso a la inversión</li>
              <li><strong>Riesgo de red:</strong> obsolescencia de la blockchain elegida, congestión de red, cambios de protocolo que afectan a los tokens emitidos</li>
              <li><strong>Dependencia de oráculos:</strong> si el sistema que alimenta al smart contract con datos del mundo real falla o es manipulado, las distribuciones pueden ser incorrectas</li>
            </ul>
            <h3>Riesgos operativos</h3>
            <ul>
              <li><strong>Quiebra de la plataforma:</strong> ¿qué pasa con los tokens y el activo subyacente si la plataforma cierra? La estructura legal del SPV debe garantizar que los tokens sigan siendo válidos independientemente de la plataforma</li>
              <li><strong>Concentración de control:</strong> si el gestor del activo también controla la plataforma, los conflictos de interés son difíciles de gestionar</li>
              <li><strong>Valoración opaca:</strong> sin un precio de mercado continuo, la valoración del activo subyacente puede no reflejar el valor real</li>
            </ul>
          `
        },
        {
          id: "8-2",
          title: "Riesgos legales y expectativas calibradas",
          duration: "10 min",
          content: `
            <h2>Riesgos Legales y la Realidad del Mercado</h2>
            <h3>Riesgos regulatorios</h3>
            <ul>
              <li><strong>Cambios normativos imprevistos:</strong> el regulador puede cambiar el tratamiento de los tokens inmobiliarios, afectando a emisiones ya realizadas</li>
              <li><strong>Inconsistencia entre jurisdicciones:</strong> un token emitido en España puede ser ilegal en algunos estados de EE.UU. o en ciertos países asiáticos. La operativa internacional requiere análisis legal en cada jurisdicción de los inversores</li>
              <li><strong>Riesgo de reclasificación:</strong> un token diseñado como utility puede ser reclasificado como security por el regulador, con consecuencias retroactivas</li>
            </ul>
            <h3>La promesa vs. la realidad</h3>
            <p>El mercado de tokenización inmobiliaria ha prometido mucho. Es necesario tener expectativas calibradas:</p>
            <ul>
              <li><strong>Liquidez real limitada:</strong> los mercados secundarios de tokens inmobiliarios son aún muy ilíquidos en la práctica. No existe el equivalente a bolsa para tokens inmobiliarios en Europa</li>
              <li><strong>Adopción más lenta de lo esperado:</strong> las predicciones de 2019 sobre mercados tokenizados de billones de dólares para 2025 no se han materializado</li>
              <li><strong>Costes de estructuración no triviales:</strong> tokenizar un activo pequeño no es eficiente. El umbral mínimo práctico está en torno a 1-2M€ de activo para que los costes sean razonables</li>
            </ul>
            <div class="highlight-box"><p>Esto no significa que la tokenización no funcione — significa que está en una fase de maduración gradual, con adopción real pero crecimiento moderado, no exponencial. Los casos de uso más prometedores son los institucionales y los activos alternativos de gran tamaño.</p></div>
          `
        }
      ],
      quiz: {
        questions: [
          {
            q: "¿Qué debe garantizar la estructura legal de un SPV en caso de quiebra de la plataforma?",
            options: ["Que los fundadores recuperen su dinero primero", "Que los tokens sigan siendo jurídicamente válidos independientemente de la plataforma", "Que el activo pase al Estado", "Que los tokens sean reembolsados automáticamente"],
            answer: 1
          },
          {
            q: "¿Cuál es el umbral mínimo de activo aproximado para que la tokenización sea económicamente eficiente?",
            options: ["10.000€", "100.000€", "1-2M€", "50M€"],
            answer: 2
          }
        ]
      }
    },
    {
      id: 9,
      title: "El Futuro de la Tokenización",
      emoji: "🚀",
      color: "#6B7BAD",
      lessons: [
        {
          id: "9-1",
          title: "RWA: La tokenización institucional despega",
          duration: "15 min",
          content: `
            <h2>Real World Assets (RWA): El Gran Catalizador 2024-2030</h2>
            <p>El movimiento más significativo para la tokenización inmobiliaria en los próximos años no vendrá del retail, sino de los grandes actores institucionales que están tokenizando activos del mundo real a escala masiva.</p>
            <h3>Los grandes se suman</h3>
            <ul>
              <li><strong>BlackRock BUIDL:</strong> el mayor gestor de activos del mundo lanzó en 2024 su fondo tokenizado de deuda pública US en blockchain Ethereum, alcanzando 500M$ en pocas semanas. Señal inequívoca de legitimación institucional</li>
              <li><strong>Franklin Templeton:</strong> fondo de money market tokenizado en Stellar y Polygon, con más de 400M$ bajo gestión tokenizada</li>
              <li><strong>JPMorgan Onyx:</strong> plataforma de tokenización institucional para repos, bonos y activos reales</li>
              <li><strong>Goldman Sachs Digital Assets:</strong> tokenización de bonos y crédito privado</li>
            </ul>
            <h3>Proyecciones del mercado RWA</h3>
            <div class="info-grid">
              <div class="info-card"><div class="card-title">Mercado RWA 2024</div><div class="card-value">~12.000M$</div></div>
              <div class="info-card"><div class="card-title">Proyección 2030 (BCG)</div><div class="card-value">16 billones $</div></div>
              <div class="info-card"><div class="card-title">% en inmobiliario</div><div class="card-value">~30-40%</div></div>
              <div class="info-card"><div class="card-title">Crecimiento anual</div><div class="card-value">50-80%</div></div>
            </div>
            <h3>DeFi + Real Estate</h3>
            <ul>
              <li><strong>Protocolo Centrifuge:</strong> tokeniza crédito inmobiliario y lo usa como colateral en DeFi (MakerDAO)</li>
              <li><strong>RWA.xyz:</strong> plataforma de agregación de RWA tokenizados con métricas en tiempo real</li>
              <li><strong>Yield farming inmobiliario:</strong> proveer liquidez a mercados de tokens inmobiliarios a cambio de comisiones</li>
            </ul>
          `
        },
        {
          id: "9-2",
          title: "España como hub europeo de tokenización",
          duration: "12 min",
          content: `
            <h2>España 2030: El Mercado Inmobiliario Tokenizado</h2>
            <p>España tiene condiciones competitivas únicas para convertirse en referente europeo de tokenización inmobiliaria. Pero requiere acción coordinada entre sector privado, reguladores y administración.</p>
            <h3>Ventajas competitivas de España</h3>
            <ul>
              <li><strong>Mayor mercado inmobiliario del sur de Europa:</strong> activos de alta calidad, demanda inversora global consolidada</li>
              <li><strong>Ecosistema PropTech activo:</strong> Barcelona y Madrid entre los 10 hubs PropTech europeos más activos</li>
              <li><strong>Talento técnico y legal:</strong> generación de ingenieros blockchain y abogados especializados en criptoactivos en expansión</li>
              <li><strong>Conexión con LATAM:</strong> puente natural hacia mercados emergentes con alta demanda de inversión en real estate español</li>
              <li><strong>Clima regulatorio proactivo:</strong> CNMV y Banco de España entre los más comprometidos con el sandbox regulatorio en Europa</li>
            </ul>
            <h3>Sandbox regulatorio del Banco de España y CNMV</h3>
            <p>El sandbox financiero español (activo desde 2021) permite a empresas innovadoras en finanzas y PropTech operar bajo supervisión controlada antes de obtener licencias definitivas. Varias startups de tokenización han pasado por este entorno.</p>
            <h3>Hoja de ruta hacia 2030</h3>
            <ul>
              <li><strong>2025-2026:</strong> primeras grandes operaciones institucionales (fondos de pensiones, aseguradoras) invirtiendo vía tokens inmobiliarios en España</li>
              <li><strong>2026-2027:</strong> desarrollo de mercado secundario europeo regulado con liquidez real</li>
              <li><strong>2027-2028:</strong> integración con Registro de la Propiedad digital — exploración de DLT en registro público</li>
              <li><strong>2029-2030:</strong> ecosistema maduro con decenas de miles de millones en activos inmobiliarios españoles tokenizados</li>
            </ul>
            <div class="highlight-box"><p>La pregunta no es si la tokenización inmobiliaria llegará a España a escala. La pregunta es cuán rápido y qué actores liderarán esa transformación.</p></div>
          `
        }
      ],
      quiz: {
        questions: [
          {
            q: "¿Qué empresa lanzó el fondo tokenizado BUIDL en 2024, legitimando la tokenización institucional?",
            options: ["Goldman Sachs", "BlackRock", "JPMorgan", "Vanguard"],
            answer: 1
          },
          {
            q: "¿Cuál es una ventaja competitiva clave de España para la tokenización inmobiliaria?",
            options: ["Que tiene la regulación más permisiva de Europa", "Su conexión natural con LATAM como puente de inversión", "Que no tiene impuestos sobre tokens", "Que Bitcoin es moneda de curso legal"],
            answer: 1
          },
          {
            q: "¿Qué proyección hace BCG para el mercado total de RWA tokenizados en 2030?",
            options: ["500 millones de dólares", "50.000 millones de dólares", "16 billones de dólares", "1 billón de dólares"],
            answer: 2
          }
        ]
      }
    },
    {
      id: 10,
      title: "Proyecto Final y Certificación",
      emoji: "🎓",
      color: "#8C1736",
      lessons: [
        {
          id: "10-1",
          title: "Instrucciones del proyecto final",
          duration: "8 min",
          content: `
            <h2>Proyecto Final: Diseña tu Propia Tokenización</h2>
            <p>El proyecto final del curso consiste en diseñar un plan completo de tokenización para un activo inmobiliario real o hipotético. Este ejercicio integra todos los conocimientos adquiridos a lo largo del curso.</p>
            <h3>Objetivo del proyecto</h3>
            <p>Demostrar que eres capaz de estructurar una operación de tokenización inmobiliaria completa, considerando sus dimensiones legal, técnica, financiera y comercial.</p>
            <h3>Estructura del entregable</h3>
            <ul>
              <li><strong>1. Descripción del activo</strong> — tipo, ubicación, valor estimado, estado actual</li>
              <li><strong>2. Estructura jurídica propuesta</strong> — SPV, tipo de token, derechos del tenedor</li>
              <li><strong>3. Tecnología seleccionada</strong> — blockchain, estándar de token, proveedor técnico, justificación</li>
              <li><strong>4. Plan de cumplimiento normativo</strong> — licencias necesarias, KYC/AML, MiCA / CNMV</li>
              <li><strong>5. Modelo financiero básico</strong> — precio por token, número de tokens, yield esperado, distribución de rentas</li>
              <li><strong>6. Estrategia de comercialización</strong> — perfil del inversor objetivo, canales, precio de entrada</li>
              <li><strong>7. Análisis de riesgos</strong> — principales riesgos y medidas de mitigación</li>
              <li><strong>8. Estrategia de liquidez</strong> — mercado secundario, lock-up period, mecanismo de recompra</li>
            </ul>
            <h3>Criterios de evaluación</h3>
            <ul>
              <li>Coherencia entre la estructura legal y el activo seleccionado</li>
              <li>Adecuación de la tecnología elegida al caso de uso</li>
              <li>Realismo del modelo financiero</li>
              <li>Identificación de riesgos relevantes y mitigantes creíbles</li>
              <li>Viabilidad de la estrategia de comercialización</li>
            </ul>
            <div class="highlight-box"><p><strong>Consejo:</strong> elige un activo que conozcas bien — de tu ciudad, de tu sector profesional, o de un segmento que hayas estudiado a lo largo del curso. La profundidad de conocimiento del activo subyacente marcará la diferencia en la calidad del proyecto.</p></div>
          `
        },
        {
          id: "10-2",
          title: "Recursos adicionales y próximos pasos",
          duration: "8 min",
          content: `
            <h2>Recursos para Continuar tu Formación</h2>
            <p>Este curso es un punto de partida sólido. El ecosistema evoluciona rápidamente y la formación continua es imprescindible.</p>
            <h3>Lecturas recomendadas</h3>
            <ul>
              <li><strong>"The Token Economy"</strong> — Shermin Voshmgir (Open Access, gratuito online)</li>
              <li><strong>"Tokenization of Real Estate"</strong> — INATBA Real Estate Working Group (whitepaper técnico)</li>
              <li><strong>"Digital Assets and the Future of Finance"</strong> — BCG + ADDX Report 2022</li>
              <li><strong>Boletín CNMV</strong> sobre criptoactivos y DLT — publicaciones regulares de la CNMV española</li>
            </ul>
            <h3>Comunidades y foros especializados</h3>
            <ul>
              <li><strong>INATBA (International Association for Trusted Blockchain Applications):</strong> grupo de trabajo de real estate</li>
              <li><strong>PropTech Spain:</strong> comunidad española de tecnología inmobiliaria</li>
              <li><strong>RWA.xyz Discord:</strong> comunidad activa de tokenización de activos reales</li>
              <li><strong>LinkedIn:</strong> grupos "Real Estate Tokenization" y "PropTech España"</li>
            </ul>
            <h3>Eventos clave del sector</h3>
            <ul>
              <li><strong>MIPIM</strong> (Cannes, marzo): el mayor evento inmobiliario global, con creciente presencia PropTech</li>
              <li><strong>CREtech</strong> (Nueva York, Londres): el congreso de referencia en tecnología inmobiliaria</li>
              <li><strong>TOKEN2049</strong> (Singapur/Dubai): el evento cripto/blockchain más relevante a nivel global</li>
              <li><strong>Barcelona PropTech Forum:</strong> referente español e iberoamericano</li>
            </ul>
            <h3>Próximos pasos profesionales</h3>
            <ul>
              <li>Conecta con plataformas españolas como Brickken o Reental para explorar oportunidades</li>
              <li>Analiza el sandbox regulatorio del Banco de España si tienes proyecto propio</li>
              <li>Considera la certificación CAIA (Chartered Alternative Investment Analyst) con foco en activos digitales</li>
              <li>Únete a INATBA o a grupos de trabajo de CNMV sobre tokenización para estar en la vanguardia regulatoria</li>
            </ul>
          `
        }
      ],
      quiz: {
        questions: [
          {
            q: "¿Cuántos componentes tiene el entregable del proyecto final?",
            options: ["3", "5", "8", "12"],
            answer: 2
          },
          {
            q: "¿Dónde puedes encontrar el whitepaper 'The Token Economy' de Shermin Voshmgir?",
            options: ["Solo en formato físico en librerías", "Online gratuitamente en Open Access", "Solo disponible para alumnos de MIT", "Es un documento confidencial del CNMV"],
            answer: 1
          }
        ]
      }
    }
  ]
};
