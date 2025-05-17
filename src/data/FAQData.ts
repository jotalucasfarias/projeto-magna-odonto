export interface FAQCategory {
  id: string;
  title: string;
  questions: FAQ[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export const faqCategories: FAQCategory[] = [
  {
    id: "geral",
    title: "Informações Gerais",
    questions: [
      {
        question: "Qual é o horário de funcionamento da clínica?",
        answer: "A Magna Odonto está aberta de segunda a sexta-feira, das 8h00 às 11h30 e das 14h00 às 18h00. Não atendemos aos finais de semana."
      },
      {
        question: "Preciso marcar consulta ou posso ir diretamente à clínica?",
        answer: "Recomendamos sempre o agendamento prévio para garantir o melhor atendimento. Você pode agendar sua consulta através do nosso site, pelo WhatsApp (69) 99602-1979 ou por telefone."
      },
      {
        question: "O que devo levar na primeira consulta?",
        answer: "Na primeira consulta, é recomendável trazer um documento de identificação com foto, cartão do convênio odontológico (se possuir), e exames ou radiografias odontológicas recentes (se disponíveis)."
      },
      {
        question: "A clínica atende emergências?",
        answer: "Sim, atendemos casos de emergência durante o horário de funcionamento. Entre em contato conosco imediatamente e faremos o possível para atendê-lo o quanto antes."
      },
      {
        question: "A Magna Odonto atende crianças?",
        answer: "Sim, temos profissionais habilitados para atendimento odontopediátrico. Cuidamos da saúde bucal de pacientes de todas as idades, desde a primeira infância até a terceira idade."
      },
      {
        question: "Quais formas de pagamento são aceitas?",
        answer: "Aceitamos pagamentos em dinheiro, cartões de débito e crédito, PIX e oferecemos opções de parcelamento para tratamentos mais extensos. Consulte nossas condições especiais de pagamento durante sua avaliação."
      },
      {
        question: "A clínica aceita convênios odontológicos?",
        answer: "Sim, trabalhamos com diversos convênios odontológicos. Para saber se atendemos ao seu plano específico, entre em contato conosco informando o nome do seu convênio."
      }
    ]
  },
  {
    id: "procedimentos",
    title: "Procedimentos e Cuidados",
    questions: [
      {
        question: "Como devo me preparar para uma consulta odontológica?",
        answer: "É recomendável escovar os dentes antes da consulta, mas não é obrigatório. Chegue com 10 minutos de antecedência para preencher ou atualizar seu cadastro. Caso esteja utilizando algum medicamento, informe ao dentista durante a consulta."
      },
      {
        question: "Qual a frequência recomendada para visitas ao dentista?",
        answer: "Recomendamos consultas preventivas a cada 6 meses. Para pacientes com condições específicas como doença periodontal, o acompanhamento pode ser mais frequente, conforme orientação do seu dentista."
      },
      {
        question: "O que fazer em caso de dor de dente fora do horário de atendimento?",
        answer: "Em caso de emergência fora do horário de atendimento, recomendamos o uso de analgésicos conforme prescrição anterior (se houver) e entrar em contato conosco na primeira hora do próximo dia útil. Para casos graves, procure um pronto-atendimento."
      },
      {
        question: "Os procedimentos são dolorosos?",
        answer: "Utilizamos técnicas modernas de anestesia e sedação para garantir que os procedimentos sejam realizados com o mínimo desconforto possível. O seu conforto e bem-estar são prioridades durante todo o tratamento."
      },
      {
        question: "Posso fazer todos os tratamentos na mesma clínica?",
        answer: "Sim, a Magna Odonto oferece uma gama completa de tratamentos odontológicos em um só lugar. Nossa equipe multidisciplinar permite que você realize desde procedimentos preventivos até tratamentos estéticos e reabilitadores sem precisar se deslocar para outras clínicas."
      },
      {
        question: "Como funcionam os orçamentos para tratamentos?",
        answer: "Após a avaliação inicial, apresentamos um plano de tratamento detalhado com todas as opções disponíveis e respectivos valores. O orçamento é válido por 30 dias, e só iniciamos o tratamento após sua aprovação."
      },
      {
        question: "É possível parcelar os tratamentos?",
        answer: "Sim, oferecemos opções de parcelamento para maior comodidade. Os detalhes como número de parcelas e valores serão discutidos durante a apresentação do orçamento, conforme o tipo de tratamento escolhido."
      }
    ]
  },
  {
    id: "agendamento",
    title: "Agendamento e Consultas",
    questions: [
      {
        question: "Como posso agendar uma consulta?",
        answer: "Você pode agendar sua consulta através do nosso site na seção 'Agende sua Consulta', pelo WhatsApp (69) 99602-1979, por telefone ou pessoalmente na clínica."
      },
      {
        question: "É preciso pagar para agendar uma consulta inicial?",
        answer: "Não, o agendamento é gratuito e não há taxa de marcação. O valor da consulta só será cobrado após o atendimento."
      },
      {
        question: "Com quanto tempo de antecedência devo desmarcar uma consulta?",
        answer: "Pedimos que desmarque sua consulta com pelo menos 24 horas de antecedência, para que possamos oferecer o horário a outro paciente. Isso nos ajuda a manter a qualidade do atendimento e evitar tempos de espera prolongados."
      },
      {
        question: "Quanto tempo dura uma consulta inicial?",
        answer: "A consulta inicial geralmente dura entre 30 e 45 minutos. Neste primeiro contato, realizamos uma avaliação completa da sua saúde bucal, coletamos seu histórico médico e odontológico, e discutimos suas necessidades e expectativas."
      },
      {
        question: "Posso remarcar minha consulta pelo site?",
        answer: "Sim, você pode remarcar sua consulta através do nosso site. Acesse a seção 'Fale Conosco', preencha o formulário informando que deseja remarcar sua consulta e entraremos em contato para confirmar o novo horário."
      }
    ]
  }
];
