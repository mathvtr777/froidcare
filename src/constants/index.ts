import { EmotionDefinition, ExerciseMeta, IntensityLevel } from '../types';

export const EMOTIONS: EmotionDefinition[] = [
  {
    id: 'ansiedade',
    label: 'Ansiedade',
    description: 'Sensação de agitação interna, apreensão ou inquietação.',
    category: 'anxious',
    accentColor: '#B88648',
  },
  {
    id: 'calma',
    label: 'Calma',
    description: 'Estado de tranquilidade, clareza e ritmo desacelerado.',
    category: 'calm',
    accentColor: '#528E75',
  },
  {
    id: 'sobrecarga',
    label: 'Sobrecarga',
    description: 'Sensação de excesso de demandas ou estímulos ao mesmo tempo.',
    category: 'anxious',
    accentColor: '#B06B52',
  },
  {
    id: 'tristeza',
    label: 'Tristeza',
    description: 'Sensação de recolhimento, perda ou desânimo.',
    category: 'heavy',
    accentColor: '#4A729A',
  },
  {
    id: 'irritacao',
    label: 'Irritação',
    description: 'Tensão ou incômodo persistente com situações ou pessoas.',
    category: 'anxious',
    accentColor: '#9E5B6A',
  },
  {
    id: 'alivio',
    label: 'Alívio',
    description: 'Sensação de soltura após uma preocupação ou esforço.',
    category: 'calm',
    accentColor: '#76A993',
  },
  {
    id: 'confusao',
    label: 'Confusão',
    description: 'Dificuldade para organizar pensamentos ou tomar decisões.',
    category: 'reflective',
    accentColor: '#6E6294',
  },
  {
    id: 'esperanca',
    label: 'Esperança',
    description: 'Sensação acolhedora em relação aos próximos passos.',
    category: 'energized',
    accentColor: '#5F9D84',
  },
  {
    id: 'cansaco',
    label: 'Cansaço',
    description: 'Fadiga física ou mental pedindo pausa e recuperação.',
    category: 'heavy',
    accentColor: '#5C6578',
  },
  {
    id: 'gratidao',
    label: 'Gratidão',
    description: 'Reconhecimento caloroso de um aspecto positivo ou acolhimento.',
    category: 'calm',
    accentColor: '#84B8A3',
  },
];

export const INTENSITY_LEVELS: IntensityLevel[] = [
  { value: 0, label: '0 — Nula', description: 'Nenhum impacto perceptível no momento.' },
  { value: 1, label: '1 — Muito leve', description: 'Apenas uma vaga percepção no fundo.' },
  { value: 2, label: '2 — Leve', description: 'Presente, mas fácil de ignorar.' },
  { value: 3, label: '3 — Notável', description: 'Claramente identificável, sem atrapalhar a rotina.' },
  { value: 4, label: '4 — Moderada baixa', description: 'Começa a solicitar alguma atenção.' },
  { value: 5, label: '5 — Moderada', description: 'Sensação evidente que afeta o ritmo do momento.' },
  { value: 6, label: '6 — Moderada alta', description: 'Desconforto que exige esforço para continuar tarefas.' },
  { value: 7, label: '7 — Intensa', description: 'Dificulta a concentração e pede uma pausa.' },
  { value: 8, label: '8 — Muito intensa', description: 'Preenche a maior parte da atenção mental ou física.' },
  { value: 9, label: '9 — Severa', description: 'Sensação quase avassaladora, necessidade imediata de apoio.' },
  { value: 10, label: '10 — Extrema', description: 'Intensidade máxima de sofrimento ou tensão percebida.' },
];

export const COMMON_TRIGGERS: string[] = [
  'Trabalho / Prazos',
  'Estudos / Cobrança',
  'Sono insuficiente',
  'Conflito interpessoal',
  'Notícias / Redes sociais',
  'Saúde / Dor física',
  'Sobrecarga de tarefas',
  'Incerteza sobre o futuro',
  'Ambiente ruidoso',
  'Alimentação irregular',
  'Mudança de rotina',
  'Sensação de solidão',
];

export const EXERCISES: ExerciseMeta[] = [
  {
    id: 'breathing',
    title: 'Respiração Guiada',
    shortDescription: 'Ritmo suave de inspirar, pausar e soltar para desacelerar o corpo.',
    durationMinutes: 3,
    category: 'respiracao',
    icon: 'Wind',
  },
  {
    id: 'grounding',
    title: 'Aterramento Sensorial (5-4-3-2-1)',
    shortDescription: 'Conecte-se com o ambiente através da visão, tato, audição, olfato e paladar.',
    durationMinutes: 4,
    category: 'sensorial',
    icon: 'Anchor',
  },
  {
    id: 'relaxation',
    title: 'Relaxamento Corporal',
    shortDescription: 'Percorra e solte tensões acumuladas em ombros, mandíbula e corpo.',
    durationMinutes: 5,
    category: 'corporal',
    icon: 'Sparkles',
  },
  {
    id: 'thought_organizer',
    title: 'Organizando os Pensamentos',
    shortDescription: 'Perguntas guiadas para diferenciar fatos, incertezas e passos possíveis.',
    durationMinutes: 4,
    category: 'cognitivo',
    icon: 'Brain',
  },
  {
    id: 'free_writing',
    title: 'Escrita Livre e Desabafo',
    shortDescription: 'Espaço privado sem regras para colocar sentimentos em palavras.',
    durationMinutes: 5,
    category: 'expressivo',
    icon: 'Feather',
  },
];

export const EMERGENCY_CONTACTS = [
  {
    name: 'CVV — Centro de Valorização da Vida',
    phone: '188',
    description: 'Apoio emocional e prevenção do suicídio. Atendimento gratuito 24h por telefone e chat.',
    link: 'https://cvv.org.br',
  },
  {
    name: 'SAMU — Serviço de Atendimento Móvel de Urgência',
    phone: '192',
    description: 'Emergências médicas e situações graves com risco à integridade física.',
    link: 'tel:192',
  },
  {
    name: 'CAPS — Centros de Atenção Psicossocial',
    phone: 'Procure a unidade SUS mais próxima',
    description: 'Serviço público do SUS para atenção em saúde mental e suporte contínuo.',
    link: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-mental',
  },
];

