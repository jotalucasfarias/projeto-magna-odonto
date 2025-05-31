import { StaticImageData } from "next/image";
import ortodontiaImg from "@/assets/services/ortodontia.png";
import implantesImg from "@/assets/services/implantes.png";
import avaliacaoImg from "@/assets/services/avaliacao.png";
import endodontiaImg from "@/assets/services/endodontia.png";
import protesesImg from "@/assets/services/proteses.png";
import gengivoplastiaImg from "@/assets/services/gengivoplastia.png";

export interface FAQ {
  question: string;
  answer: string;
}

export interface ServiceBenefit {
  title: string;
  description: string;
}

export interface DetailedService {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  image: StaticImageData;
  benefits: ServiceBenefit[];
  faqs: FAQ[];
  metaDescription: string;
}

export const detailedServices: DetailedService[] = [
  {
    id: 1,
    title: "Ortodontia",
    slug: "ortodontia",
    shortDescription:
      "Alinhe seus dentes com aparelhos modernos e discretos, melhorando a estética e a função do seu sorriso de forma confortável e eficiente.",
    longDescription:
      "A ortodontia é a especialidade odontológica dedicada à correção do posicionamento dos dentes e dos ossos maxilares. Na Magna Odonto, em Porto Velho, utilizamos aparelhos fixos, removíveis e alinhadores transparentes de última geração para alinhar os dentes, corrigir mordidas e proporcionar um sorriso harmonioso. Nosso diferencial está no atendimento personalizado, opções estéticas discretas e acompanhamento próximo durante todo o tratamento, garantindo conforto, eficiência e resultados duradouros.",
    image: ortodontiaImg,
    benefits: [
      {
        title: "Alinhamento dental perfeito",
        description: "Correção do posicionamento dos dentes, resultando em um sorriso harmonioso e bem alinhado.",
      },
      {
        title: "Melhora na saúde bucal",
        description: "Dentes alinhados são mais fáceis de higienizar, reduzindo o risco de cáries e doenças periodontais.",
      },
      {
        title: "Correção de problemas funcionais",
        description: "Tratamento de problemas de mordida que podem causar desgaste dental, dificuldades na mastigação e dores articulares.",
      },
      {
        title: "Opções estéticas discretas",
        description: "Disponibilizamos aparelhos transparentes e alinhadores que são quase imperceptíveis durante o tratamento.",
      },
    ],
    faqs: [
      {
        question: "Qual a idade ideal para iniciar o tratamento ortodôntico?",
        answer: "O tratamento ortodôntico pode ser iniciado em qualquer idade, mas idealmente recomenda-se uma primeira avaliação por volta dos 7 anos para detectar problemas precoces. No entanto, muitos adultos também realizam tratamento ortodôntico com excelentes resultados.",
      },
      {
        question: "Quanto tempo dura o tratamento com aparelho?",
        answer: "A duração do tratamento varia de acordo com a complexidade do caso, podendo durar de 12 a 36 meses. Durante a consulta inicial, após avaliar sua situação específica, forneceremos uma estimativa mais precisa.",
      },
      {
        question: "Os aparelhos ortodônticos causam dor?",
        answer: "É normal sentir um leve desconforto nos primeiros dias após a instalação ou ajustes do aparelho. Este desconforto é temporário e pode ser controlado com analgésicos comuns, se necessário.",
      },
      {
        question: "Posso optar por aparelhos invisíveis?",
        answer: "Sim, oferecemos diferentes opções de aparelhos estéticos, incluindo alinhadores transparentes e aparelhos fixos com brackets estéticos. A viabilidade dependerá da complexidade do seu caso.",
      },
    ],
    metaDescription: "Tratamento ortodôntico em Porto Velho com técnicas modernas e opções estéticas. Corrija a posição dos dentes e obtenha um sorriso harmonioso na Magna Odonto.",
  },
  {
    id: 2,
    title: "Implantes Dentários",
    slug: "implantes-dentarios",
    shortDescription:
      "Substitua dentes perdidos com implantes fixos e seguros, recuperando a funcionalidade e o visual natural do seu sorriso.",
    longDescription:
      "Os implantes dentários são a solução mais moderna e eficaz para substituir dentes perdidos. Na Magna Odonto, Porto Velho, realizamos implantes com tecnologia avançada, materiais de alta qualidade e profissionais experientes. O procedimento é seguro, minimamente invasivo e proporciona resultados estéticos e funcionais muito semelhantes aos dentes naturais. Oferecemos acompanhamento completo, desde a avaliação até a reabilitação protética, priorizando o conforto e a satisfação do paciente.",
    image: implantesImg,
    benefits: [
      {
        title: "Solução permanente",
        description: "Os implantes são duráveis e podem durar por toda a vida com os cuidados adequados.",
      },
      {
        title: "Preservação óssea",
        description: "Ao contrário de outras soluções, os implantes estimulam o osso maxilar, evitando sua reabsorção.",
      },
      {
        title: "Aparência natural",
        description: "As próteses sobre implantes são personalizadas para combinar perfeitamente com seus dentes naturais.",
      },
      {
        title: "Restauração da função mastigatória",
        description: "Recupere a capacidade de mastigar todos os alimentos sem restrições ou desconforto.",
      },
    ],
    faqs: [
      {
        question: "Quem pode receber implantes dentários?",
        answer: "A maioria dos adultos com boa saúde geral e bucal pode receber implantes. É necessário ter osso suficiente para a fixação do implante, mas mesmo pacientes com perda óssea podem ser candidatos após procedimentos de enxerto ósseo.",
      },
      {
        question: "O procedimento de implante é doloroso?",
        answer: "O procedimento é realizado sob anestesia local, garantindo conforto durante a cirurgia. Após o procedimento, é normal sentir algum desconforto, que pode ser controlado com medicamentos prescritos pelo dentista.",
      },
      {
        question: "Quanto tempo leva para completar o tratamento com implantes?",
        answer: "O processo completo geralmente leva de 3 a 6 meses, dependendo do caso. Após a colocação do implante, é necessário aguardar o período de osseointegração (fusão do implante com o osso) antes da instalação da prótese definitiva.",
      },
      {
        question: "Qual a durabilidade dos implantes dentários?",
        answer: "Com cuidados adequados, os implantes podem durar por toda a vida. É essencial manter uma boa higiene bucal e realizar consultas regulares para garantir a longevidade do tratamento.",
      },
    ],
    metaDescription: "Implantes dentários de alta qualidade em Porto Velho. Recupere seu sorriso com uma solução permanente, natural e confortável na Magna Odonto.",
  },
  {
    id: 3,
    title: "Avaliação Odontológica",
    slug: "avaliacao-odontologica",
    shortDescription:
      "Cuide da saúde dos seus dentes e gengivas com uma avaliação completa e focada na prevenção, garantindo bem-estar e tranquilidade.",
    longDescription:
      "A Avaliação Odontológica é o primeiro passo para um sorriso saudável. Na Magna Odonto, realizamos exames clínicos detalhados, análise radiográfica, avaliação periodontal e diagnóstico precoce de problemas bucais. Nosso atendimento é humanizado e preventivo, orientando sobre os melhores cuidados e tratamentos personalizados para cada paciente. Venha conhecer nosso diferencial em Porto Velho: tecnologia, atenção e transparência em cada consulta.",
    image: avaliacaoImg,
    benefits: [
      {
        title: "Prevenção de problemas bucais",
        description: "Acompanhamento regular para prevenir cáries, doenças gengivais e outras condições antes que se tornem problemas graves.",
      },
      {
        title: "Diagnóstico precoce",
        description: "Identificação de alterações e patologias em estágios iniciais, quando o tratamento é mais simples e menos invasivo.",
      },
      {
        title: "Tratamentos conservadores",
        description: "Procedimentos que preservam ao máximo a estrutura dental natural, como restaurações e limpezas profissionais.",
      },
      {
        title: "Orientação personalizada",
        description: "Instruções sobre higiene bucal e hábitos saudáveis adaptadas às necessidades específicas de cada paciente.",
      },
    ],
    faqs: [
      {
        question: "Com que frequência devo visitar o dentista?",
        answer: "Recomendamos consultas a cada 6 meses para exames de rotina e limpeza profissional. Em alguns casos, como pacientes com problemas periodontais ou alto risco de cárie, consultas mais frequentes podem ser necessárias.",
      },
      {
        question: "O que é incluído em uma consulta de rotina?",
        answer: "Uma consulta de rotina geralmente inclui exame clínico completo, avaliação de problemas como cáries ou gengivite, limpeza profissional para remoção de tártaro e placa bacteriana, e orientações sobre técnicas de higiene bucal.",
      },
      {
        question: "Como posso melhorar minha higiene bucal diária?",
        answer: "Recomendamos escovar os dentes pelo menos duas vezes ao dia com creme dental com flúor, usar fio dental diariamente e, em alguns casos, incluir enxaguante bucal. Durante a consulta, forneceremos orientações específicas para suas necessidades.",
      },
      {
        question: "Quando devo procurar atendimento de emergência?",
        answer: "Procure atendimento imediato em casos de dor intensa, trauma dental (dente quebrado ou deslocado), inchaço significativo, sangramento persistente ou qualquer situação que cause desconforto severo.",
      },
    ],
    metaDescription: "Serviços de avaliação odontológica em Porto Velho com foco em prevenção e planejamento de tratamentos. Mantenha sua saúde bucal em dia na Magna Odonto.",
  },
  {
    id: 4,
    title: "Endodontia (Canal)",
    slug: "endodontia",
    shortDescription:
      "Preserve seus dentes e alivie dores com o tratamento de canal, garantindo saúde bucal e evitando extrações desnecessárias.",
    longDescription:
      "A Endodontia trata inflamações e infecções na polpa do dente, aliviando dores intensas e preservando o dente natural. Na Magna Odonto, utilizamos técnicas modernas e equipamentos de alta precisão para tornar o tratamento de canal rápido, seguro e confortável. Nossa equipe em Porto Velho é especializada em endodontia, proporcionando recuperação eficiente e acompanhamento pós-tratamento para garantir sua tranquilidade.",
    image: endodontiaImg,
    benefits: [
      {
        title: "Alívio da dor",
        description: "O tratamento endodôntico remove a infecção ou inflamação que causa a dor, proporcionando alívio imediato.",
      },
      {
        title: "Preservação do dente natural",
        description: "Evita a extração, permitindo que você mantenha seu dente natural em funcionamento.",
      },
      {
        title: "Prevenção de problemas futuros",
        description: "Impede que a infecção se espalhe para outros dentes ou para outras áreas do corpo através da corrente sanguínea.",
      },
      {
        title: "Restauração da função",
        description: "Após o tratamento, o dente pode ser restaurado e voltar a funcionar normalmente para mastigação e fala.",
      },
    ],
    faqs: [
      {
        question: "O tratamento de canal dói?",
        answer: "Contrário à crença popular, o tratamento de canal moderno é realizado com anestesia adequada e geralmente não causa dor. Na verdade, o procedimento alivia a dor causada pela infecção ou inflamação da polpa dental.",
      },
      {
        question: "Quantas sessões são necessárias para concluir um tratamento de canal?",
        answer: "O número de sessões varia de acordo com a complexidade do caso. Tratamentos mais simples podem ser concluídos em uma única sessão, enquanto casos mais complexos podem exigir 2 a 3 consultas.",
      },
      {
        question: "O que devo esperar após o tratamento de canal?",
        answer: "É normal sentir alguma sensibilidade após o procedimento, especialmente nos primeiros dias. Esta sensibilidade pode ser controlada com analgésicos comuns. Em seguida, será necessário restaurar o dente, geralmente com uma coroa, para protegê-lo e restabelecer sua funcionalidade completa.",
      },
      {
        question: "Qual a taxa de sucesso do tratamento endodôntico?",
        answer: "O tratamento de canal tem uma alta taxa de sucesso, em torno de 95% quando realizado adequadamente. Dentes tratados endodonticamente podem durar por toda a vida com os cuidados apropriados.",
      },
    ],
    metaDescription: "Tratamento de canal em Porto Velho com técnicas modernas e sem dor. Preserve seu dente natural e alivie a dor na Magna Odonto.",
  },
  {
    id: 5,
    title: "Próteses Dentárias",
    slug: "proteses-dentarias",
    shortDescription:
      "Restaure o conforto e a confiança no seu sorriso com próteses sob medida, devolvendo a funcionalidade e estética dos seus dentes.",
    longDescription:
      "As próteses dentárias da Magna Odonto são confeccionadas sob medida para cada paciente, devolvendo a função mastigatória, a estética e a autoestima. Trabalhamos com próteses fixas, removíveis e sobre implantes, sempre com materiais de alta qualidade e laboratório próprio. Nosso diferencial em Porto Velho é o ajuste preciso, o acompanhamento próximo e a busca pelo máximo conforto e naturalidade no resultado final.",
    image: protesesImg,
    benefits: [
      {
        title: "Restauração da função mastigatória",
        description: "Recupere a capacidade de mastigar alimentos adequadamente, melhorando a digestão e nutrição.",
      },
      {
        title: "Melhora na fala",
        description: "A substituição de dentes perdidos ajuda a pronunciar palavras corretamente, melhorando a comunicação.",
      },
      {
        title: "Suporte facial",
        description: "As próteses fornecem suporte aos músculos faciais, evitando a aparência envelhecida causada pela perda dentária.",
      },
      {
        title: "Aumento da autoestima",
        description: "Um sorriso completo e bonito contribui significativamente para a autoconfiança e bem-estar social.",
      },
    ],
    faqs: [
      {
        question: "Quais são os tipos de próteses dentárias disponíveis?",
        answer: "Oferecemos diversos tipos de próteses: próteses fixas (coroas e pontes), próteses removíveis (parciais ou totais) e próteses sobre implantes. Durante a consulta, avaliaremos qual opção é mais adequada para o seu caso.",
      },
      {
        question: "Quanto tempo dura uma prótese dentária?",
        answer: "A durabilidade varia conforme o tipo de prótese e os cuidados do paciente. Próteses fixas podem durar de 10 a 15 anos, enquanto as removíveis geralmente precisam ser substituídas a cada 5-7 anos. Próteses sobre implantes têm maior longevidade, podendo durar 15 anos ou mais.",
      },
      {
        question: "Como devo cuidar da minha prótese?",
        answer: "Próteses fixas devem ser higienizadas como dentes naturais, com escovação e uso de fio dental. Próteses removíveis devem ser limpas diariamente com produtos específicos e mantidas em água quando não estiverem em uso. Forneceremos instruções detalhadas adaptadas ao seu tipo de prótese.",
      },
      {
        question: "É difícil se adaptar a uma prótese nova?",
        answer: "Um período de adaptação é normal, especialmente para próteses removíveis. Pode haver desconforto inicial, salivação aumentada e dificuldade na fala, mas esses sintomas geralmente desaparecem em algumas semanas. Estamos disponíveis para ajustes quando necessário.",
      },
    ],
    metaDescription: "Próteses dentárias personalizadas e de alta qualidade em Porto Velho. Recupere a função e estética do seu sorriso com conforto na Magna Odonto.",
  },
  {
    id: 6,
    title: "Gengivoplastia",
    slug: "gengivoplastia",
    shortDescription:
      "Harmonize seu sorriso com a gengivoplastia, um procedimento que melhora a proporção entre dentes e gengivas de forma segura e eficaz.",
    longDescription:
      "A Gengivoplastia é um procedimento estético e funcional que remodela o contorno gengival, corrigindo sorriso gengival e assimetrias. Na Magna Odonto, Porto Velho, realizamos gengivoplastia com técnicas minimamente invasivas, promovendo rápida recuperação e resultados naturais. O atendimento é personalizado, com avaliação criteriosa e acompanhamento pós-operatório para garantir a satisfação e a harmonia do seu sorriso.",
    image: gengivoplastiaImg,
    benefits: [
      {
        title: "Harmonização do sorriso",
        description: "Melhora a proporção entre dentes e gengivas, criando um sorriso mais estético e harmonioso.",
      },
      {
        title: "Procedimento minimamente invasivo",
        description: "Técnica moderna que proporciona resultados significativos com mínimo desconforto e tempo de recuperação reduzido.",
      },
      {
        title: "Aumento da autoestima",
        description: "Um sorriso mais proporcional e bonito contribui significativamente para a autoconfiança e bem-estar social.",
      },
    ],
    faqs: [
      {
        question: "A gengivoplastia é um procedimento doloroso?",
        answer: "O procedimento é realizado com anestesia local, garantindo conforto durante sua execução. Após o procedimento, pode haver um desconforto leve que é facilmente controlado com medicação prescrita pelo dentista.",
      },
      {
        question: "Quanto tempo leva para recuperação após a gengivoplastia?",
        answer: "A recuperação completa geralmente ocorre em 1 a 2 semanas. Os primeiros dias podem apresentar leve inchaço e sensibilidade, mas a maioria dos pacientes retorna às atividades normais em 2 a 3 dias.",
      },
      {
        question: "Quem é candidato à gengivoplastia?",
        answer: "São candidatos à gengivoplastia pessoas com sorriso gengival (exposição excessiva da gengiva ao sorrir), assimetrias gengivais ou formato irregular das gengivas, e que possuam boa saúde bucal. Uma avaliação clínica determinará se você é um bom candidato ao procedimento.",
      },
      {
        question: "Como devo cuidar da minha gengiva após o procedimento?",
        answer: "Após a gengivoplastia, recomenda-se evitar alimentos duros ou muito condimentados nos primeiros dias, realizar higiene bucal cuidadosa seguindo as orientações do dentista, e usar bochechos específicos quando prescritos. É essencial comparecer às consultas de acompanhamento para garantir a boa cicatrização.",
      },
    ],
    metaDescription: "Gengivoplastia em Porto Velho para harmonização do sorriso. Corrija o excesso gengival e obtenha um sorriso mais estético e proporcional na Magna Odonto.",
  },
];

// Função para encontrar um serviço pelo slug
export function findServiceBySlug(slug: string): DetailedService | undefined {
  return detailedServices.find(service => service.slug === slug);
}

// Função para obter todos os slugs de serviços (útil para geração estática)
export function getAllServiceSlugs(): string[] {
  return detailedServices.map(service => service.slug);
}
