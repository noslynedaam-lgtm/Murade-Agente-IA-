// Respostas prontas do Consultor Murade: escritas e conferidas, servidas SEM chamar a IA (custo zero).
// Regra do dono: só entra aqui o que está conferido nos blocos de src/data/knowledgeDocs*.ts (com a fonte oficial
// e a data da conferência). Nada inventado. Ao mudar uma resposta, atualize "conferidoEm".
import type { Area, Fonte, REGIMES } from './tipos';

type Regime = (typeof REGIMES)[number];

export type RespostaPronta = {
  id: string;
  area: Area;
  /** Variações da pergunta (como o contador costuma perguntar). */
  perguntas: string[];
  /** Grupos obrigatórios: cada grupo precisa ter pelo menos um termo na pergunta (trava de segurança). */
  chaves: string[][];
  resposta: string;
  fontes: Fonte[];
  /** AAAA-MM-DD: data em que a regra foi conferida na fonte oficial (a do bloco da base). */
  conferidoEm: string;
  /** id do bloco da base de onde a resposta foi tirada. */
  blocoBase: string;
  /** Termos que, se aparecerem na pergunta, indicam outro assunto (a resposta pronta não é usada). */
  exceto?: string[];
  /** Regimes a que a resposta se aplica; se a empresa informada for de outro regime, a resposta pronta não é usada. */
  aplicaA?: Regime[];
};

// ── Fontes oficiais (as mesmas citadas nos blocos) ──
const F = {
  perguntaoSN: { titulo: 'Perguntas e Respostas do Simples Nacional (Receita Federal)', url: 'https://www8.receita.fazenda.gov.br/SimplesNacional/Arquivos/manual/PerguntaoSN.pdf' },
  govPgdas: { titulo: 'gov.br: Declarar apurações mensais do Simples Nacional', url: 'https://www.gov.br/pt-br/servicos/declarar-apuracoes-mensais-do-simples-nacional' },
  govDefis: { titulo: 'gov.br: Declarar apurações e informações anuais do Simples Nacional (DEFIS)', url: 'https://www.gov.br/pt-br/servicos/declarar-apuracoes-e-informacoes-anuais-do-simples-nacional' },
  lc123: { titulo: 'LC 123/2006 (Senado)', url: 'https://legis.senado.leg.br/norma/572878/publicacao/34621013' },
  perguntaoMEI: { titulo: 'Perguntas e Respostas MEI e Simei (CGSN)', url: 'https://www8.receita.fazenda.gov.br/SimplesNacional/Arquivos/manual/PerguntaoMEI.pdf' },
  lc238: { titulo: 'LC 238/2026 (Senado)', url: 'https://legis.senado.leg.br/norma/44276013/publicacao/44280206' },
  lei9249: { titulo: 'Lei 9.249/1995, texto atualizado (Câmara)', url: 'https://www2.camara.leg.br/legin/fed/lei/1995/lei-9249-26-dezembro-1995-349062-normaatualizada-pl.html' },
  rfbLc224: { titulo: 'Receita Federal: Perguntas e Respostas LC 224/2025', url: 'https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas/beneficios-fiscais/perguntas-e-respostas-reducao-de-beneficios-v2.pdf' },
  lei10833: { titulo: 'Lei 10.833/2003, texto atualizado (Câmara)', url: 'https://www2.camara.leg.br/legin/fed/lei/2003/lei-10833-29-dezembro-2003-497045-normaatualizada-pl.html' },
  lei8212: { titulo: 'Lei 8.212/1991, texto atualizado (Câmara)', url: 'https://www2.camara.leg.br/legin/fed/lei/1991/lei-8212-24-julho-1991-363647-normaatualizada-pl.html' },
  fap: { titulo: 'Ministério da Previdência: FAP', url: 'https://www.gov.br/previdencia/pt-br/assuntos/previdencia-social/saude-e-seguranca-do-trabalhador/fap' },
  dctfweb: { titulo: 'gov.br: Declarar débitos e créditos tributários federais (DCTFWeb)', url: 'https://www.gov.br/pt-br/servicos/declarar-debitos-e-creditos-tributarios-federais' },
  reinf: { titulo: 'gov.br: EFD-Reinf', url: 'https://www.gov.br/pt-br/servicos/efd-reinf' },
  mos: { titulo: 'Manual de Orientação do eSocial S-1.3', url: 'https://www.gov.br/esocial/pt-br/documentacao-tecnica/manuais/mos-s-1-3-consolidada-ate-a-no-s-1-3-12-2026.pdf/@@download/file' },
  clt: { titulo: 'CLT, texto atualizado (Câmara dos Deputados)', url: 'https://www2.camara.leg.br/legin/fed/declei/1940-1949/decreto-lei-5452-1-maio-1943-415500-normaatualizada-pe.html' },
  lei4749: { titulo: 'Lei 4.749/1965 – 13º salário (Senado)', url: 'https://legis.senado.leg.br/norma/546602/publicacao/15810446' },
  esocial13: { titulo: 'eSocial: prazo da 1ª parcela do 13º', url: 'https://www.gov.br/esocial/pt-br/noticias/prazo-para-pagamento-da-primeira-parcela-do-13o-salario-encerra-se-dia-30-de-novembro-fique-atento-programe-se-evite-deixar-para-a-ultima-hora' },
  lei12506: { titulo: 'Lei 12.506/2011 – aviso prévio proporcional (Planalto)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12506.htm' },
  lei15371: { titulo: 'Lei 15.371/2026 – licença-paternidade (Senado)', url: 'https://legis.senado.leg.br/norma/42975603/publicacao/42998279' },
  lei10101: { titulo: 'Lei 10.101/2000 – PLR (Câmara)', url: 'https://www2.camara.leg.br/legin/fed/lei/2000/lei-10101-19-dezembro-2000-353953-normaatualizada-pl.html' },
  seguroDes: { titulo: 'gov.br: Solicitar o Seguro-Desemprego', url: 'https://www.gov.br/pt-br/servicos/solicitar-o-seguro-desemprego' },
  lei15179: { titulo: 'Lei 15.179/2025 – consignado (Senado)', url: 'https://legis.senado.leg.br/norma/41160586/publicacao/41164746' },
  inss: { titulo: 'INSS: tabela de contribuição mensal', url: 'https://www.gov.br/inss/pt-br/direitos-e-deveres/inscricao-e-contribuicao/tabela-de-contribuicao-mensal' },
  rfb2026: { titulo: 'Receita Federal: tabelas de 2026', url: 'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026' },
  salFamilia: { titulo: 'INSS: valor limite do salário-família', url: 'https://www.gov.br/inss/pt-br/direitos-e-deveres/salario-familia/valor-limite-para-direito-ao-salario-familia' },
  fgtsPrazo: { titulo: 'MTE, FGTS Digital: verbas mensais e rescisórias e prazo de recolhimento', url: 'https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/fgtsdigital/comunicados/do-enquadramento-das-verbas-remuneratorias-em-tipo-mensal-e-tipo-rescisorio-prazo-de-recolhimento' },
  manualFgts: { titulo: 'Manual de Orientação do FGTS Digital 1.60', url: 'https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/fgtsdigital/manual-e-documentacao-tecnica/manual-de-orientacao-do-fgts-digital-versao-1-60-05-05-2026.pdf' },
  fgtsDigital: { titulo: 'FGTS Digital (fgts.gov.br)', url: 'https://www.fgts.gov.br/Paginas/empregador/fgts-digital.aspx' },
  lei8036: { titulo: 'Lei 8.036/1990 – FGTS (Câmara)', url: 'https://www2.camara.leg.br/legin/fed/lei/1990/lei-8036-11-maio-1990-365155-normaatualizada-pl.pdf' },
  cfcMpe: { titulo: 'CFC: normas de contabilidade para micro e pequenas empresas', url: 'https://cfc.org.br/noticias/contador-conheca-as-normas-de-contabilidade-voltadas-para-as-micro-e-pequenas-empresas/' },
  cfcDiario: { titulo: 'CFC: perguntas frequentes sobre o Livro Diário', url: 'https://cfc.org.br/tecnica/perguntas-frequentes/livro-diario/' },
  ecd: { titulo: 'gov.br: Entregar a ECD', url: 'https://www.gov.br/pt-br/servicos/entregar-escrituracao-contabil-digital' },
  ecf: { titulo: 'gov.br: Entregar a ECF', url: 'https://www.gov.br/pt-br/servicos/entregar-escrituracao-contabil-fiscal' },
  dirbi: { titulo: 'Receita Federal: DIRBI', url: 'https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/declaracoes-e-demonstrativos/dirbi-declaracao-de-incentivos-renuncias-beneficios-e-imunidades-de-natureza-tributaria' },
  certidao: { titulo: 'gov.br: Emitir certidão de regularidade fiscal', url: 'https://www.gov.br/pt-br/servicos/emitir-certidao-de-regularidade-fiscal-perante-a-fazenda-nacional' },
  parcSN: { titulo: 'gov.br: Parcelar débitos do Simples Nacional', url: 'https://www.gov.br/pt-br/servicos/parcelar-imposto-simples' },
  lei22460: { titulo: 'Lei estadual 22.460/2023 (Secretaria da Economia de Goiás)', url: 'https://appasp.economia.go.gov.br/legislacao/arquivos/Leis/L_22460.htm' },
  sgiss: { titulo: 'Prefeitura de Goiânia: FAQ do SGISS', url: 'https://www.goiania.go.gov.br/wp-content/uploads/2026/03/FAQ_FINAL_V3.pdf' },
  calIcms: { titulo: 'SEFAZ-GO: calendário de recolhimento do ICMS', url: 'https://goias.gov.br/economia/wp-content/uploads/sites/45/2026/01/Calendario_de_Recolhimento_de_ICMS_20250401-9.pdf' },
  difalGo: { titulo: 'SEFAZ-GO: manual do DIFAL do Simples Nacional', url: 'https://goias.gov.br/economia/wp-content/uploads/sites/45/2018/02/manual-sobre-difal-simples-nacional-6cc.pdf' },
  lei10147: { titulo: 'Lei 10.147/2000 – monofásico (Câmara)', url: 'https://www2.camara.leg.br/legin/fed/lei/2000/lei-10147-21-dezembro-2000-377630-normaatualizada-pl.html' },
  juceg: { titulo: 'JUCEG: passo a passo LTDA (abertura)', url: 'https://goias.gov.br/juceg/passo-a-passo-sociedade-empresaria-limitada-ltda-abertura/' },
  lc214: { titulo: 'LC 214/2025, texto compilado com a LC 227/2026 (Planalto)', url: 'https://planalto.gov.br/ccivil_03/leis/lcp/lcp214compilado.htm' },
  ec132: { titulo: 'Emenda Constitucional 132/2023 (Planalto)', url: 'https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc132.htm' },
  ntNfse: { titulo: 'NFS-e Nacional: Nota Técnica SE/CGNFS-e 004 (gov.br/nfse)', url: 'https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/rtc-producao-restrita-piloto/nt-004-se-cgnfse-novo-layout-rtc-v2-00-20251210.pdf' },
} satisfies Record<string, Fonte>;

const NOV = '2026-11-20'; // blocos de knowledgeDocsConsultor.ts
const OUT21 = '2026-10-21'; // blocos irrf-salario-familia-2026, fgts-inss (CI, FAP, Lei 8.036), clt-principios (Lei 12.506)
const OUT20 = '2026-10-20'; // tabela do INSS (bloco fgts-inss)

const B = {
  simples: 'simples-prazos-obrigacoes-conferido',
  mei: 'mei-limites-obrigacoes-conferido',
  presumido: 'lucro-presumido-presuncoes-lc224',
  retencoes: 'retencoes-csrf-inss-encargos',
  dctf: 'dctfweb-reinf-esocial-prazos-2026',
  clt: 'clt-jornada-ferias-rescisao-conferido',
  contabil: 'contabilidade-me-epp-nbc-tg-1001-1002',
  icmsIss: 'icms-go-iss-goiania-conferido',
  paternidade: 'licenca-paternidade-lei-15371',
  esocialNP: 'esocial-prazos-nao-periodicos-mos',
  plr: 'plr-seguro-desemprego-consignado',
  federais: 'obrigacoes-federais-ecd-ecf-dirbi-certidoes-parcelamento',
  icmsSt: 'icms-go-st-difal-monofasico',
  juceg: 'abertura-empresa-goias-juceg',
  folha: 'irrf-salario-familia-2026',
  fgtsInss: 'fgts-inss',
  cltPrincipios: 'clt-principios',
  reforma: 'reforma-tributaria-ibs-cbs-lc214-conferido',
};

const SN: Regime[] = ['simples'];
const SN_MEI: Regime[] = ['simples', 'mei'];
const LP: Regime[] = ['presumido'];
const LP_LR: Regime[] = ['presumido', 'real'];

export const RESPOSTAS_PRONTAS: RespostaPronta[] = [
  // ───────────────────────── SIMPLES NACIONAL ─────────────────────────
  {
    id: 'sn-limites-me-epp', area: 'fiscal', aplicaA: SN, conferidoEm: NOV, blocoBase: B.simples, fontes: [F.lc123, F.perguntaoSN],
    perguntas: ['Qual o limite de faturamento da microempresa e da EPP no Simples?', 'Qual o limite de receita bruta anual da empresa de pequeno porte?', 'Até quanto a microempresa pode faturar por ano?', 'Qual o teto de faturamento do Simples Nacional?'],
    chaves: [['limite', 'receita', 'ate quanto'], ['microempresa', 'epp', 'simples', 'pequeno porte']],
    resposta: 'Pela LC 123/2006, art. 3º: microempresa (ME) é a que tem receita bruta anual de até R$ 360.000,00; empresa de pequeno porte (EPP) é a que tem receita bruta anual acima de R$ 360.000,00 e até R$ 4.800.000,00.\n\nO que fazer: acompanhe a receita acumulada no ano para saber o enquadramento (ME ou EPP) e não ultrapassar o limite de R$ 4,8 milhões do Simples.',
  },
  {
    id: 'sn-pgdas-das-prazo', area: 'fiscal', aplicaA: SN, conferidoEm: NOV, blocoBase: B.simples, fontes: [F.govPgdas, F.perguntaoSN],
    perguntas: ['Até que dia tenho que transmitir o PGDAS-D e pagar o DAS?', 'Qual o vencimento do DAS do Simples Nacional?', 'Qual o prazo de entrega do PGDAS-D?', 'Quando vence o DAS?'],
    chaves: [['pgdas', 'DAS'], ['prazo', 'entregar', 'pagar']],
    resposta: 'O PGDAS-D é entregue e o DAS é pago até o dia 20 do mês seguinte ao da receita (competência ou caixa, conforme o regime escolhido). Base: serviço "Declarar apurações mensais do Simples Nacional" no gov.br e Perguntão do Simples, perguntas 6.4 e 6.8 (Resolução CGSN 140/2018, art. 40).\n\nSe não houver expediente bancário no dia 20, o pagamento passa para o primeiro dia útil seguinte. Valor pago depois do prazo sofre os acréscimos legais.\n\nRisco: entregar o PGDAS-D atrasado gera a MAED (multa de 2% ao mês, mínimo de R$ 50,00).',
  },
  {
    id: 'sn-das-feriado', area: 'fiscal', aplicaA: SN, conferidoEm: NOV, blocoBase: B.simples, fontes: [F.perguntaoSN],
    perguntas: ['O DAS que vence no fim de semana prorroga ou antecipa?', 'Se o dia 20 cair em feriado, quando pago o DAS?', 'DAS vencendo no sábado, posso pagar na segunda?'],
    chaves: [['DAS', 'pgdas'], ['feriado', 'diautil', 'prorroga', 'antecipa']],
    resposta: 'Prorroga. Pelo Perguntão do Simples (pergunta 6.8, com base na Resolução CGSN 140/2018, art. 40), se não houver expediente bancário no dia 20, o DAS pode ser pago no primeiro dia útil seguinte, sem acréscimos.\n\nAtenção: isso vale para o pagamento do DAS. A DEFIS, por exemplo, tem prazo fixo que não é prorrogado.',
  },
  {
    id: 'sn-maed', area: 'fiscal', aplicaA: SN, conferidoEm: NOV, blocoBase: B.simples, fontes: [F.perguntaoSN, F.lc123],
    perguntas: ['Qual a multa por entregar o PGDAS-D em atraso?', 'Como funciona a MAED do Simples Nacional?', 'Tem multa mínima no PGDAS-D atrasado?', 'Entreguei o PGDAS-D fora do prazo, qual a multa?'],
    chaves: [['pgdas', 'maed', 'simples'], ['multa', 'maed', 'atraso']],
    resposta: 'A multa por atraso ou falta de entrega do PGDAS-D (MAED) é de 2% ao mês-calendário ou fração sobre os tributos apurados, contada do dia seguinte ao prazo, limitada a 20%, com mínimo de R$ 50,00 por mês de referência (LC 123/2006, art. 38-A; Perguntão do Simples, pergunta 6.5).\n\nReduções: cai pela metade se a entrega for feita depois do prazo, mas antes de qualquer procedimento de ofício; fica em 75% se entregue no prazo da intimação. Informação incorreta ou omitida: R$ 20,00 para cada grupo de dez informações.\n\nA MAED é gerada na própria transmissão em atraso. O que fazer: transmita logo o período atrasado para aproveitar a redução de 50%.',
  },
  {
    id: 'sn-defis-prazo', area: 'fiscal', aplicaA: SN, conferidoEm: NOV, blocoBase: B.simples, fontes: [F.perguntaoSN, F.govDefis],
    perguntas: ['Qual o prazo de entrega da DEFIS?', 'Até quando tenho que entregar a DEFIS do Simples?', 'A DEFIS prorroga se cair no fim de semana?'],
    chaves: [['defis']],
    resposta: 'A DEFIS é entregue até 31 de março do ano seguinte ao dos fatos geradores (Perguntão do Simples, pergunta 6.10; Resolução CGSN 140/2018, art. 72; gov.br). O prazo é fixo: não é prorrogado nem antecipado por fim de semana ou feriado.\n\nCasos especiais: em incorporação, cisão, fusão ou extinção, o prazo é o último dia de junho se o evento ocorrer no primeiro quadrimestre; nos demais casos, o último dia do mês seguinte ao evento.\n\nAtenção: a Receita anunciou (Resoluções CGSN 190/191) que a DEFIS será substituída por informações no PGDAS-D; a data de início dessa mudança ainda precisa ser confirmada.',
  },
  {
    id: 'sn-fator-r', area: 'fiscal', aplicaA: SN, conferidoEm: NOV, blocoBase: B.simples, fontes: [F.lc123, F.perguntaoSN],
    perguntas: ['Qual o percentual do Fator R para sair do Anexo V e ir para o Anexo III?', 'Como funciona o Fator R no Simples Nacional?', 'Quando a atividade vai para o Anexo III pelo Fator R?'],
    chaves: [['fatorr', 'anexo']],
    resposta: 'O corte é 28%. Quando a folha de salários dos últimos 12 meses (FS12) dividida pela receita bruta dos últimos 12 meses (RBT12) for igual ou superior a 28% (0,28), a atividade sujeita ao Fator R é tributada no Anexo III; se for menor que 28%, vai para o Anexo V (LC 123/2006, art. 18, §§ 5º-J, 5º-M e 24; Perguntão do Simples, pergunta 5.11).\n\nPeríodo: até 2026, usam-se os 12 meses anteriores ao período de apuração; a partir de 2027, os 12 meses anteriores ao mês anterior ao período de apuração.\n\nO que fazer: confira mês a mês a relação folha/receita antes de transmitir o PGDAS-D, porque o anexo pode mudar de um mês para o outro.',
  },
  {
    id: 'sn-fator-r-folha', area: 'fiscal', aplicaA: SN, conferidoEm: NOV, blocoBase: B.simples, fontes: [F.perguntaoSN, F.lc123],
    perguntas: ['O que entra na folha de salários do Fator R?', 'Pró-labore entra no cálculo do Fator R?', 'Distribuição de lucros conta no Fator R?', 'FGTS e INSS patronal entram na folha do Fator R?'],
    chaves: [['fatorr', 'fs12']],
    resposta: 'Entram na folha (FS12) do Fator R: as remunerações informadas no eSocial/GFIP, o pró-labore, o 13º salário, a contribuição patronal previdenciária e o FGTS.\n\nNão entram: aluguéis, distribuição de lucros, valores pagos a estagiários e valores pagos a MEI (Perguntão do Simples, pergunta 5.11; LC 123/2006, art. 18, § 24).\n\nDica prática: em empresa de serviço com pouca folha, um pró-labore bem definido (e informado no eSocial) é o que costuma levar a relação a 28%.',
  },
  {
    id: 'sn-livros', area: 'contabil', aplicaA: SN, conferidoEm: NOV, blocoBase: B.simples, fontes: [F.perguntaoSN, F.lc123],
    perguntas: ['Quais livros a empresa do Simples Nacional é obrigada a ter?', 'Livros obrigatórios do optante do Simples', 'Empresa do Simples precisa de Livro Caixa?'],
    chaves: [['livro', 'livrocaixa', 'livroinventario'], ['simples', 'optante', 'obrigatorio', 'obrigado', 'livrocaixa']],
    resposta: 'O optante do Simples deve manter (Perguntão do Simples, pergunta 11.2; Resolução CGSN 140/2018, art. 63; LC 123/2006, art. 26, § 2º): Livro Caixa (movimentação financeira e bancária), Registro de Inventário, Registro de Entradas (se contribuinte do ICMS), Registro de Serviços Prestados e Tomados (se contribuinte do ISS) e livros específicos conforme a atividade (combustíveis, selo, impressão de documentos, veículos).\n\nO Livro Caixa é dispensado para quem mantém Livro Diário e Razão escriturados. A ME/EPP pode adotar contabilidade simplificada (LC 123, art. 27).',
  },
  {
    id: 'sn-livro-caixa-dispensa', area: 'contabil', aplicaA: SN, conferidoEm: NOV, blocoBase: B.simples, fontes: [F.perguntaoSN, F.cfcMpe],
    perguntas: ['Quem tem contabilidade completa precisa do Livro Caixa no Simples?', 'O Livro Caixa é dispensado se tiver Diário e Razão?', 'Posso substituir o Livro Caixa pela escrituração contábil?'],
    chaves: [['livrocaixa'], ['dispensa', 'dispensado', 'diario', 'livrodiario', 'razao', 'contabilidade', 'escrituracao', 'substituir']],
    resposta: 'Sim, é dispensado. O Livro Caixa do optante do Simples é dispensado para quem mantém Livro Diário e Razão devidamente escriturados (Perguntão do Simples, pergunta 11.2; Resolução CGSN 140/2018, art. 63).\n\nLembre que, pelo CFC, as demonstrações contábeis são elaboradas mesmo sem movimento e o Diário é autenticado (com a ECD, pelo SPED).',
  },
  {
    id: 'sn-sem-retencao-csrf', area: 'fiscal', aplicaA: SN, conferidoEm: NOV, blocoBase: B.retencoes, fontes: [F.lei10833],
    perguntas: ['Empresa do Simples sofre retenção de PIS, Cofins e CSLL?', 'Optante do Simples tem retenção de 4,65% na nota de serviço?', 'Tomador do Simples precisa reter PIS Cofins CSLL?'],
    chaves: [['simples', 'optante'], ['retencao', 'reter', 'retido', 'csrf', '4,65']],
    resposta: 'Não. Pela Lei 10.833/2003, art. 32, não se faz a retenção de PIS, Cofins e CSLL (CSRF) nos pagamentos a optantes pelo Simples Nacional. E o optante pelo Simples, quando é o tomador, também não está obrigado a reter (art. 30, § 2º).\n\nO que fazer: o prestador do Simples deve informar na nota que é optante, para o tomador não reter.',
  },
  {
    id: 'sn-monofasico', area: 'fiscal', aplicaA: SN, conferidoEm: NOV, blocoBase: B.icmsSt, fontes: [F.perguntaoSN, F.lei10147],
    perguntas: ['Como tratar produto monofásico no Simples Nacional?', 'Empresa do Simples paga PIS e Cofins sobre produto monofásico?', 'Como segregar receita monofásica no PGDAS-D?'],
    chaves: [['monofasico', 'monofasica']],
    resposta: 'No Simples, a receita de produto com PIS/Cofins monofásico deve ser segregada no PGDAS-D, para não pagar PIS e Cofins dentro do DAS (Perguntão do Simples, perguntas 7.2 a 7.4; LC 123, art. 18, § 4º-A, I, e § 12; Resolução CGSN 140, art. 25, § 6º). Quem comercializa usa o Anexo I; quem industrializa ou importa usa o Anexo II.\n\nBase do monofásico: a Lei 10.147/2000 concentra o PIS/Cofins no fabricante ou importador (ex.: farmacêuticos, perfumaria, higiene pessoal). A alíquota zero do art. 2º na revenda não vale para o optante do Simples, que trata pela segregação.\n\nRisco: não segregar = pagar PIS/Cofins em dobro na cadeia.',
  },
  {
    id: 'sn-icms-st-pgdas', area: 'fiscal', aplicaA: SN, conferidoEm: NOV, blocoBase: B.icmsSt, fontes: [F.perguntaoSN],
    perguntas: ['Como informar mercadoria com ICMS-ST no PGDAS-D?', 'Empresa do Simples substituída paga ICMS no DAS sobre produto com substituição tributária?', 'ICMS-ST do optante do Simples substituto é pago no DAS?'],
    chaves: [['icmsst'], ['pgdas', 'das', 'simples', 'optante']],
    resposta: 'Depende de a empresa ser substituída ou substituta (Perguntão do Simples, perguntas 7.1, 7.6 e 7.9):\n- Substituída (comprou com ICMS-ST já retido): informe a receita como sujeita à ST no PGDAS-D, para não pagar o ICMS dentro do DAS.\n- Substituta (ela retém o ICMS-ST): o ICMS-ST é recolhido fora do DAS (Resolução CGSN 140, arts. 25, § 8º, II, e 28) e não integra a receita bruta.\n\nEm Goiás, o ICMS-ST do remetente do Simples inscrito vence até o dia 2 do segundo mês seguinte à saída (calendário oficial da SEFAZ-GO).',
  },
  {
    id: 'sn-parcelamento', area: 'fiscal', aplicaA: SN, conferidoEm: NOV, blocoBase: B.federais, fontes: [F.parcSN],
    perguntas: ['Em quantas parcelas posso parcelar débitos do Simples Nacional?', 'Qual a parcela mínima do parcelamento do Simples?', 'Como parcelar DAS atrasado do Simples Nacional?'],
    chaves: [['parcelamento', 'parcela'], ['simples', 'DAS', 'pgdas']],
    resposta: 'No parcelamento ordinário do Simples (IN RFB 1.508/2014; serviço "Parcelar débitos do Simples Nacional" no gov.br), os débitos declarados no PGDAS-D e ainda não enviados à Dívida Ativa podem ser parcelados em até 60 parcelas, com parcela mínima de R$ 300,00. Se já foram para a Dívida Ativa, o pedido é feito na PGFN.\n\nAtenção: o parcelamento é rescindido com a falta de pagamento de 3 parcelas, seguidas ou não, ou da última; aí os débitos vão para a Dívida Ativa. Reparcelamento é permitido com primeira parcela de 10% do total (20% se já houve reparcelamento).',
  },
  {
    id: 'sn-parcelamento-rescisao', area: 'fiscal', aplicaA: SN, conferidoEm: NOV, blocoBase: B.federais, fontes: [F.parcSN],
    perguntas: ['Quantas parcelas atrasadas cancelam o parcelamento do Simples?', 'Quando o parcelamento do Simples é rescindido?', 'Posso reparcelar o Simples Nacional? Qual a entrada?'],
    chaves: [['parcelamento', 'reparcelar', 'reparcelamento', 'parcela'], ['simples', 'rescindido', 'rescisao', 'cancela', 'reparcelar', 'reparcelamento']],
    resposta: 'O parcelamento do Simples é rescindido com a falta de pagamento de 3 parcelas, seguidas ou não, ou da última parcela; os débitos são enviados à Dívida Ativa (gov.br, "Parcelar débitos do Simples Nacional"; IN RFB 1.508/2014).\n\nReparcelamento: é permitido, inclusive com novos débitos; a primeira parcela é de 10% do total, ou 20% se já houve reparcelamento antes.',
  },
  {
    id: 'sn-iss-goiania', area: 'fiscal', aplicaA: SN_MEI, conferidoEm: NOV, blocoBase: B.icmsIss, fontes: [F.sgiss],
    perguntas: ['Empresa do Simples em Goiânia precisa informar a alíquota do ISS na NFS-e?', 'Como fica o ISS do Simples Nacional em Goiânia no SGISS?', 'ISS retido de optante do Simples em Goiânia, informo a alíquota na nota?'],
    chaves: [['iss', 'nfse', 'sgiss'], ['simples', 'optante'], ['goiania', 'sgiss']],
    resposta: 'Pelo FAQ oficial do SGISS da Prefeitura de Goiânia: se o ISS NÃO for retido, informar a alíquota na NFS-e é facultativo e o ISS é pago no DAS; se o ISS for retido pelo tomador, a alíquota é obrigatória na nota.\n\nO que fazer: quando o tomador reter, confira a alíquota da faixa do Simples antes de emitir, porque é ela que o tomador vai recolher.',
  },

  // ───────────────────────── MEI ─────────────────────────
  {
    id: 'mei-limite-2026', area: 'fiscal', aplicaA: ['mei'], conferidoEm: NOV, blocoBase: B.mei, fontes: [F.lc123, F.perguntaoMEI, F.lc238],
    perguntas: ['Qual o limite de faturamento do MEI?', 'Quanto o MEI pode faturar por ano em 2026?', 'Qual o limite do MEI no ano de abertura?', 'Qual o limite proporcional do MEI que abriu no meio do ano?'],
    chaves: [['mei', 'simei'], ['limite', 'receita', 'quanto', 'proporcional']],
    resposta: 'Em 2026 o limite do MEI é de R$ 81.000,00 por ano (LC 123/2006, art. 18-A, § 1º). No ano de início, o limite é de R$ 6.750,00 multiplicados pelo número de meses entre o início e o fim do ano, contando fração de mês como mês inteiro (Perguntão MEI, 1.2 e 6.4).\n\nMudança já aprovada (LC 238/2026): R$ 110.000,00 em 2027 e R$ 140.000,00 a partir de 2028 (este último depende das leis orçamentárias).',
  },
  {
    id: 'mei-limite-2027', area: 'fiscal', aplicaA: ['mei'], conferidoEm: NOV, blocoBase: B.mei, fontes: [F.lc238],
    perguntas: ['Qual será o limite de faturamento do MEI em 2027?', 'O limite do MEI vai subir para 110 mil?', 'Qual o novo limite do MEI pela LC 238/2026?', 'Qual o limite do MEI em 2028?'],
    chaves: [['mei'], ['2027', '2028', '238', '110', '140', 'novo']],
    resposta: 'Pela LC 238/2026 (texto lido no Senado): em 2027 o limite anual do MEI passa a R$ 110.000,00 (art. 2º), ou R$ 9.166,67 por mês no ano de início. A partir de 1º/1/2028, R$ 140.000,00 (R$ 11.666,67 por mês no início), mas essa ampliação depende de a renúncia constar nas leis orçamentárias de 2027 a 2029 (art. 3º). Em 2026 continua R$ 81.000,00.\n\nA mesma lei permite ao MEI rural até 2 empregados a partir de 2027 e prevê remissão das dívidas do MEI com a União de fatos geradores até 13/10/2026.',
  },
  {
    id: 'mei-excesso', area: 'fiscal', aplicaA: ['mei'], conferidoEm: NOV, blocoBase: B.mei, fontes: [F.perguntaoMEI],
    perguntas: ['O que acontece se o MEI passar do limite de faturamento?', 'MEI ultrapassou o limite em menos de 20%, o que fazer?', 'MEI estourou o limite em mais de 20%', 'Desenquadramento do MEI por excesso de receita'],
    chaves: [['mei'], ['excesso', 'ultrapass', 'passar', 'estourou', 'desenquadramento', 'acima']],
    resposta: 'Depende do tamanho do excesso (Perguntão MEI, perguntas 6.4 e 6.8):\n- Excesso de até 20% do limite: o desenquadramento vale a partir de 1º de janeiro do ano seguinte. Comunique até o último dia útil do mês seguinte ao do excesso. O imposto sobre o excesso é pago num "DAS de excesso", gerado na DASN-SIMEI, no vencimento do DAS de janeiro do ano seguinte.\n- Excesso acima de 20%: o desenquadramento retroage a 1º de janeiro do ano do excesso (ou ao início da atividade), e a empresa recolhe pelo Simples (ME/EPP) desde então.\n\nRisco: no excesso acima de 20%, todo o ano é recalculado; faça a comunicação logo.',
  },
  {
    id: 'mei-empregado', area: 'dp', aplicaA: ['mei'], conferidoEm: NOV, blocoBase: B.mei, fontes: [F.perguntaoMEI, F.lc238],
    perguntas: ['Quantos empregados o MEI pode ter?', 'MEI pode contratar funcionário?', 'Qual salário o empregado do MEI pode ganhar?', 'MEI com empregado tem que fazer eSocial e FGTS?'],
    chaves: [['mei'], ['empregado', 'contratar', 'admissao']],
    resposta: 'O MEI pode ter no máximo um empregado, que receba um salário mínimo ou o piso da categoria (LC 123, art. 18-C; Perguntão MEI 1.2, 3.1, 3.6 e 6.3). Contratar mais de um leva ao desenquadramento.\n\nCom empregado, o MEI passa a ter as obrigações do empregador: eSocial, FGTS e a contribuição patronal (o percentual dessa contribuição do MEI eu preciso confirmar).\n\nA partir de 1º/1/2027 (LC 238/2026, art. 18-C): o MEI rural pode ter até 2 empregados, e qualquer MEI pode contratar substituto durante afastamento legal do empregado.',
  },
  {
    id: 'mei-das-composicao', area: 'fiscal', aplicaA: ['mei'], conferidoEm: NOV, blocoBase: B.mei, fontes: [F.perguntaoMEI, F.inss],
    perguntas: ['O que está incluído no DAS do MEI?', 'Quanto é o INSS do MEI no DAS?', 'Qual a composição do boleto mensal do MEI?'],
    chaves: [['dasmei', 'mei'], ['DAS', 'dasmei', 'inss', 'composicao', 'incluido', 'boleto']],
    resposta: 'O DAS-MEI tem (Perguntão MEI, pergunta 3.1): INSS de 5% do limite mínimo do salário de contribuição (12% para o MEI transportador autônomo de cargas), mais R$ 1,00 de ICMS (se contribuinte do ICMS) e R$ 5,00 de ISS (se contribuinte do ISS).\n\nEm 2026, com o salário mínimo de R$ 1.621,00, os 5% do INSS dão R$ 81,05 (tabela do INSS).',
  },
  {
    id: 'mei-dasn', area: 'fiscal', aplicaA: ['mei'], conferidoEm: NOV, blocoBase: B.mei, fontes: [F.perguntaoMEI],
    perguntas: ['Até quando o MEI tem que entregar a DASN-SIMEI?', 'Qual o prazo da declaração anual do MEI?', 'A DASN-SIMEI é prorrogada?'],
    chaves: [['dasnsimei']],
    resposta: 'A DASN-SIMEI é entregue até o último dia de maio de cada ano, com a receita bruta do ano anterior e a informação de empregado contratado (Perguntão MEI, pergunta 3.9; Resolução CGSN 140, art. 109). O prazo não é prorrogado.\n\nSe houve excesso de receita de até 20%, é na DASN-SIMEI que se gera o DAS do excesso.',
  },
  {
    id: 'mei-remissao', area: 'fiscal', aplicaA: ['mei'], conferidoEm: NOV, blocoBase: B.mei, fontes: [F.lc238],
    perguntas: ['Como funciona o perdão das dívidas do MEI da LC 238/2026?', 'A remissão do MEI vale para dívidas parceladas?', 'MEI vai ter as dívidas perdoadas?'],
    chaves: [['mei'], ['remissao', 'perdao', 'perdoada', 'divida', 'debito']],
    resposta: 'A LC 238/2026 (arts. 5º a 7º, efeitos a partir de 1º/1/2027) perdoa integralmente as dívidas do MEI com a União de fatos geradores até 13/10/2026, inclusive as parceladas. A condição é manter em dia as contribuições dos 6 meses seguintes. Não dá direito a restituição do que já foi pago. A regulamentação é da PGFN.\n\nO que fazer: deixe o MEI com os DAS em dia a partir de agora, para não perder o perdão.',
  },

  // ───────────────────────── LUCRO PRESUMIDO ─────────────────────────
  {
    id: 'lp-presuncao-servicos', area: 'fiscal', aplicaA: LP, conferidoEm: NOV, blocoBase: B.presumido, fontes: [F.lei9249],
    perguntas: ['No Lucro Presumido, qual o percentual de presunção do IRPJ para prestação de serviços?', 'Qual a presunção de serviços no presumido?', 'Presunção de 32% vale para quais atividades?'],
    chaves: [['presumido', 'presuncao'], ['servico', '32']],
    resposta: 'Para prestação de serviços em geral, a presunção do IRPJ é de 32% da receita bruta (Lei 9.249/1995, art. 15, § 1º, III). Os 32% também valem para intermediação de negócios, administração, locação ou cessão de bens e direitos, factoring e construção vinculada a concessão. A CSLL de serviços em geral também é presumida a 32% (art. 20).\n\nAtenção: desde 2026, sobre a parte da receita que passar de R$ 5 milhões no ano, o percentual sobe 10% (32% vira 35,2%) pela LC 224/2025.',
  },
  {
    id: 'lp-presuncao-comercio', area: 'fiscal', aplicaA: LP, conferidoEm: NOV, blocoBase: B.presumido, fontes: [F.lei9249],
    perguntas: ['No Lucro Presumido, qual o percentual de presunção do IRPJ para comércio e indústria?', 'Qual a presunção do IRPJ para revenda de mercadorias?', 'Presunção de 8% no presumido'],
    chaves: [['presumido', 'presuncao'], ['comercio', 'industria', 'revenda', 'mercadoria', '8']],
    resposta: 'Para comércio, indústria e transporte de carga, a presunção do IRPJ é de 8% da receita bruta (Lei 9.249/1995, art. 15, caput). Para a CSLL, essas atividades usam 12% (art. 20).\n\nOutros percentuais do IRPJ: 1,6% na revenda de combustíveis; 16% no transporte que não seja de carga; 32% em serviços em geral. Com várias atividades, aplica-se o percentual de cada uma (§ 2º).',
  },
  {
    id: 'lp-presuncao-transporte', area: 'fiscal', aplicaA: LP, conferidoEm: NOV, blocoBase: B.presumido, fontes: [F.lei9249],
    perguntas: ['Qual a presunção do IRPJ para transporte de passageiros no Lucro Presumido?', 'Presunção de revenda de combustível no presumido', 'Presunção de 16% e 1,6% no IRPJ'],
    chaves: [['presumido', 'presuncao'], ['transporte', 'combustivel', 'passageiro', '16', '1,6']],
    resposta: 'Pela Lei 9.249/1995, art. 15: transporte que não seja de carga (ex.: passageiros) usa 16%; revenda, para consumo, de combustíveis derivados de petróleo, álcool carburante e gás natural usa 1,6%; transporte de carga usa 8%.\n\nDesde 2026, a parte da receita que passa de R$ 5 milhões no ano tem o percentual acrescido de 10% (LC 224/2025).',
  },
  {
    id: 'lp-csll-presuncao', area: 'fiscal', aplicaA: LP, conferidoEm: NOV, blocoBase: B.presumido, fontes: [F.lei9249],
    perguntas: ['Qual a presunção da CSLL no Lucro Presumido?', 'CSLL presumida de 12% ou 32%?', 'Percentual de presunção da CSLL para serviços'],
    chaves: [['csll'], ['presumido', 'presuncao', 'presumida']],
    resposta: 'A base presumida da CSLL é de 32% para as atividades do art. 15, § 1º, III, da Lei 9.249/1995 (serviços em geral, intermediação, administração, locação etc.) e de 12% para as demais receitas (comércio, indústria, transporte) (Lei 9.249, art. 20). Empresa Simples de Crédito: 38,4%.\n\nLC 224/2025: o acréscimo de 10% nos percentuais (sobre a receita acima do limite) vale para a CSLL a partir do 2º trimestre de 2026.',
  },
  {
    id: 'lp-adicional-irpj', area: 'fiscal', aplicaA: LP_LR, conferidoEm: NOV, blocoBase: B.presumido, fontes: [F.lei9249],
    perguntas: ['Qual a alíquota do IRPJ e quando incide o adicional de 10%?', 'Como funciona o adicional do IRPJ no trimestre?', 'Adicional de IRPJ acima de 60 mil no trimestre'],
    chaves: [['irpj'], ['adicional', 'aliquota', '60', '20']],
    resposta: 'O IRPJ é de 15% sobre o lucro, mais adicional de 10% sobre a parcela do lucro que passar de R$ 20.000,00 multiplicados pelo número de meses do período, ou seja, R$ 60.000,00 no trimestre (Lei 9.249/1995, art. 3º). O adicional não admite deduções.',
  },
  {
    id: 'lp-lc224', area: 'fiscal', aplicaA: LP, conferidoEm: NOV, blocoBase: B.presumido, fontes: [F.rfbLc224],
    perguntas: ['Como funciona o acréscimo de 10% na presunção do Lucro Presumido da LC 224/2025?', 'O que mudou no Lucro Presumido com a LC 224?', 'Presunção maior para receita acima de 5 milhões no ano', 'Acréscimo de 10% na presunção acima de 5 milhões'],
    chaves: [['224', '5 milhoes', 'acrescimo']],
    resposta: 'Pela LC 224/2025 (Perguntas e Respostas da Receita, perguntas 8 e 11 a 14), os percentuais de presunção sobem 10% (8% vira 8,8%; 32% vira 35,2%), mas só sobre a receita bruta que exceder R$ 5.000.000,00 no ano (R$ 1.250.000,00 por trimestre), apurado por período e por atividade. Receitas tributadas integralmente (financeiras, ganhos de capital) ficam fora do limite.\n\nVigência: IRPJ desde o 1º trimestre de 2026; CSLL desde o 2º trimestre de 2026 (para a CSLL em 2026 o limite anual é R$ 3.750.000,00).\n\nExemplo oficial: comércio com R$ 1.500.000,00 no 1º trimestre de 2026 = 8% sobre R$ 1.250.000,00 + 8,8% sobre R$ 250.000,00.',
  },
  {
    id: 'lp-lucros-2025', area: 'fiscal', aplicaA: LP_LR, conferidoEm: NOV, blocoBase: B.presumido, fontes: [F.lei9249],
    perguntas: ['Lucros apurados até 2025 continuam isentos na distribuição?', 'Distribuição de lucros de 2025 aprovada até dezembro é isenta?', 'Remessa de lucros ao exterior tem IR de quanto?'],
    chaves: [['lucro', 'dividendo'], ['isento', 'isencao', '2025', 'exterior', 'remessa']],
    resposta: 'Pela Lei 9.249/1995, art. 10 (redação da Lei 15.270/2025): lucros apurados até o ano-calendário de 2025, com distribuição aprovada até 31/12/2025, continuam isentos (§ 5º, I). A isenção na fonte, em geral, depende de observar os arts. 6º-A e 16-A da Lei 9.250/1995. Remessa de lucros ao exterior: 10% de IR na fonte (§ 4º).\n\nO detalhe da retenção mensal sobre lucros a partir de 2026 eu prefiro conferir caso a caso com o contador responsável.',
  },

  // ───────────────────────── RETENÇÕES ─────────────────────────
  {
    id: 'ret-csrf-aliquota', area: 'fiscal', aplicaA: LP_LR, conferidoEm: NOV, blocoBase: B.retencoes, fontes: [F.lei10833],
    perguntas: ['Qual o percentual de retenção de PIS, Cofins e CSLL na nota de serviço?', 'Como é composta a retenção de 4,65%?', 'Qual a alíquota da CSRF?'],
    chaves: [['csrf', '4,65', 'retencao', 'reter', 'retido'], ['pis', 'cofins', 'csll', 'csrf', '4,65']],
    resposta: 'A retenção é de 4,65%: 1% de CSLL + 3% de Cofins + 0,65% de PIS, mesmo que o prestador seja do regime não cumulativo (Lei 10.833/2003, art. 31).\n\nNão se retém quando o valor da retenção for de até R$ 10,00 (art. 31, § 3º) nem de optantes do Simples (art. 32). O recolhimento é até o último dia útil do segundo decêndio do mês seguinte ao do pagamento (art. 35).',
  },
  {
    id: 'ret-csrf-servicos', area: 'fiscal', conferidoEm: NOV, blocoBase: B.retencoes, fontes: [F.lei10833],
    perguntas: ['Em quais serviços tem retenção de PIS, Cofins e CSLL?', 'Quais serviços sofrem a retenção de 4,65%?', 'Serviço de limpeza e vigilância tem retenção de CSRF?'],
    chaves: [['retencao', 'reter', 'csrf', '4,65'], ['servico', 'quais', 'limpeza', 'vigilancia']],
    resposta: 'Pela Lei 10.833/2003, art. 30, há retenção de PIS, Cofins e CSLL nos pagamentos de pessoa jurídica a pessoa jurídica de direito privado por: limpeza, conservação, manutenção, segurança, vigilância, transporte de valores, locação de mão de obra, assessoria creditícia e remuneração de serviços profissionais. Também retêm associações, sociedades simples, fundações e condomínios edilícios (§ 1º).\n\nNão há retenção sobre pagamentos a optantes do Simples (art. 32).',
  },
  {
    id: 'ret-csrf-dispensa-prazo', area: 'fiscal', conferidoEm: NOV, blocoBase: B.retencoes, fontes: [F.lei10833],
    perguntas: ['Qual o prazo para recolher o PIS, Cofins e CSLL retidos?', 'Retenção de CSRF até 10 reais precisa recolher?', 'Até quando pago o DARF da retenção de 4,65%?'],
    chaves: [['csrf', '4,65', 'retido', 'retencao'], ['prazo', 'pagar', 'dispensa', '10']],
    resposta: 'O PIS, a Cofins e a CSLL retidos são recolhidos até o último dia útil do segundo decêndio do mês seguinte ao do pagamento da nota (Lei 10.833/2003, art. 35). Fica dispensada a retenção de valor igual ou inferior a R$ 10,00 (art. 31, § 3º).',
  },
  {
    id: 'ret-inss-11', area: 'fiscal', conferidoEm: NOV, blocoBase: B.retencoes, fontes: [F.lei8212],
    perguntas: ['Qual a retenção de INSS na nota fiscal de cessão de mão de obra?', 'Retenção de 11% do INSS, qual o prazo de recolhimento?', 'Como funciona a retenção previdenciária de 11%?'],
    chaves: [['inss', '11', 'previdenciaria'], ['cessaomaoobra', 'retencao', 'reter', '11']],
    resposta: 'Na cessão de mão de obra (inclusive trabalho temporário), o contratante retém 11% do valor bruto da nota fiscal ou fatura e recolhe em nome da empresa cedente até o dia 20 do mês seguinte à emissão; se não houver expediente bancário, no dia útil anterior (Lei 8.212/1991, art. 31).\n\nO valor retido vem destacado na nota e a cedente o compensa nas contribuições sobre a própria folha (§ 1º).',
  },
  {
    id: 'ret-cessao-conceito', area: 'fiscal', conferidoEm: NOV, blocoBase: B.retencoes, fontes: [F.lei8212],
    perguntas: ['O que é cessão de mão de obra para a retenção do INSS?', 'Quais serviços são cessão de mão de obra?', 'Limpeza e vigilância são cessão de mão de obra?'],
    chaves: [['cessaomaoobra']],
    resposta: 'Cessão de mão de obra é colocar trabalhadores à disposição do contratante, nas dependências dele ou de terceiros, para serviços contínuos, ligados ou não à atividade-fim (Lei 8.212/1991, art. 31, § 3º). Exemplos da lei (§ 4º): limpeza, conservação e zeladoria; vigilância e segurança; empreitada de mão de obra; trabalho temporário (Lei 6.019/1974).\n\nNesses casos há retenção de 11% do INSS na nota. A lista completa de serviços está em Instrução Normativa que eu preciso confirmar antes de enquadrar um serviço fora desses exemplos.',
  },
  {
    id: 'enc-patronal', area: 'dp', aplicaA: LP_LR, conferidoEm: NOV, blocoBase: B.retencoes, fontes: [F.lei8212],
    perguntas: ['Qual a contribuição patronal do INSS sobre a folha de empregados?', 'Quanto a empresa do Lucro Presumido paga de INSS patronal?', 'Qual a alíquota do RAT?', 'Encargos patronais sobre a folha de pagamento'],
    chaves: [['patronal', 'rat', 'encargo']],
    resposta: 'Pela Lei 8.212/1991, art. 22 (empresas fora do Simples):\n- 20% sobre o total das remunerações de empregados e avulsos (inciso I);\n- RAT de 1% (risco leve), 2% (médio) ou 3% (grave), conforme a atividade preponderante (inciso II), multiplicado pelo FAP;\n- 20% sobre o que for pago a contribuintes individuais, como pró-labore e autônomos (inciso III).\nRecolhimento até o dia 20 do mês seguinte (art. 30, I, b).\n\nAlém disso há a contribuição de Terceiros (Sistema S, salário-educação etc.), que varia pelo FPAS: esse percentual eu preciso confirmar para a atividade da empresa.',
  },
  {
    id: 'enc-fap', area: 'dp', conferidoEm: OUT21, blocoBase: B.fgtsInss, fontes: [F.fap, F.lei8212],
    perguntas: ['O que é o FAP e como ele altera o RAT?', 'Qual a faixa do FAP?', 'FAP aumenta ou reduz a contribuição?'],
    chaves: [['fap']],
    resposta: 'O FAP (Fator Acidentário de Prevenção) é um multiplicador de 0,5000 a 2,0000, calculado por estabelecimento com base nos acidentes e doenças do trabalho dos últimos dois anos, que multiplica a alíquota do RAT de 1%, 2% ou 3% (Ministério da Previdência). Abaixo de 1,0 reduz a contribuição (até a metade); acima de 1,0 aumenta (até o dobro). Muda todo ano.\n\nO que fazer: consulte o FAP de cada estabelecimento no serviço do gov.br e informe no eSocial.',
  },
  {
    id: 'enc-prolabore', area: 'dp', aplicaA: LP_LR, conferidoEm: NOV, blocoBase: B.retencoes, fontes: [F.lei8212],
    perguntas: ['Qual o INSS patronal sobre o pró-labore?', 'A empresa paga 20% de INSS sobre o pró-labore do sócio?', 'Contribuição da empresa sobre autônomos e pró-labore'],
    chaves: [['prolabore', 'autonomo', 'contribuinte individual'], ['inss', 'patronal', '20', 'contribuicao']],
    resposta: 'A empresa (fora do Simples) paga 20% sobre o total pago ou creditado a contribuintes individuais que lhe prestam serviço, como o pró-labore dos sócios e os autônomos (Lei 8.212/1991, art. 22, III), com recolhimento até o dia 20 do mês seguinte (art. 30, I, b).\n\nNo Simples, a contribuição patronal depende do anexo (no Anexo IV é recolhida à parte).',
  },
  {
    id: 'enc-plr-diarias', area: 'dp', conferidoEm: NOV, blocoBase: B.retencoes, fontes: [F.lei8212, F.lei10101],
    perguntas: ['PLR tem incidência de INSS?', 'Diárias de viagem entram no salário de contribuição?', 'Incide INSS sobre participação nos lucros?'],
    chaves: [['plr', 'diaria'], ['inss', 'incide', 'incidencia', 'salario de contribuicao', 'encargo']],
    resposta: 'Não integram o salário de contribuição do INSS (Lei 8.212/1991, art. 28, § 9º): a PLR paga de acordo com a lei específica (alínea j; Lei 10.101/2000) e as diárias para viagens (alínea h).\n\nAtenção: a PLR só fica fora se seguir a Lei 10.101 (acordo com comissão/sindicato, regras claras, no máximo 2 pagamentos por ano com intervalo de pelo menos um trimestre civil).',
  },

  // ───────────────────────── DCTFWeb / Reinf / eSocial ─────────────────────────
  {
    id: 'dctfweb-prazo', area: 'dp', conferidoEm: NOV, blocoBase: B.dctf, fontes: [F.dctfweb],
    perguntas: ['Qual o prazo de entrega da DCTFWeb?', 'Até quando transmito a DCTFWeb mensal?', 'A DCTFWeb ainda vence no dia 15?'],
    chaves: [['dctfweb']],
    resposta: 'A DCTFWeb mensal é entregue até o último dia útil do mês seguinte ao dos fatos geradores (IN RFB 2.237/2024; gov.br, "Declarar débitos e créditos tributários federais"). O prazo antigo do dia 15 valeu só até o período 12/2024.\n\nA DCTFWeb se alimenta do eSocial, da EFD-Reinf e do MIT, e só fica disponível depois do fechamento do eSocial e da Reinf. O pagamento do DARF previdenciário continua até o dia 20 do mês seguinte (Lei 8.212, art. 30, I, b).\n\nRisco: atraso gera MAED (o valor eu preciso confirmar).',
  },
  {
    id: 'dctfweb-mit', area: 'fiscal', aplicaA: LP_LR, conferidoEm: NOV, blocoBase: B.dctf, fontes: [F.dctfweb],
    perguntas: ['O que é o MIT da DCTFWeb?', 'A DCTF acabou? Como declaro IRPJ, CSLL, PIS e Cofins agora?', 'MIT substitui a DCTF?'],
    chaves: [['mit', 'dctf']],
    resposta: 'A DCTF e a DCTFWeb foram unificadas (IN RFB 2.237/2024). O MIT (Módulo de Inclusão de Tributos) substitui o antigo PGD DCTF para declarar IRPJ, CSLL, PIS/Pasep, Cofins, IPI, CIDE, IOF e outros. A DCTFWeb recebe as informações do eSocial, da EFD-Reinf e do MIT e é entregue até o último dia útil do mês seguinte.',
  },
  {
    id: 'reinf-quem', area: 'fiscal', conferidoEm: NOV, blocoBase: B.dctf, fontes: [F.reinf],
    perguntas: ['Quem é obrigado a enviar a EFD-Reinf?', 'Minha empresa precisa entregar a Reinf?', 'Retenção de IR e PIS Cofins CSLL vai na Reinf ou no eSocial?'],
    chaves: [['reinf']],
    resposta: 'Pela IN RFB 2.043/2021 (gov.br, serviço EFD-Reinf), são obrigados, mesmo imunes e isentos, entre outros: quem presta ou contrata serviços por cessão de mão de obra; pessoas jurídicas responsáveis pela retenção de PIS, Cofins e CSLL; optantes pela CPRB; produtor rural PJ, agroindústria e adquirentes de produção rural; associações desportivas e patrocinadores; e quem pagou ou creditou rendimentos com IRRF.\n\nRetenções ligadas ao trabalho (empregados) vão pelo eSocial, não pela Reinf. O prazo da Reinf em si eu preciso confirmar.',
  },
  {
    id: 'esocial-folha-prazo', area: 'dp', conferidoEm: NOV, blocoBase: B.dctf, fontes: [F.mos],
    perguntas: ['Até que dia tenho que enviar a folha S-1200 e o fechamento S-1299 no eSocial?', 'Qual o prazo do fechamento da folha no eSocial?', 'Prazo do S-1299'],
    chaves: [['s-1200', 's1200', 's-1299', 's1299', 'esocial'], ['prazo', 'fechamento', 'entregar', 'folha']],
    resposta: 'S-1200 (remuneração) e S-1299 (fechamento) vão até o dia 15 do mês seguinte ao período de apuração; se o dia 15 não for útil, prorroga para o primeiro dia útil seguinte (Manual de Orientação do eSocial S-1.3). O S-1200 deve ir antes do S-1299.\n\nO 13º (folha anual) vai entre 1º e 20 de dezembro. Os prazos do eSocial não mudam os prazos de pagamento de tributos e do FGTS.',
  },
  {
    id: 'esocial-13-prazo', area: 'dp', conferidoEm: NOV, blocoBase: B.dctf, fontes: [F.mos],
    perguntas: ['Qual o prazo para enviar a folha do 13º salário no eSocial?', 'Quando envio o S-1200 anual do décimo terceiro?', 'Fechamento da folha do 13º no eSocial'],
    chaves: [['decimoterceiro'], ['esocial', 's-1200', 's1200', 's-1299', 'fechamento']],
    resposta: 'A folha anual do 13º salário (S-1200 e S-1299 com apuração anual) é enviada entre 1º e 20 de dezembro (Manual de Orientação do eSocial S-1.3). O pagamento da 2ª parcela ao empregado também vence em 20 de dezembro (Lei 4.749/1965, art. 1º).',
  },
  {
    id: 'esocial-s1210', area: 'dp', conferidoEm: NOV, blocoBase: B.dctf, fontes: [F.mos],
    perguntas: ['Qual o prazo do S-1210 no eSocial?', 'O S-1210 segue regime de caixa ou competência?', 'Até quando envio o evento de pagamentos S-1210?'],
    chaves: [['s-1210', 's1210']],
    resposta: 'O S-1210 (pagamentos) vai até o dia 15 do mês seguinte ou até o fechamento da folha (S-1299), o que ocorrer primeiro, e segue o regime de caixa: entra no mês em que o pagamento foi feito (Manual de Orientação do eSocial S-1.3).',
  },
  {
    id: 'esocial-s2200', area: 'dp', conferidoEm: NOV, blocoBase: B.esocialNP, fontes: [F.mos],
    perguntas: ['Até quando tenho que enviar a admissão do empregado (S-2200) no eSocial?', 'Qual o prazo do S-2200?', 'Prazo do registro preliminar S-2190', 'Posso mandar a admissão no eSocial depois que o empregado começou?'],
    chaves: [['s-2200', 's2200', 's-2190', 's2190', 'admissao']],
    resposta: 'A admissão (S-2200) deve ser enviada até o dia imediatamente anterior ao início da prestação dos serviços; o registro preliminar (S-2190) também, até o final do dia imediatamente anterior ao início (Manual de Orientação do eSocial S-1.3).\n\nOu seja: o empregado não pode começar a trabalhar sem o evento já enviado. Enviar depois expõe a empresa a autuação.',
  },
  {
    id: 'esocial-s2299', area: 'dp', conferidoEm: NOV, blocoBase: B.esocialNP, fontes: [F.mos],
    perguntas: ['Qual o prazo para enviar o desligamento (S-2299) no eSocial?', 'Até quando mando o S-2299?', 'O prazo do S-2299 prorroga ou antecipa em feriado?'],
    chaves: [['s-2299', 's2299', 'desligamento esocial', 'esocial demissao']],
    resposta: 'O desligamento (S-2299) vai em até 10 dias contados da data do desligamento (exclui-se o dia do desligamento). Se o último dia cair em dia não útil, ANTECIPA para o dia útil anterior (Manual de Orientação do eSocial S-1.3).\n\nExceções: desligamento por transferência ou mudança de CPF e estatutários vão até o dia 15 do mês seguinte. Se o desligamento for entre os dias 1 e 4 do mês, a remuneração do mês anterior (S-1200) vai até o décimo dia seguinte ao desligamento.',
  },
  {
    id: 'esocial-alteracoes', area: 'dp', conferidoEm: NOV, blocoBase: B.esocialNP, fontes: [F.mos],
    perguntas: ['Qual o prazo do S-2205 e do S-2206 no eSocial?', 'Até quando informo alteração contratual no eSocial?', 'Prazo para alteração cadastral do empregado no eSocial'],
    chaves: [['s-2205', 's2205', 's-2206', 's2206', 'alteracao']],
    resposta: 'S-2205 (alteração cadastral) e S-2206 (alteração contratual) vão até o dia 15 do mês seguinte ao mês de referência/competência da alteração (Manual de Orientação do eSocial S-1.3).',
  },
  {
    id: 'esocial-s2230', area: 'dp', conferidoEm: NOV, blocoBase: B.esocialNP, fontes: [F.mos],
    perguntas: ['Qual o prazo do S-2230 para afastamento de até 15 dias?', 'Até quando informo atestado de poucos dias no eSocial?', 'Prazo do evento de afastamento temporário'],
    chaves: [['s-2230', 's2230', 'afastamento']],
    resposta: 'Para afastamento de até 15 dias, o S-2230 vai até o dia 15 do mês seguinte ao da ocorrência (Manual de Orientação do eSocial S-1.3). O prazo para afastamentos acima de 15 dias eu preciso confirmar no manual antes de orientar.',
  },
  {
    id: 'esocial-s2298', area: 'dp', conferidoEm: NOV, blocoBase: B.esocialNP, fontes: [F.mos],
    perguntas: ['Qual o prazo do S-2298 de reintegração no eSocial?', 'Até quando informo a reintegração do empregado?'],
    chaves: [['s-2298', 's2298', 'reintegracao']],
    resposta: 'O S-2298 (reintegração) vai até o dia 15 do mês seguinte ao da reintegração; se o dia não for útil, vai para o primeiro dia útil seguinte (Manual de Orientação do eSocial S-1.3).',
  },
  {
    id: 'dctfweb-assinatura', area: 'dp', aplicaA: SN_MEI, conferidoEm: NOV, blocoBase: B.dctf, fontes: [F.dctfweb],
    perguntas: ['MEI com empregado precisa de certificado digital para a DCTFWeb?', 'Posso transmitir a DCTFWeb com conta gov.br?', 'Simples com um empregado precisa de certificado para DCTFWeb?'],
    chaves: [['dctfweb'], ['certificado', 'gov', 'assinatura', 'assinar', 'prata', 'ouro']],
    resposta: 'Pelo gov.br (DCTFWeb), o MEI com empregado e o optante do Simples com até 1 empregado podem acessar com conta gov.br nível prata ou ouro; as demais empresas usam certificado digital.',
  },

  // ───────────────────────── FOLHA: INSS, IRRF, salário-família ─────────────────────────
  {
    id: 'inss-tabela-2026', area: 'dp', conferidoEm: OUT20, blocoBase: B.fgtsInss, fontes: [F.inss],
    perguntas: ['Qual a tabela do INSS de 2026 do empregado?', 'Quais as faixas de desconto do INSS em 2026?', 'Qual o teto do INSS em 2026?', 'Qual o desconto máximo de INSS do empregado?'],
    chaves: [['inss'], ['tabela', 'faixa', 'limite', 'desconto', 'aliquota', 'empregado']],
    resposta: 'Tabela do INSS 2026 para empregado, doméstico e avulso (Portaria Interministerial MPS/MF nº 13/2026; página oficial do INSS), progressiva — cada alíquota vale só para a parte do salário dentro da faixa:\n- até R$ 1.621,00: 7,5%\n- de R$ 1.621,01 a R$ 2.902,84: 9%\n- de R$ 2.902,85 a R$ 4.354,27: 12%\n- de R$ 4.354,28 a R$ 8.475,55: 14%\nTeto do salário de contribuição: R$ 8.475,55; desconto máximo do empregado: R$ 988,09.\n\nOs valores mudam todo ano por portaria; para outra competência, use a tabela daquele ano.',
  },
  {
    id: 'inss-contribuinte-individual', area: 'dp', conferidoEm: OUT21, blocoBase: B.fgtsInss, fontes: [F.inss],
    perguntas: ['Quanto o contribuinte individual paga de INSS em 2026?', 'Qual o INSS do autônomo e do facultativo?', 'Plano simplificado de 11% do INSS, quanto é?'],
    chaves: [['inss'], ['contribuinte individual', 'autonomo', 'facultativo', 'simplificado', '11', '20']],
    resposta: 'Pela página oficial do INSS (2026, base de R$ 1.621,00):\n- 5% (só facultativo de baixa renda e MEI): R$ 81,05;\n- 11% (só plano simplificado): R$ 178,31;\n- 20% entre o salário mínimo e o teto: de R$ 324,20 a R$ 1.695,11.\nCom vários vínculos, as remunerações se somam respeitando o teto de R$ 8.475,55.\n\nA empresa que contrata contribuinte individual deve descontar a contribuição dele e recolher junto com a dela (Lei 10.666/2003, art. 4º); o percentual dessa retenção eu preciso confirmar.',
  },
  {
    id: 'irrf-tabela-2026', area: 'dp', conferidoEm: OUT21, blocoBase: B.folha, fontes: [F.rfb2026],
    perguntas: ['Qual a tabela do IRRF mensal de 2026?', 'Quais as faixas do imposto de renda na folha em 2026?', 'Tabela progressiva do IR sobre salário 2026'],
    chaves: [['irrf'], ['tabela', 'faixa', 'aliquota', 'progressiva', '2026']],
    resposta: 'Tabela mensal do IRRF a partir de janeiro de 2026 (Lei 15.191/2025; Receita Federal, tabelas de 2026):\n- até R$ 2.428,80: isento\n- R$ 2.428,81 a R$ 2.826,65: 7,5% (deduzir R$ 182,16)\n- R$ 2.826,66 a R$ 3.751,05: 15% (deduzir R$ 394,16)\n- R$ 3.751,06 a R$ 4.664,68: 22,5% (deduzir R$ 675,49)\n- acima de R$ 4.664,68: 27,5% (deduzir R$ 908,73)\nDependente: R$ 189,59; desconto simplificado: até R$ 607,20.\n\nAtenção: desde janeiro de 2026 há também a redução da Lei 15.270/2025 (zera o imposto de quem ganha até R$ 5.000,00 e reduz até R$ 7.350,00).',
  },
  {
    id: 'irrf-reducao-15270', area: 'dp', conferidoEm: OUT21, blocoBase: B.folha, fontes: [F.rfb2026],
    perguntas: ['Como funciona a isenção do IR até 5 mil reais da Lei 15.270?', 'Quem ganha até R$ 5.000 paga imposto de renda em 2026?', 'Redução do IRRF entre 5 mil e 7.350'],
    chaves: [['irrf', '15_270', '15270', 'isencao', 'reducao'], ['5', '5_000', '7_350', '15_270', '15270', 'reducao']],
    resposta: 'Pela Lei 15.270/2025 (Receita Federal, tabelas de 2026), desde janeiro de 2026 há uma redução mensal do imposto:\n- rendimentos tributáveis de até R$ 5.000,00: redução de até R$ 312,89, de modo que o imposto fique zero;\n- de R$ 5.000,01 a R$ 7.350,00: redução de R$ 978,62 menos 0,133145 x rendimentos tributáveis do mês;\n- a partir de R$ 7.350,00: sem redução.\n\nA ordem exata do cálculo (antes ou depois das deduções) eu preciso confirmar no exemplo oficial da Receita antes de você parametrizar a folha.',
  },
  {
    id: 'salario-familia-2026', area: 'dp', conferidoEm: OUT21, blocoBase: B.folha, fontes: [F.salFamilia],
    perguntas: ['Qual o valor do salário-família em 2026?', 'Qual o limite de remuneração para ter salário-família?', 'Quem tem direito ao salário-família 2026?'],
    chaves: [['salariofamilia']],
    resposta: 'Em 2026, a cota do salário-família é de R$ 67,54 por dependente, para quem tem remuneração mensal de até R$ 1.980,38 (Portaria Interministerial MPS/MF nº 13/2026; página oficial do INSS). Acima desse limite não há direito.',
  },
  {
    id: 'salario-minimo-2026', area: 'dp', conferidoEm: OUT21, blocoBase: B.folha, fontes: [F.inss],
    perguntas: ['Qual o salário mínimo de 2026?', 'Qual o valor do salário mínimo nacional este ano?'],
    chaves: [['salariominimo']],
    resposta: 'O salário mínimo de 2026 é R$ 1.621,00 (é o valor usado pelo INSS como piso de contribuição em 2026, na tabela oficial). Atenção ao piso da convenção coletiva da categoria, que pode ser maior.',
  },

  // ───────────────────────── FGTS ─────────────────────────
  {
    id: 'fgts-aliquota', area: 'dp', conferidoEm: OUT21, blocoBase: B.folha, fontes: [F.lei8036, F.manualFgts],
    perguntas: ['Qual a alíquota do FGTS mensal?', 'Quanto é o FGTS do jovem aprendiz?', 'Qual o percentual de FGTS sobre o salário?'],
    chaves: [['fgts'], ['aliquota', 'quanto', 'aprendiz', '8', '2']],
    resposta: 'O FGTS mensal é de 8% da remuneração para a maioria dos empregados e de 2% para aprendiz (e contratos Verde e Amarelo) (Lei 8.036/1990, art. 15 e § 7º; Manual do FGTS Digital, item 5.1.4).',
  },
  {
    id: 'fgts-prazo-mensal', area: 'dp', conferidoEm: OUT21, blocoBase: B.folha, fontes: [F.fgtsPrazo, F.fgtsDigital, F.lei8036],
    perguntas: ['Qual o prazo para pagar o FGTS mensal?', 'O FGTS Digital vence em que dia?', 'Se o dia 20 do FGTS cair no sábado, antecipa ou prorroga?', 'Como pago a guia do FGTS Digital?'],
    chaves: [['fgts'], ['prazo', 'pagar', 'dia', 'guia', 'feriado', 'quando']],
    resposta: 'O FGTS mensal vence até o dia 20 do mês seguinte ao da remuneração (Lei 8.036/1990, art. 15, com redação da Lei 14.438/2022; MTE, FGTS Digital). Se o dia 20 não for dia útil, o prazo é ANTECIPADO (exemplo oficial: a competência 03/2024 venceu em 19/04/2024).\n\nA guia (GFD) é gerada no FGTS Digital e paga por Pix, pelo QR Code da guia. Emitir a guia antes não antecipa a obrigação de pagar.',
  },
  {
    id: 'fgts-rescisorio', area: 'dp', conferidoEm: OUT21, blocoBase: B.folha, fontes: [F.fgtsPrazo, F.manualFgts],
    perguntas: ['Qual o prazo para pagar o FGTS rescisório?', 'O FGTS da rescisão vence em quantos dias?', 'No pedido de demissão o FGTS é rescisório ou mensal?'],
    chaves: [['fgts'], ['rescisao', 'demissao']],
    resposta: 'O FGTS rescisório vence em até 10 dias do término do contrato (Lei 8.036, art. 18, § 3º, com o art. 477, § 6º, da CLT); se esse dia não for útil, o manual do FGTS Digital manda para o dia útil ANTERIOR.\n\nRescisório são as verbas devidas pela rescisão feita pelo empregador (saldo de salário, aviso prévio, 13º). No pedido de demissão, todas as verbas, inclusive as da rescisão, são do tipo mensal e vencem no dia 20 do mês seguinte (MTE, FGTS Digital).',
  },
  {
    id: 'fgts-multa-40', area: 'dp', exceto: ['atraso', 'prazo', 'pagar'], conferidoEm: OUT21, blocoBase: B.folha, fontes: [F.lei8036, F.clt],
    perguntas: ['Qual a multa do FGTS na demissão sem justa causa?', 'A multa de 40% é sobre o quê?', 'Quanto é a multa do FGTS no acordo do 484-A?'],
    chaves: [['fgts', 'multa'], ['multa', '40', 'semjustacausa', '484', 'acordo', 'demissao']],
    resposta: 'Na despedida sem justa causa, o empregador deposita 40% do montante de todos os depósitos feitos na conta vinculada do empregado durante o contrato (Lei 8.036/1990, art. 18, § 1º). No acordo do art. 484-A da CLT, essa indenização cai pela metade (20%) e o empregado saca até 80% do saldo.\n\nA guia rescisória é gerada no FGTS Digital e vence em até 10 dias do término do contrato.',
  },

  // ───────────────────────── FÉRIAS ─────────────────────────
  {
    id: 'ferias-faltas', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Quantos dias de férias o empregado tem de acordo com as faltas?', 'Faltas reduzem as férias?', 'Tabela de férias por faltas do artigo 130 da CLT'],
    chaves: [['feria'], ['falta', '130']],
    resposta: 'Pela CLT, art. 130, depende das faltas injustificadas no período aquisitivo: até 5 faltas = 30 dias; de 6 a 14 = 24 dias; de 15 a 23 = 18 dias; de 24 a 32 = 12 dias. É proibido descontar faltas das férias.',
  },
  {
    id: 'ferias-fracionamento', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Posso dividir as férias em quantos períodos?', 'Qual o mínimo de dias de cada período de férias fracionadas?', 'Férias em três vezes, como fica?'],
    chaves: [['feria'], ['fracionar', 'periodo', 'tres', '3', 'vezes', 'partes']],
    resposta: 'Com a concordância do empregado, as férias podem ser divididas em até 3 períodos: um deles com no mínimo 14 dias corridos e os outros com no mínimo 5 dias corridos cada (CLT, art. 134, § 1º). As férias devem ser concedidas nos 12 meses seguintes ao período aquisitivo.',
  },
  {
    id: 'ferias-pagamento', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Com quantos dias de antecedência tenho que pagar as férias?', 'Qual o prazo de pagamento das férias?', 'Férias pagas fora do prazo pagam em dobro?'],
    chaves: [['feria'], ['pagar', 'prazo', 'antecedencia', 'dobro']],
    resposta: 'As férias (e o abono, se houver) devem ser pagas até 2 dias antes do início (CLT, art. 145). E devem ser concedidas nos 12 meses seguintes ao período aquisitivo; concedidas fora desse prazo, são pagas em dobro (art. 137).',
  },
  {
    id: 'ferias-abono', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['O empregado pode vender 10 dias de férias?', 'Como funciona o abono pecuniário de férias?', 'Quanto das férias pode ser convertido em dinheiro?'],
    chaves: [['abonopecuniario', 'vender']],
    resposta: 'Sim. O empregado pode converter 1/3 das férias em abono pecuniário (CLT, art. 143) — nos 30 dias, são 10 dias. O abono é pago junto com as férias, até 2 dias antes do início (art. 145).',
  },
  {
    id: 'ferias-proporcionais', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Como calcular as férias proporcionais na rescisão?', 'Quem é demitido por justa causa recebe férias proporcionais?', 'Fração de 15 dias conta como mês nas férias proporcionais?'],
    chaves: [['feria'], ['proporcional', 'proporcionais']],
    resposta: 'Na rescisão (exceto por justa causa), as férias proporcionais são de 1/12 por mês de serviço ou fração superior a 14 dias (CLT, art. 146, parágrafo único). Na justa causa não há férias proporcionais; as férias vencidas continuam devidas.',
  },

  // ───────────────────────── 13º ─────────────────────────
  {
    id: '13-primeira-parcela', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.lei4749, F.esocial13],
    perguntas: ['Qual o prazo para pagar a primeira parcela do 13º salário?', 'Até quando pago o adiantamento do décimo terceiro?', 'Posso pagar a primeira parcela do 13º junto com as férias?'],
    chaves: [['decimoterceiro'], ['primeira', '1a', 'adiantamento']],
    resposta: 'A 1ª parcela (adiantamento) do 13º é paga entre fevereiro e novembro, no valor de metade do salário do mês anterior; o limite é 30 de novembro (Lei 4.749/1965, art. 2º; notícia oficial do eSocial). Ela pode ser paga junto com as férias se o empregado pedir em janeiro (art. 2º, § 2º).',
  },
  {
    id: '13-segunda-parcela', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.lei4749],
    perguntas: ['Até quando tenho que pagar a segunda parcela do 13º salário?', 'Qual o prazo da segunda parcela do décimo terceiro?'],
    chaves: [['decimoterceiro'], ['segunda', '2a', 'final', 'prazo']],
    resposta: 'A 2ª parcela do 13º é paga até 20 de dezembro, descontado o adiantamento (Lei 4.749/1965, art. 1º). No eSocial, a folha anual do 13º vai entre 1º e 20 de dezembro.',
  },
  {
    id: '13-rescisao-adiantamento', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.lei4749],
    perguntas: ['Empregado saiu depois de receber a primeira parcela do 13º, posso descontar?', 'Como compensar o adiantamento do 13º na rescisão?'],
    chaves: [['decimoterceiro'], ['rescisao', 'demissao', 'compensar', 'descontar']],
    resposta: 'Sim. Se o contrato terminar antes do pagamento final, o adiantamento do 13º pode ser compensado com o 13º devido na rescisão e, se não bastar, com outro crédito trabalhista do empregado (Lei 4.749/1965, art. 3º).',
  },

  // ───────────────────────── RESCISÃO E AVISO ─────────────────────────
  {
    id: 'rescisao-prazo', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Qual o prazo para pagar as verbas rescisórias?', 'Em quantos dias tenho que pagar a rescisão?', 'Qual o prazo para pagar as verbas rescisórias depois do fim do contrato?', 'Qual a multa por atrasar o pagamento da rescisão?', 'O prazo da rescisão muda se o aviso for trabalhado?'],
    chaves: [['rescisao']],
    resposta: 'A empresa tem até 10 dias, contados do término do contrato, para entregar os documentos e pagar as verbas rescisórias (CLT, art. 477, § 6º), seja o aviso trabalhado ou indenizado.\n\nRisco: atraso gera multa administrativa de 160 BTN por trabalhador e multa a favor do empregado equivalente ao salário dele (art. 477, § 8º), salvo se o empregado deu causa ao atraso. O FGTS rescisório e o S-2299 também vencem em 10 dias.',
  },
  {
    id: 'rescisao-acordo-484a', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Como funciona a demissão por acordo do artigo 484-A da CLT?', 'No acordo entre empregado e empresa, quanto o empregado saca do FGTS?', 'Acordo do 484-A dá seguro-desemprego?'],
    chaves: [['484', 'acordo', 'comum acordo']],
    resposta: 'No acordo do art. 484-A da CLT: o aviso prévio (se indenizado) e a indenização do FGTS são pagos pela metade (a multa de 40% vira 20%); as demais verbas são integrais; o empregado saca até 80% do FGTS; e não há seguro-desemprego.',
  },
  {
    id: 'aviso-previo-proporcional', area: 'dp', conferidoEm: OUT21, blocoBase: B.cltPrincipios, fontes: [F.lei12506, F.clt],
    perguntas: ['Como funciona o aviso prévio proporcional?', 'Qual o máximo de dias de aviso prévio?', 'Quantos dias de aviso prévio por ano trabalhado?'],
    chaves: [['avisoprevio'], ['proporcional', 'limite', 'ano', 'quantos', '90', 'maximo']],
    resposta: 'O aviso prévio é de 30 dias para quem tem até 1 ano na empresa; acrescentam-se 3 dias por ano de serviço, até 60 dias de acréscimo, no máximo 90 dias no total (Lei 12.506/2011). Exemplo: 5 anos de casa = 30 + 15 = 45 dias.\n\nComo contar ano incompleto e se a proporcionalidade vale no pedido de demissão não está na lei: eu preciso confirmar na jurisprudência do TST antes de afirmar.',
  },
  {
    id: 'aviso-reducao', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['No aviso prévio trabalhado o empregado tem redução de jornada?', 'Aviso trabalhado: 2 horas por dia ou 7 dias corridos?', 'Redução de 2 horas no aviso prévio trabalhado', 'Como funciona a redução do aviso prévio dado pela empresa?'],
    chaves: [['avisoprevio'], ['reducao', 'trabalhado', '2', '7', 'hora']],
    resposta: 'Quando o aviso é dado pelo empregador, a jornada é reduzida em 2 horas por dia sem desconto no salário, ou o empregado falta 7 dias corridos, à escolha dele (1 dia no caso do aviso de 8 dias) (CLT, art. 488).',
  },
  {
    id: 'justa-causa', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Quais são os motivos de demissão por justa causa?', 'Quais as hipóteses de justa causa do artigo 482?', 'O que dá justa causa na CLT?'],
    chaves: [['justacausa']],
    resposta: 'As hipóteses de justa causa estão no art. 482 da CLT: improbidade; incontinência de conduta ou mau procedimento; negociação habitual sem permissão; condenação criminal transitada em julgado; desídia; embriaguez habitual ou em serviço; violação de segredo da empresa; indisciplina ou insubordinação; abandono de emprego; ofensas à honra ou físicas; prática constante de jogos de azar; perda da habilitação por conduta dolosa.\n\nNa justa causa não há aviso prévio, férias proporcionais nem multa do FGTS. Guarde as provas do fato.',
  },

  // ───────────────────────── JORNADA E ADICIONAIS ─────────────────────────
  {
    id: 'hora-extra', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Qual o adicional mínimo da hora extra?', 'Quantas horas extras por dia são permitidas?', 'Hora extra é 50%?'],
    chaves: [['horaextra']],
    resposta: 'A jornada normal é de até 8 horas diárias (CLT, art. 58). São permitidas até 2 horas extras por dia, por acordo individual, convenção ou acordo coletivo, com adicional de no mínimo 50% (art. 59 e § 1º). A convenção da categoria pode prever percentual maior.\n\nAtenção: a EC 141/2026 muda a jornada constitucional para 40 horas semanais com transição; confira a regra de transição antes de fechar a escala.',
  },
  {
    id: 'banco-horas', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Como funciona o banco de horas na CLT?', 'Banco de horas por acordo individual vale por quanto tempo?', 'Prazo de compensação do banco de horas'],
    chaves: [['bancohoras']],
    resposta: 'Pela CLT, art. 59: banco de horas por acordo ou convenção coletiva compensa em até 1 ano, com limite de 10 horas por dia (§ 2º); por acordo individual escrito, a compensação é em até 6 meses (§ 5º).',
  },
  {
    id: 'escala-12x36', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Como funciona a escala 12x36?', 'A 12x36 pode ser por acordo individual?', 'Na 12x36 paga DSR e feriado à parte?'],
    chaves: [['12x36']],
    resposta: 'A escala 12x36 pode ser feita por acordo individual escrito, convenção ou acordo coletivo (CLT, art. 59-A). A remuneração mensal já abrange o descanso semanal remunerado e os feriados.',
  },
  {
    id: 'intervalo-intrajornada', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Qual o intervalo de almoço obrigatório?', 'Intervalo intrajornada não concedido, como paga?', 'Qual o intervalo para jornada de 6 horas?'],
    chaves: [['intervalo', 'almoco', 'intrajornada']],
    resposta: 'Pela CLT, art. 71: jornada acima de 6 horas exige intervalo de 1 a 2 horas; jornada de 4 a 6 horas, intervalo de 15 minutos. Se o intervalo não for concedido, paga-se só o tempo suprimido com adicional de 50%, com natureza indenizatória (§ 4º).\n\nEntre uma jornada e outra, o descanso mínimo é de 11 horas seguidas (art. 66).',
  },
  {
    id: 'interjornada', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Qual o intervalo mínimo entre duas jornadas de trabalho?', 'Quantas horas de descanso entre um dia e outro?', 'O que é intervalo interjornada?'],
    chaves: [['interjornada', 'entre', 'descanso']],
    resposta: 'O intervalo mínimo entre duas jornadas é de 11 horas consecutivas de descanso (CLT, art. 66).',
  },
  {
    id: 'adicional-noturno', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Qual o adicional noturno do trabalhador urbano e qual o horário noturno?', 'Hora noturna tem quantos minutos?', 'Adicional noturno é de quanto?'],
    chaves: [['noturno']],
    resposta: 'Para o trabalhador urbano, o trabalho noturno é das 22h às 5h, com adicional de no mínimo 20% e hora noturna reduzida de 52 minutos e 30 segundos (CLT, art. 73).',
  },
  {
    id: 'insalubridade', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Qual o percentual do adicional de insalubridade?', 'Insalubridade é calculada sobre o salário mínimo?', 'Graus de insalubridade 10, 20 e 40%'],
    chaves: [['insalubridade']],
    resposta: 'O adicional de insalubridade é de 40%, 20% ou 10% do salário mínimo, conforme o grau seja máximo, médio ou mínimo (CLT, art. 192). Não se acumula com a periculosidade: o empregado escolhe um (art. 193, § 2º).',
  },
  {
    id: 'periculosidade', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Qual o percentual do adicional de periculosidade?', 'Motoboy tem direito a periculosidade?', 'Periculosidade é sobre o salário-base?'],
    chaves: [['periculosidade']],
    resposta: 'O adicional de periculosidade é de 30% sobre o salário, sem gratificações, prêmios ou PLR (CLT, art. 193, § 1º). Inclui inflamáveis, explosivos, energia elétrica, segurança patrimonial ou pessoal e trabalho em motocicleta (§ 4º). Não se acumula com a insalubridade: o empregado escolhe (§ 2º).',
  },
  {
    id: 'tempo-parcial', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Como funciona o contrato de trabalho em tempo parcial?', 'Tempo parcial pode fazer hora extra?', 'Jornada máxima do regime de tempo parcial'],
    chaves: [['parcial']],
    resposta: 'Pela CLT, art. 58-A, o regime de tempo parcial é de até 30 horas semanais sem horas extras, ou de até 26 horas semanais com até 6 horas extras por semana, pagas com adicional de 50%.',
  },
  {
    id: 'exames-medicos', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Quais exames médicos são obrigatórios para o empregado?', 'Quem paga o exame admissional e demissional?', 'Exame periódico é obrigatório?'],
    chaves: [['exame', 'aso', 'admissional', 'demissional']],
    resposta: 'Os exames médicos são obrigatórios e pagos pelo empregador, na admissão, na demissão e periodicamente (CLT, art. 168).',
  },

  // ───────────────────────── CONTRATOS, FALTAS, LICENÇAS ─────────────────────────
  {
    id: 'experiencia', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Qual o prazo máximo do contrato de experiência?', 'Quantas vezes posso prorrogar o contrato de experiência?', 'Contrato de experiência de 45 mais 45 dias pode?'],
    chaves: [['experiencia']],
    resposta: 'O contrato de experiência tem no máximo 90 dias (CLT, art. 445, parágrafo único). Contrato por prazo determinado prorrogado mais de uma vez passa a ser por prazo indeterminado (art. 451) — por isso, 45 + 45 dias (uma prorrogação) é possível, mas uma segunda prorrogação não.',
  },
  {
    id: 'faltas-justificadas', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Quais faltas são justificadas pela CLT?', 'Quantos dias o empregado pode faltar por casamento ou falecimento?', 'Doação de sangue abona a falta?'],
    chaves: [['falta', 'faltar', 'abona', 'abonada', 'justificada'], ['justificada', 'casamento', 'falecimento', 'sangue', 'abona', 'abonada', 'pode', '473']],
    resposta: 'Pela CLT, art. 473, o empregado pode faltar sem desconto: até 2 dias por falecimento de cônjuge, ascendente, descendente, irmão ou dependente; até 3 dias por casamento; 5 dias por nascimento de filho, adoção ou guarda (em 2026; a partir de 2027 vale a Lei 15.371/2026); 1 dia por ano para doação de sangue; até 2 dias para alistamento eleitoral; dias de vestibular e de comparecimento a juízo; até 6 consultas da esposa/companheira na gravidez; 1 dia por ano para levar filho de até 6 anos ao médico; até 3 dias por ano para exames preventivos de câncer.',
  },
  {
    id: 'licenca-maternidade', area: 'dp', conferidoEm: NOV, blocoBase: B.clt, fontes: [F.clt],
    perguntas: ['Quantos dias tem a licença-maternidade?', 'Empregada que engravidou durante o aviso prévio tem estabilidade?', 'Gestante no aviso indenizado tem estabilidade?'],
    chaves: [['maternidade', 'gestante']],
    resposta: 'A licença-maternidade é de 120 dias, sem prejuízo do emprego e do salário (CLT, art. 392). A gravidez confirmada durante o aviso prévio, trabalhado ou indenizado, garante a estabilidade provisória da gestante (art. 391-A).',
  },
  {
    id: 'licenca-paternidade', area: 'dp', conferidoEm: NOV, blocoBase: B.paternidade, fontes: [F.lei15371, F.clt],
    perguntas: ['Quantos dias tem a licença-paternidade?', 'O que muda na licença-paternidade com a Lei 15.371/2026?', 'Licença-paternidade de 10 dias começa quando?'],
    chaves: [['paternidade']],
    resposta: 'Em 2026 continua a licença de 5 dias (CLT, art. 473, III). A Lei 15.371/2026 entra em vigor em 1º/1/2027: 10 dias em 2027, 15 dias a partir de 2028 e 20 dias a partir de 2029 (este último se cumprida a meta fiscal) (art. 11). Filho com deficiência: mais 1/3. Empresa Cidadã: mais 15 dias.\n\nA empresa paga o salário-paternidade e é reembolsada pela Previdência; o empregado de MEI recebe direto do INSS. O pai tem estabilidade do início da licença até 1 mês depois do fim (art. 4º).',
  },
  {
    id: 'estabilidade-pai', area: 'dp', conferidoEm: NOV, blocoBase: B.paternidade, fontes: [F.lei15371],
    perguntas: ['O pai tem estabilidade depois da licença-paternidade?', 'Posso demitir o empregado logo depois da licença-paternidade?'],
    chaves: [['paternidade', 'pai'], ['estabilidade', 'demitir', 'demissao']],
    resposta: 'Pela Lei 15.371/2026 (art. 4º, em vigor a partir de 1º/1/2027), é proibida a dispensa sem justa causa do pai entre o início da licença-paternidade e 1 mês após o término. Se a rescisão ocorrer depois da comunicação e antes da licença, impedindo o gozo, o período é indenizado em dobro.',
  },
  {
    id: 'plr', area: 'dp', conferidoEm: NOV, blocoBase: B.plr, fontes: [F.lei10101],
    perguntas: ['Quantas vezes por ano posso pagar PLR aos empregados?', 'Como deve ser negociada a PLR?', 'PLR tem encargos trabalhistas?', 'Como é tributado o IR da PLR?'],
    chaves: [['plr']],
    resposta: 'Pela Lei 10.101/2000: a PLR é negociada por comissão paritária com representante do sindicato ou por convenção/acordo coletivo, com regras claras e objetivas (art. 2º). Pode ser paga no máximo 2 vezes no mesmo ano civil, com intervalo mínimo de um trimestre civil (art. 3º, § 2º).\n\nNão é base de encargos trabalhistas nem do INSS (Lei 8.212, art. 28, § 9º, j). O IR é exclusivo na fonte, por tabela anual própria, separado dos outros rendimentos (art. 3º, § 5º). No Lucro Real, é despesa dedutível.',
  },
  {
    id: 'seguro-desemprego', area: 'dp', conferidoEm: NOV, blocoBase: B.plr, fontes: [F.seguroDes],
    perguntas: ['Quais os requisitos do seguro-desemprego?', 'Quanto tempo de trabalho precisa para pedir o seguro-desemprego?', 'Quem pede demissão tem seguro-desemprego?'],
    chaves: [['segurodesemprego']],
    resposta: 'Tem direito quem foi dispensado sem justa causa e não tem renda própria suficiente (gov.br, "Solicitar o Seguro-Desemprego"; Lei 7.998/1990). Tempo de trabalho exigido: na 1ª solicitação, 12 meses nos últimos 18; na 2ª, 9 meses nos últimos 12; nas demais, cada um dos 6 meses anteriores à dispensa.\n\nPedido de demissão, justa causa e acordo do art. 484-A não dão direito. Na dispensa sem justa causa, o empregador entrega o Requerimento do Seguro-Desemprego.',
  },
  {
    id: 'consignado', area: 'dp', conferidoEm: NOV, blocoBase: B.plr, fontes: [F.lei15179],
    perguntas: ['Quais as obrigações do empregador no consignado do Crédito do Trabalhador?', 'Desconto do consignado na rescisão é obrigatório?', 'Qual a multa por descontar o consignado e não repassar?'],
    chaves: [['consignado', 'credito do trabalhador', 'emprestimo']],
    resposta: 'Pela Lei 15.179/2025 (consignado "Crédito do Trabalhador"): o empregador desconta as prestações, inclusive nas verbas rescisórias, presta informações fiéis da folha e disponibiliza o termo de rescisão (art. 2º-A, § 2º, I). Na rescisão ou suspensão, a consignação é redirecionada automaticamente (art. 1º, § 9º).\n\nRisco: reter e não repassar gera multa administrativa de 30% do valor, Termo de Débito Salarial e pagamento atualizado com juros, além de sanções civis e penais (art. 3º). A margem consignável e o prazo do repasse eu preciso confirmar.',
  },

  // ───────────────────────── CONTÁBIL / OBRIGAÇÕES FEDERAIS ─────────────────────────
  {
    id: 'ecd-prazo', area: 'contabil', conferidoEm: NOV, blocoBase: B.federais, fontes: [F.ecd],
    perguntas: ['Qual o prazo de entrega da ECD?', 'Até quando transmito a Escrituração Contábil Digital?', 'ECD vence em que mês?'],
    chaves: [['ecd', 'escrituracao contabil digital']],
    resposta: 'A ECD é transmitida até o último dia útil de junho do ano seguinte (IN RFB 2.003/2021; gov.br, "Entregar a ECD"), pelas pessoas jurídicas obrigadas a manter escrituração contábil pela legislação comercial (inclusive equiparadas, imunes e isentas).\n\nQuem está dispensado (por exemplo, optante do Simples) eu preciso confirmar na IN antes de afirmar.',
  },
  {
    id: 'ecf-prazo', area: 'contabil', aplicaA: LP_LR, conferidoEm: NOV, blocoBase: B.federais, fontes: [F.ecf],
    perguntas: ['Qual o prazo de entrega da ECF?', 'Até quando transmito a Escrituração Contábil Fiscal?', 'ECF vence em que mês?'],
    chaves: [['ecf', 'escrituracao contabil fiscal']],
    resposta: 'A ECF é transmitida até o último dia útil de julho do ano seguinte, de forma centralizada pela matriz (IN RFB 2.004/2021; gov.br, "Entregar a ECF"). A lista de dispensados eu preciso confirmar na IN.',
  },
  {
    id: 'nbc-tg-1002-1001', area: 'contabil', conferidoEm: NOV, blocoBase: B.contabil, fontes: [F.cfcMpe],
    perguntas: ['Qual norma contábil usar para microempresa: NBC TG 1002 ou 1001?', 'Quais demonstrações a microentidade é obrigada a fazer?', 'A ITG 1000 ainda vale?', 'Qual a norma contábil para pequenas empresas?'],
    chaves: [['nbc', '1002', '1001', 'itg', 'microentidade', 'demonstraco', 'norma contabil']],
    resposta: 'Pelo CFC (normas em vigor desde exercícios iniciados em 1º/1/2023):\n- NBC TG 1002 (microentidades): receita bruta até R$ 4,8 milhões por ano. Demonstrações: balanço patrimonial, DRE e demonstração de lucros ou prejuízos acumulados (sem fluxo de caixa).\n- NBC TG 1001 (pequenas empresas): receita acima de R$ 4,8 milhões até R$ 78 milhões. Demonstrações: balanço, resultado, mutações do PL ou lucros/prejuízos acumulados, fluxos de caixa e notas explicativas.\n- NBC TG 1000 passou a valer só para médias empresas. A ITG 1000 foi anunciada como revogada (a resolução eu preciso confirmar).',
  },
  {
    id: 'demonstracoes-sem-movimento', area: 'contabil', conferidoEm: NOV, blocoBase: B.contabil, fontes: [F.cfcDiario],
    perguntas: ['Empresa sem movimento precisa fazer balanço?', 'Preciso fazer as demonstrações contábeis de empresa parada?', 'Livro Diário de empresa sem movimento'],
    chaves: [['semmovimento'], ['balanco', 'demonstracao', 'contabil', 'contabei', 'diario', 'livrodiario']],
    resposta: 'Sim. Pelo CFC (perguntas frequentes sobre o Livro Diário; ITG 2000), as demonstrações contábeis devem ser elaboradas mesmo sem movimento, e o Livro Diário registrado no órgão competente (com a ECD, a autenticação é feita pelo SPED). As demonstrações são transcritas no Diário e assinadas pelo profissional da contabilidade.',
  },
  {
    id: 'guarda-livros', area: 'contabil', conferidoEm: NOV, blocoBase: B.contabil, fontes: [F.cfcDiario],
    perguntas: ['Por quanto tempo tenho que guardar os livros contábeis?', 'Prazo de guarda da escrituração contábil', 'Posso descartar os livros contábeis antigos?'],
    chaves: [['guardar', 'guarda', 'descartar', 'conservar'], ['livro', 'escrituracao', 'contabil', 'livrodiario']],
    resposta: 'O Código Civil (art. 1.194) manda conservar a escrituração enquanto não houver prescrição ou decadência dos atos nela registrados; o CFC recomenda guarda permanente dos livros. Na escrituração digital (ECD), não se imprime nem encaderna.',
  },
  {
    id: 'ecd-autenticacao', area: 'contabil', conferidoEm: NOV, blocoBase: B.contabil, fontes: [F.cfcDiario],
    perguntas: ['O Livro Diário precisa ser autenticado na Junta Comercial?', 'Como é autenticado o Diário da ECD?', 'Posso substituir a ECD já autenticada?'],
    chaves: [['autenticacao', 'substituir'], ['diario', 'livrodiario', 'ecd', 'livro']],
    resposta: 'Com a ECD, a autenticação dos livros é feita pelo próprio SPED (Decreto 8.683/2016), sem passar pela Junta Comercial (CFC, perguntas frequentes; ITG 2000). A ECD autenticada só é substituída por erro que não possa ser corrigido por lançamento extemporâneo (ITG 2000, itens 31 a 36); erros de exercícios anteriores vão em "Ajustes de Exercícios Anteriores" (NBC TG 23).',
  },
  {
    id: 'dirbi', area: 'fiscal', conferidoEm: NOV, blocoBase: B.federais, fontes: [F.dirbi],
    perguntas: ['Qual o prazo de entrega da DIRBI?', 'Quem é obrigado a entregar a DIRBI?', 'Empresa do Simples entrega DIRBI?'],
    chaves: [['dirbi']],
    resposta: 'A DIRBI é entregue até o dia 20 do segundo mês seguinte ao período de apuração, de forma centralizada pela matriz (IN RFB 2.198/2024; página da Receita). É obrigada a pessoa jurídica que usufrui de incentivos, renúncias, benefícios ou imunidades tributárias.\n\nDispensados: ME/EPP do Simples Nacional (salvo as sujeitas à CPRB), MEI e PJ em início de atividade (até o mês anterior à inscrição no CNPJ).',
  },
  {
    id: 'cnd', area: 'fiscal', conferidoEm: NOV, blocoBase: B.federais, fontes: [F.certidao],
    perguntas: ['Qual a diferença entre CND e CPEND?', 'Por que não consigo emitir a certidão negativa federal?', 'Falta de declaração impede a certidão negativa?'],
    chaves: [['cnd', 'cpend', 'certidao']],
    resposta: 'A certidão federal é emitida em conjunto pela Receita e pela PGFN (Portaria Conjunta RFB/PGFN 1.751/2014; gov.br):\n- CND (negativa): sem pendências;\n- CPEND (positiva com efeitos de negativa): dívidas com exigibilidade suspensa ou garantidas (ex.: parceladas em dia);\n- CPD (positiva): dívidas em aberto ou declarações não entregues.\n\nSim: a falta de declaração também impede a CND. O que fazer: entregue as declarações que faltam e regularize ou parcele os débitos; parcelamento em dia permite a CPEND.',
  },

  // ───────────────────────── ICMS-GO / ISS GOIÂNIA ─────────────────────────
  {
    id: 'icms-go-aliquota', area: 'fiscal', conferidoEm: NOV, blocoBase: B.icmsIss, fontes: [F.lei22460],
    perguntas: ['Qual a alíquota interna geral do ICMS em Goiás?', 'O ICMS de Goiás é 19%?', 'Desde quando o ICMS em Goiás é 19%?'],
    chaves: [['icms'], ['goias', '19', 'interna']],
    resposta: 'A alíquota interna geral do ICMS em Goiás é de 19% (Código Tributário do Estado, Lei 11.651/1991, art. 27, I, na redação da Lei 22.460/2023), com efeitos desde 1º/4/2024, salvo as exceções dos incisos II, III, VII e IX do art. 27. As alíquotas diferenciadas e os benefícios fiscais eu preciso confirmar para o produto.',
  },
  {
    id: 'icms-go-prazo', area: 'fiscal', conferidoEm: NOV, blocoBase: B.icmsSt, fontes: [F.calIcms],
    perguntas: ['Qual o prazo de recolhimento do ICMS próprio em Goiás?', 'Até que dia pago o ICMS em Goiás?', 'ICMS de Goiás vencendo em feriado, quando pago?'],
    chaves: [['icms'], ['goias'], ['prazo', 'pagar', 'feriado', 'quando']],
    resposta: 'Pelo calendário oficial da Secretaria da Economia de Goiás (IN 155/94-GSF consolidada): o ICMS próprio (comércio, serviços, indústria) é pago até o 20º dia após o fim do período de apuração. Se o vencimento cair em dia não útil, paga-se sem acréscimos no primeiro dia útil seguinte (RCTE, art. 75, § 3º).',
  },
  {
    id: 'icms-st-go-prazos', area: 'fiscal', conferidoEm: NOV, blocoBase: B.icmsSt, fontes: [F.calIcms],
    perguntas: ['Qual o prazo de recolhimento do ICMS-ST em Goiás?', 'Substituto tributário do Simples em Goiás paga o ICMS-ST quando?', 'Prazo do complemento de ICMS-ST do Simples em Goiás'],
    chaves: [['icmsst'], ['goias', 'prazo', 'pagar']],
    resposta: 'Pelo calendário da SEFAZ-GO (IN 155/94-GSF): substituto inscrito no CCE-GO do regime normal paga até o dia 9 do mês seguinte à saída; remetente do Simples, até o dia 2 do segundo mês seguinte; cimento, dia 10 do mês seguinte; substituto não inscrito, no momento da saída. Complemento de ICMS-ST do optante do Simples: até o dia 10 do segundo mês seguinte à saída.\n\nA lista de mercadorias com ST e a MVA eu preciso confirmar no Anexo VIII do RCTE.',
  },
  {
    id: 'difal-simples-go', area: 'fiscal', conferidoEm: NOV, blocoBase: B.icmsSt, fontes: [F.calIcms, F.difalGo],
    perguntas: ['Empresa do Simples em Goiás paga DIFAL na compra de outro estado?', 'Qual o prazo do DIFAL do Simples em Goiás?', 'Qual o código do DARE do DIFAL do Simples em Goiás?'],
    chaves: [['difal'], ['simples', 'goias', 'optante', 'prazo', 'dare', 'codigo']],
    resposta: 'Sim. O optante do Simples em Goiás paga DIFAL na aquisição interestadual para comercialização ou produção rural, inclusive o MEI (manual da SEFAZ-GO; LC 123, art. 13, § 1º, XIII, h). Não se aplica a mercadoria com ST/antecipação nem a matéria-prima para indústria optante (isenta).\n\nApuração por operação, somada no mês, paga em DARE 5.1 separado, código 4502, até o dia 10 do segundo mês seguinte ao período de apuração (calendário oficial).\n\nAtenção: o manual é de 2018 e usa coeficientes da alíquota antiga; os coeficientes com a alíquota de 19% precisam ser reconferidos.',
  },
  {
    id: 'iss-goiania-sgiss', area: 'fiscal', conferidoEm: NOV, blocoBase: B.icmsIss, fontes: [F.sgiss],
    perguntas: ['Como emitir NFS-e em Goiânia no SGISS?', 'Goiânia ainda tem emissor próprio de nota de serviço?', 'Prazo para cancelar NFS-e em Goiânia'],
    chaves: [['nfse', 'sgiss', 'iss'], ['goiania', 'sgiss']],
    resposta: 'Goiânia usa o SGISS desde 1º/10/2025 (Decreto municipal 2.824/2025). A Prefeitura deixou de ter emissor próprio: a NFS-e é emitida em emissor de mercado no padrão ABRASF 2.04, com envio dos XML ao SGISS. Cancelar ou substituir a nota: até o 5º dia do mês seguinte à emissão.\n\nCompetência: encerramento espontâneo até o dia 5 de cada mês; a guia (DUAM) pode ser gerada a qualquer momento (FAQ oficial do SGISS).',
  },
  {
    id: 'iss-goiania-retencao', area: 'fiscal', conferidoEm: NOV, blocoBase: B.icmsIss, fontes: [F.sgiss],
    perguntas: ['Qual o prazo para declarar o ISS retido em Goiânia?', 'Como funciona a REST no SGISS?', 'Tomador em Goiânia, até quando declaro as notas com ISS retido?'],
    chaves: [['iss', 'rest'], ['goiania', 'sgiss', 'rest']],
    resposta: 'O tomador declara as notas com ISS retido (REST) até o 5º dia do mês seguinte ao fato gerador; se não declarar, o SGISS apura e gera a guia (FAQ oficial do SGISS da Prefeitura de Goiânia). O dia de vencimento do pagamento e as alíquotas por item eu preciso confirmar no Código Tributário Municipal.',
  },
  {
    id: 'abertura-empresa-go', area: 'societario', conferidoEm: NOV, blocoBase: B.juceg, fontes: [F.juceg],
    perguntas: ['Qual o passo a passo para abrir uma LTDA em Goiás?', 'Como abrir empresa na JUCEG?', 'Quais as etapas de abertura de empresa em Goiânia?'],
    chaves: [['aberturaempresa', 'juceg', 'abertura', 'abrir']],
    resposta: 'Passo a passo oficial da JUCEG (LTDA, processo digital):\n1. Viabilidade no Portal do Empreendedor Goiano (com conta gov.br): gera o protocolo GOP.\n2. Depois da aprovação, DBE da Receita Federal com o GOP.\n3. Acompanhar pelo GOP.\n4. FCN (Ficha de Cadastro Nacional).\n5. Gerar e pagar as taxas.\n6. Contrato social (Contrato Eletrônico).\n7. Anexar contrato e documentos e só então assinar digitalmente.\n8. Protocolar depois da assinatura de todos os sócios.\n9. Deferido, seguir nos demais órgãos da REDESIM (Prefeitura, Bombeiros, Vigilância Sanitária).\n\nAtenção: a página da JUCEG é de 2019 e há manuais de 2026; confira o manual mais recente e as taxas antes de protocolar.',
  },

  // ───────────────────────── REFORMA TRIBUTÁRIA (IBS/CBS/IS) ─────────────────────────
  {
    id: 'rt-o-que-e', area: 'fiscal', conferidoEm: NOV, blocoBase: B.reforma, fontes: [F.lc214, F.ec132],
    perguntas: ['O que são o IBS e a CBS da reforma tributária?', 'Me explica a reforma tributária do consumo de forma simples', 'Quais tributos a reforma tributária substitui?', 'O que é o IVA dual?'],
    chaves: [['ibs', 'cbs', 'reforma', 'iva']],
    resposta: 'Explicando do zero: a reforma troca, aos poucos, cinco tributos sobre o consumo (PIS, Cofins, IPI, ICMS e ISS) por três (EC 132/2023; LC 214/2025):\n- CBS: federal, no lugar de PIS e Cofins;\n- IBS: de Estados e Municípios, no lugar de ICMS e ISS;\n- Imposto Seletivo (IS): federal, sobre o que faz mal à saúde ou ao meio ambiente.\n\nIBS e CBS funcionam como um IVA ("IVA dual"): cada empresa paga sobre o que vende e desconta como crédito o que foi pago nas compras (não cumulatividade, LC 214, art. 47). Incidem sobre operações onerosas com bens e serviços (art. 4º), são calculados "por fora" (não entram na própria base, art. 12, § 2º, I) e ficam com o local de destino/consumo (art. 11).\n\nCronograma: 2026 é o ano-teste (0,9% de CBS e 0,1% de IBS, compensáveis); 2027 começam CBS e IS e acabam PIS e Cofins; de 2029 a 2032 ICMS e ISS diminuem; em 2033 ICMS e ISS acabam.',
  },
  {
    id: 'rt-2026-ano-teste', area: 'fiscal', conferidoEm: NOV, blocoBase: B.reforma, fontes: [F.lc214, F.ec132],
    perguntas: ['Em 2026 tem que pagar IBS e CBS?', 'Como funciona o ano-teste de 2026 da reforma tributária?', 'As alíquotas de 0,9% de CBS e 0,1% de IBS são pagas em 2026?', 'IBS e CBS de 2026 são compensados com PIS e Cofins?'],
    chaves: [['ibs', 'cbs', 'reforma'], ['2026', 'teste', '0,9', '0,1', 'compensado', 'compensacao']],
    resposta: 'Em 2026, a LC 214/2025 fixa IBS de 0,1% (art. 343) e CBS de 0,9% (art. 346). Mas:\n- fica DISPENSADO o recolhimento para quem cumprir as obrigações acessórias, ou seja, emitir os documentos fiscais com as informações exigidas (art. 348, § 1º);\n- se houver recolhimento, ele é compensado com PIS/Cofins (e, sem débito suficiente, com outro tributo federal ou ressarcido em até 60 dias) (art. 348, I e II; ADCT, art. 125);\n- PIS e Cofins continuam devidos integralmente em 2026 (art. 348, § 2º);\n- as alíquotas de 2026 não se aplicam aos optantes do Simples Nacional (art. 348, III, "c").\nAuto de infração por falta de obrigação acessória em 2026: o contribuinte é intimado a regularizar em 60 dias e, se atender, a penalidade é extinta (art. 348, §§ 3º e 4º, LC 227/2026).\n\nO que fazer agora: preparar o emissor e preencher os campos de IBS/CBS nas notas.',
  },
  {
    id: 'rt-cronograma', area: 'fiscal', conferidoEm: NOV, blocoBase: B.reforma, fontes: [F.ec132, F.lc214],
    perguntas: ['Qual o cronograma da reforma tributária de 2026 a 2033?', 'Quando acabam o PIS e a Cofins?', 'Quando o ICMS e o ISS acabam?', 'Em que ano o ICMS e o ISS são extintos?', 'Como é a transição do ICMS e ISS para o IBS?'],
    chaves: [['ibs', 'cbs', 'reforma', 'icms', 'iss', 'pis', 'cofins'], ['cronograma', 'transicao', 'acabam', 'acaba', 'extinto', 'extincao', '2027', '2029', '2033', 'quando']],
    resposta: 'Cronograma (EC 132/2023, ADCT arts. 125 a 129; LC 214/2025):\n- 2026: ano-teste, IBS 0,1% e CBS 0,9%, compensáveis e com dispensa para quem cumpre as obrigações acessórias (LC 214, arts. 343, 346 e 348).\n- 2027 e 2028: começam a CBS e o Imposto Seletivo; PIS e Cofins são extintos (LC 214, art. 542, a partir de 1º/1/2027); IPI com alíquota zero (salvo Zona Franca de Manaus); IBS de 0,05% estadual + 0,05% municipal e CBS reduzida em 0,1 ponto percentual (ADCT, art. 127; LC 214, arts. 344 e 347).\n- 2029 a 2032: ICMS e ISS cobrados a 9/10, 8/10, 7/10 e 6/10 das alíquotas atuais, com benefícios fiscais reduzidos na mesma proporção (ADCT, art. 128), e o IBS aumentando.\n- 2033: ICMS e ISS extintos (ADCT, art. 129).',
  },
  {
    id: 'rt-simples', area: 'fiscal', aplicaA: SN_MEI, conferidoEm: NOV, blocoBase: B.reforma, fontes: [F.lc214],
    perguntas: ['Como fica o Simples Nacional na reforma tributária?', 'Empresa do Simples pode recolher IBS e CBS por fora do DAS?', 'Cliente que compra de empresa do Simples aproveita crédito de IBS e CBS?', 'Quando o optante do Simples faz a opção pelo regime regular do IBS e CBS?'],
    chaves: [['ibs', 'cbs', 'reforma', 'regime regular'], ['simples', 'optante', 'mei', 'DAS']],
    resposta: 'O Simples continua. O optante recolhe IBS e CBS dentro do DAS (LC 214, art. 41, § 2º), mas pode escolher o regime regular do IBS/CBS (por fora do DAS) — LC 123, art. 13, §§ 9º a 11, na redação dada pela LC 214/2025 e pela LC 227/2026, com efeitos a partir de 1º/1/2027:\n- a opção vale por semestre (janeiro e julho) e é irretratável no semestre;\n- é feita em setembro (para o semestre de janeiro) e em março (para o de julho), na forma do CGSN.\n\nCrédito para o cliente: a empresa do regime regular que compra de optante que recolhe pelo DAS se credita do IBS/CBS no montante equivalente ao cobrado no Simples (LC 123, art. 23, § 1º-A; LC 214, art. 47, § 9º). Se o optante for para o regime regular, gera o crédito cheio destacado na nota.\n\nComo decidir: vale simular quando o cliente vende muito para empresas (que querem crédito maior). Em 2026, as alíquotas de teste não se aplicam ao Simples (LC 214, art. 348, III, "c").',
  },
  {
    id: 'rt-credito', area: 'fiscal', conferidoEm: NOV, blocoBase: B.reforma, fontes: [F.lc214],
    perguntas: ['Como funciona o crédito de IBS e CBS?', 'O que é a não cumulatividade do IBS e da CBS?', 'Quando posso tomar crédito de IBS e CBS na compra?', 'Compra para uso pessoal dá crédito de IBS e CBS?'],
    chaves: [['ibs', 'cbs'], ['credito', 'cumulatividade', 'creditar']],
    resposta: 'Pela LC 214/2025, arts. 47 a 57: a empresa do regime regular se credita do IBS/CBS das compras quando o débito do fornecedor foi extinto — pago, compensado, recolhido no split payment ou pelo próprio adquirente (art. 47). Precisa de documento fiscal eletrônico idôneo com o destaque correto (art. 47, § 1º; art. 48, parágrafo único). Créditos de IBS e de CBS são separados e não se compensam entre si.\n\nNão dá crédito: uso ou consumo pessoal, inclusive o que é fornecido a sócios e empregados fora das exceções (art. 57), e compras imunes, isentas ou com alíquota zero, salvo crédito presumido (art. 49). O crédito vence em 5 anos (art. 54) e não pode ser transferido, salvo fusão, cisão ou incorporação (art. 55).',
  },
  {
    id: 'rt-split-payment', area: 'fiscal', conferidoEm: NOV, blocoBase: B.reforma, fontes: [F.lc214],
    perguntas: ['O que é o split payment da reforma tributária?', 'Como funciona o pagamento dividido do IBS e da CBS?', 'Split payment simplificado dá crédito?'],
    chaves: [['split', 'pagamento dividido', 'segregacao']],
    resposta: 'Split payment é o recolhimento automático do IBS/CBS no pagamento (LC 214/2025, arts. 31 a 35): quando o cliente paga por meio eletrônico (cartão, Pix, boleto etc.), o prestador de pagamento separa o imposto e recolhe na liquidação financeira; a empresa recebe o valor líquido.\n- Padrão (art. 32): o sistema da Receita/Comitê Gestor informa quanto ainda falta recolher daquela nota.\n- Simplificado (art. 33): percentual fixo sobre o valor, opcional; não gera crédito ao comprador contribuinte e o excedente volta ao fornecedor em até 3 dias úteis.\n- Se o meio de pagamento não permitir separar, o comprador do regime regular pode recolher ele mesmo (art. 36).\nA implantação é gradual; a data de início eu preciso confirmar.',
  },
  {
    id: 'rt-reducoes', area: 'fiscal', conferidoEm: NOV, blocoBase: B.reforma, fontes: [F.lc214],
    perguntas: ['Quais setores têm redução de 60% no IBS e CBS?', 'Quem tem redução de 30% na reforma tributária?', 'Contador tem redução de alíquota no IBS e CBS?', 'Cesta básica tem alíquota zero de IBS e CBS?'],
    chaves: [['ibs', 'cbs', 'reforma', 'cesta'], ['reducao', 'reduzida', '60', '30', 'zero', 'cesta', 'diferenciado']],
    resposta: 'Pela LC 214/2025:\n- Alíquota zero: Cesta Básica Nacional de Alimentos (art. 125, Anexo I).\n- Redução de 30%: serviços de profissões intelectuais regulamentadas, entre elas contabilistas, advogados, administradores, arquitetos, economistas, engenheiros e outras (art. 127), com requisitos para a PJ (sócios habilitados, sem sócio pessoa jurídica, serviços prestados pelos sócios).\n- Redução de 60% (art. 128): educação, saúde, dispositivos médicos e de acessibilidade, medicamentos, alimentos destinados ao consumo humano, higiene pessoal e limpeza de baixa renda, produtos agropecuários in natura, insumos agropecuários, produções artísticas e culturais, comunicação institucional, atividades desportivas e segurança nacional/cibernética — sempre conforme as listas dos anexos.\n\nO enquadramento de cada produto depende do NCM/NBS nos anexos: confira o item antes de aplicar a redução.',
  },
  {
    id: 'rt-cashback', area: 'fiscal', conferidoEm: NOV, blocoBase: B.reforma, fontes: [F.lc214],
    perguntas: ['Como funciona o cashback da reforma tributária?', 'Quem tem direito à devolução de IBS e CBS?', 'Quando começa o cashback do IBS e da CBS?', 'Quanto da CBS é devolvido no cashback da conta de luz?'],
    chaves: [['cashback', 'devolucao']],
    resposta: 'É a devolução personalizada (LC 214/2025, arts. 112 a 124), para famílias do CadÚnico com renda per capita de até meio salário mínimo, residentes no País e com CPF regular (art. 113).\n- 100% da CBS e 20% do IBS no gás de botijão até 13 kg, energia elétrica, água, esgoto, gás canalizado e telecomunicações;\n- 20% da CBS e 20% do IBS nos demais casos (art. 118); Estados e Municípios podem aumentar o percentual do IBS.\nComeça sobre o consumo de janeiro de 2027 (CBS) e de janeiro de 2029 (IBS) (art. 123). Por isso é importante a nota com CPF do consumidor (art. 117).',
  },
  {
    id: 'rt-destino', area: 'fiscal', conferidoEm: NOV, blocoBase: B.reforma, fontes: [F.lc214],
    perguntas: ['O IBS é cobrado no destino ou na origem?', 'Qual o local da operação do IBS e CBS?', 'Para qual município vai o IBS de um serviço?'],
    chaves: [['ibs', 'cbs'], ['destino', 'origem', 'local', 'municipio']],
    resposta: 'No destino. Pela LC 214/2025, art. 11: bem móvel, no local da entrega; imóvel e serviços sobre imóvel, onde o imóvel está; serviço prestado presencialmente, onde é prestado; transporte de passageiros, no início; carga, no local da entrega; demais serviços e bens imateriais, no domicílio principal do adquirente (inciso X, redação da LC 227/2026). A alíquota do IBS é a soma da estadual com a municipal do destino (art. 15).',
  },
  {
    id: 'rt-imposto-seletivo', area: 'fiscal', conferidoEm: NOV, blocoBase: B.reforma, fontes: [F.ec132, F.lc214],
    perguntas: ['O que é o Imposto Seletivo?', 'Sobre quais produtos incide o Imposto Seletivo?', 'Quando começa o Imposto Seletivo?'],
    chaves: [['seletivo']],
    resposta: 'O Imposto Seletivo (IS) é federal e incide sobre produção, extração, comercialização ou importação de bens e serviços prejudiciais à saúde ou ao meio ambiente (CF, art. 153, VIII; LC 214/2025, art. 409). A lei lista veículos, embarcações e aeronaves, produtos fumígenos, bebidas alcoólicas, bebidas açucaradas, bens minerais e concursos de prognósticos (art. 409, § 1º).\n\nNão incide sobre exportações, energia elétrica e telecomunicações; é cobrado uma única vez; na extração, alíquota máxima de 1% do valor de mercado. Começa a ser cobrado em 2027 (ADCT, art. 126).',
  },
  {
    id: 'rt-base-calculo', area: 'fiscal', conferidoEm: NOV, blocoBase: B.reforma, fontes: [F.lc214, F.ec132],
    perguntas: ['O IBS e a CBS são calculados por dentro ou por fora?', 'O ICMS entra na base de cálculo do IBS e da CBS?', 'O que compõe a base de cálculo do IBS e da CBS?'],
    chaves: [['ibs', 'cbs'], ['base', 'por fora', 'por dentro', 'calculo']],
    resposta: 'Por fora. Pela LC 214/2025, art. 12, a base é o valor total cobrado (com acréscimos, juros, multas, descontos condicionados, frete, seguros e taxas), mas NÃO entram: o próprio IBS e a CBS, o IPI, os descontos incondicionais, reembolsos por conta e ordem e, de 2026 a 2032, o ICMS, o ISS e o PIS/Cofins (art. 12, § 2º). A Constituição também diz que o IBS não integra a própria base (art. 156-A, § 1º, IX).',
  },
  {
    id: 'rt-notas-fiscais', area: 'fiscal', conferidoEm: NOV, blocoBase: B.reforma, fontes: [F.ntNfse, F.lc214],
    perguntas: ['Quais campos de IBS e CBS a nota fiscal de serviço precisa ter?', 'O grupo IBSCBS da NFS-e é obrigatório em 2026?', 'O que é cClassTrib na nota fiscal?'],
    chaves: [['ibscbs', 'cclasstrib', 'nfse', 'nota'], ['ibs', 'cbs', 'ibscbs', 'cclasstrib']],
    resposta: 'Na NFS-e Nacional, a Nota Técnica SE/CGNFS-e 004 (10/12/2025) criou o grupo IBSCBS, com campos como CST (situação tributária do IBS/CBS) e cClassTrib (classificação tributária), dados do destinatário, valores e diferimento; ficou em produção desde 5/1/2026. Pela NT 004, o preenchimento NÃO era obrigatório em 2026 (as regras foram suspensas "temporariamente"), mas se o grupo for informado é validado.\n\nPor que preencher mesmo assim: a dispensa do recolhimento de 2026 é para quem cumpre as obrigações acessórias (LC 214, art. 348, § 1º). Confira a versão mais recente da NT antes de configurar o emissor. Os campos da NF-e/NFC-e (NT 2025.002) eu preciso confirmar.',
  },
  {
    id: 'rt-o-que-fazer-2026', area: 'fiscal', conferidoEm: NOV, blocoBase: B.reforma, fontes: [F.lc214, F.ntNfse],
    perguntas: ['O que o contador deve fazer agora em 2026 por causa da reforma tributária?', 'Como preparar os clientes para a reforma tributária?', 'Checklist da reforma tributária para o escritório'],
    chaves: [['reforma', 'ibs', 'cbs'], ['fazer', 'preparar', 'checklist', 'contador', 'escritorio', 'agora']],
    resposta: 'Com base na LC 214/2025:\n1. Notas fiscais: deixar o emissor pronto para os campos de IBS/CBS (CST e cClassTrib) e cumprir as obrigações acessórias — é isso que dispensa o recolhimento de 2026 (art. 348, § 1º).\n2. Continuar apurando e pagando PIS/Cofins, ICMS e ISS normalmente em 2026 (art. 348, § 2º).\n3. Clientes do Simples que vendem para empresas: simular a opção pelo regime regular do IBS/CBS, feita por semestre, em setembro (semestre de janeiro) ou março (semestre de julho) (LC 123, art. 13, §§ 9º a 11, efeitos a partir de 2027).\n4. Revisar o cadastro de produtos e serviços (NCM/NBS) para achar cesta básica (alíquota zero), reduções de 30% e 60% e itens do Imposto Seletivo (arts. 125 a 128 e 409).\n5. Revisar preços e contratos: IBS/CBS são por fora (art. 12) e o crédito do cliente depende de o imposto ter sido pago (art. 47).\n6. Orientar o varejo a pedir o CPF na nota (cashback, art. 117).',
  },
];
