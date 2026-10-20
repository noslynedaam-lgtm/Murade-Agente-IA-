/**
 * Calculadoras Fiscais e Trabalhistas Oficiais Brasileiras
 * Murade Agente IA
 */

export interface FatorRResult {
  fatorR: number; // e.g. 0.285
  fatorRPercent: string; // "28.50%"
  anexo: 'Anexo III' | 'Anexo V';
  aliquotaEstimadaNominal: number;
  aliquotaEfetivaAprox: number;
  simulacaoMensal: {
    faturamentoMensal: number;
    impostoAnexoIII: number;
    impostoAnexoV: number;
    economiaMensal: number;
    economiaAnual: number;
  };
  sugestaoProLaboreMinimo: number;
}

export function calcularFatorR(rbt12: number, folha12: number, faturamentoMensal: number = 25000): FatorRResult {
  const safeRBT = Math.max(rbt12, 1);
  const fatorR = folha12 / safeRBT;
  const fatorRPercent = (fatorR * 100).toFixed(2) + '%';
  const qualifiesAnexoIII = fatorR >= 0.28;

  // Approximate effective tax brackets for Simples Nacional
  let aliquotaIII = 0.06;
  if (rbt12 > 180000 && rbt12 <= 360000) aliquotaIII = 0.0821;
  else if (rbt12 > 360000 && rbt12 <= 720000) aliquotaIII = 0.1026;
  else if (rbt12 > 720000 && rbt12 <= 1800000) aliquotaIII = 0.133;
  else if (rbt12 > 1800000) aliquotaIII = 0.165;

  let aliquotaV = 0.155;
  if (rbt12 > 180000 && rbt12 <= 360000) aliquotaV = 0.18;
  else if (rbt12 > 360000 && rbt12 <= 720000) aliquotaV = 0.195;
  else if (rbt12 > 720000 && rbt12 <= 1800000) aliquotaV = 0.205;
  else if (rbt12 > 1800000) aliquotaV = 0.23;

  const impostoIII = faturamentoMensal * aliquotaIII;
  const impostoV = faturamentoMensal * aliquotaV;
  const economiaMensal = Math.max(0, impostoV - impostoIII);

  // Folha mínima mensal necessária para atingir 28% no próximo ano (supondo faturamento estável)
  const sugestaoProLaboreMinimo = (faturamentoMensal * 12 * 0.28) / 12;

  return {
    fatorR,
    fatorRPercent,
    anexo: qualifiesAnexoIII ? 'Anexo III' : 'Anexo V',
    aliquotaEstimadaNominal: qualifiesAnexoIII ? 6.0 : 15.5,
    aliquotaEfetivaAprox: (qualifiesAnexoIII ? aliquotaIII : aliquotaV) * 100,
    simulacaoMensal: {
      faturamentoMensal,
      impostoAnexoIII: impostoIII,
      impostoAnexoV: impostoV,
      economiaMensal,
      economiaAnual: economiaMensal * 12,
    },
    sugestaoProLaboreMinimo,
  };
}

export interface RescisaoInput {
  salarioBase: number;
  dataAdmissao: string;
  dataDesligamento: string;
  motivo: 'sem_justa_causa' | 'pedido_demissao' | 'acordo_484a' | 'justa_causa';
  avisoPrevio: 'indenizado' | 'trabalhado' | 'dispensado';
  temFeriasVencidas: boolean;
  saldoFgtsEstimado: number;
}

export interface RescisaoResult {
  diasTrabalhadosMes: number;
  anosCompletos: number;
  diasAvisoPrevioLei12506: number;
  saldoSalario: number;
  avisoPrevioValor: number;
  decimoTerceiroProporcional: number;
  feriasProporcionais: number;
  tercoFeriasProporcionais: number;
  feriasVencidasValor: number;
  tercoFeriasVencidas: number;
  multaFgtsValor: number;
  totalBruto: number;
  inssEstimado: number;
  totalLiquidoAprox: number;
  prazoPagamentoTexto: string;
}

export function calcularRescisaoCLT(input: RescisaoInput): RescisaoResult {
  const dtAdm = new Date(input.dataAdmissao);
  const dtDem = new Date(input.dataDesligamento);

  const diffTime = Math.max(0, dtDem.getTime() - dtAdm.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const anosCompletos = Math.min(20, Math.floor(diffDays / 365.25));

  // Lei nº 12.506/2011: 30 dias + 3 dias por ano de serviço prestado (até o máximo de 90 dias)
  const diasAvisoPrevioLei12506 = Math.min(90, 30 + anosCompletos * 3);

  // Dias trabalhados no mês do desligamento
  const diaDesligamento = dtDem.getDate();
  const diasTrabalhadosMes = Math.min(30, diaDesligamento);
  const valorDia = input.salarioBase / 30;
  const saldoSalario = valorDia * diasTrabalhadosMes;

  // Meses trabalhados no ano corrente para 13º
  const mesDesligamento = dtDem.getMonth() + 1; // 1-12
  const fracaoMes13 = diaDesligamento >= 15 ? mesDesligamento : Math.max(0, mesDesligamento - 1);
  const decimoTerceiroBruto = (input.salarioBase / 12) * fracaoMes13;

  // Férias proporcionais (simplificada por avos decorridos)
  const mesesContrato = Math.floor(diffDays / 30.41);
  const avosFerias = Math.max(1, Math.min(12, (mesesContrato % 12) + (diaDesligamento >= 15 ? 1 : 0)));
  const feriasProporcionais = (input.salarioBase / 12) * avosFerias;
  const tercoFeriasProporcionais = feriasProporcionais / 3;

  const feriasVencidasValor = input.temFeriasVencidas ? input.salarioBase : 0;
  const tercoFeriasVencidas = feriasVencidasValor / 3;

  let avisoPrevioValor = 0;
  let multaFgtsPercentual = 0;
  let decimoTerceiroFinal = decimoTerceiroBruto;
  let feriasProporcionaisFinal = feriasProporcionais;
  let tercoProporcionaisFinal = tercoFeriasProporcionais;

  if (input.motivo === 'sem_justa_causa') {
    if (input.avisoPrevio === 'indenizado') {
      avisoPrevioValor = valorDia * diasAvisoPrevioLei12506;
    }
    multaFgtsPercentual = 0.40; // 40%
  } else if (input.motivo === 'acordo_484a') {
    if (input.avisoPrevio === 'indenizado') {
      avisoPrevioValor = (valorDia * diasAvisoPrevioLei12506) * 0.5; // 50% pela lei
    }
    multaFgtsPercentual = 0.20; // 20%
  } else if (input.motivo === 'pedido_demissao') {
    avisoPrevioValor = 0;
    multaFgtsPercentual = 0;
  } else if (input.motivo === 'justa_causa') {
    avisoPrevioValor = 0;
    multaFgtsPercentual = 0;
    decimoTerceiroFinal = 0;
    feriasProporcionaisFinal = 0;
    tercoProporcionaisFinal = 0;
  }

  const multaFgtsValor = input.saldoFgtsEstimado * multaFgtsPercentual;

  const totalBruto =
    saldoSalario +
    avisoPrevioValor +
    decimoTerceiroFinal +
    feriasProporcionaisFinal +
    tercoProporcionaisFinal +
    feriasVencidasValor +
    tercoFeriasVencidas;

  // Estimativa de desconto previdenciário sobre verbas remuneratórias (saldo + 13º)
  const basePrevidenciaria = saldoSalario + decimoTerceiroFinal;
  const inssEstimado = calcularInssProgressivo(basePrevidenciaria);

  const totalLiquidoAprox = Math.max(0, totalBruto - inssEstimado);

  const dtPrazo = new Date(dtDem.getTime() + 10 * 24 * 60 * 60 * 1000);
  const prazoPagamentoTexto = `Até 10 dias corridos: ${dtPrazo.toLocaleDateString('pt-BR')} (Art. 477, § 6º CLT)`;

  return {
    diasTrabalhadosMes,
    anosCompletos,
    diasAvisoPrevioLei12506,
    saldoSalario,
    avisoPrevioValor,
    decimoTerceiroProporcional: decimoTerceiroFinal,
    feriasProporcionais: feriasProporcionaisFinal,
    tercoFeriasProporcionais: tercoProporcionaisFinal,
    feriasVencidasValor,
    tercoFeriasVencidas,
    multaFgtsValor,
    totalBruto,
    inssEstimado,
    totalLiquidoAprox,
    prazoPagamentoTexto,
  };
}

export function calcularInssProgressivo(salario: number): number {
  if (salario <= 0) return 0;
  // Faixas oficiais 2025/2026:
  // 1: até 1.518,00 -> 7,5% (dedução 0)
  // 2: 1.518,01 até 2.793,88 -> 9% (dedução 22,77)
  // 3: 2.793,89 até 4.190,83 -> 12% (dedução 106,59)
  // 4: 4.190,84 até 8.157,41 -> 14% (dedução 190,40)
  // Teto RGPS: R$ 8.157,41 (desconto máx: R$ 951,64)

  if (salario <= 1518.0) {
    return salario * 0.075;
  } else if (salario <= 2793.88) {
    return salario * 0.09 - 22.77;
  } else if (salario <= 4190.83) {
    return salario * 0.12 - 106.59;
  } else if (salario <= 8157.41) {
    return salario * 0.14 - 190.4;
  } else {
    return 951.64; // Teto
  }
}
